import os
import json
import logging
import asyncio
import httpx
from typing import List
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Nayi JSON Data file load karna
with open("KNOWLEDGE_BASE.json", "r", encoding="utf-8") as file:
    goals_data = json.load(file)

# Naya Master System Prompt
SYSTEM_PROMPT = f"""
You are the Virtual Architectural Consultant for Goals Floors, an expert AI assistant developed by Neyab Ansari.
Your goal is to provide highly engaging, consultative, and professional support to Architects, Interior Designers, Builders, and Retailers based strictly on the following KNOWLEDGE BASE:

{json.dumps(goals_data)}

CORE RULES FOR YOUR BEHAVIOR:

1. LANGUAGE & TONE: Always reply in the exact language the user uses. If they use Hinglish (Roman Hindi), reply in natural, friendly, and engaging Hinglish. Use emojis to make the conversation lively, but keep them limited (don't overuse).

2. BE A CONSULTANT, NOT JUST A BOT: If a user asks open-ended questions like "Deewar pe kya lagau?" (What should I put on the wall?) or "Ise kaise lagau?" (How to install?), give them creative interior design suggestions and practical installation advice based ONLY on Goals Floors products. Make the conversation fun, interesting, and highly valuable.

3. PRODUCT LINKS (MANDATORY): Whenever you suggest a product or category, you MUST include its relative URL in this exact Markdown format: [View Product Name](/products/exact-url-from-data).
   - CRITICAL: NEVER put a newline or space between `]` and `(`. Example: `[View Wall Panels](/products/wall-panels)` is CORRECT. `[View Wall Panels]\n(/products/wall-panels)` is WRONG.
   - Always keep the link on the same line as the product description.

4. HANDLING OUTSIDE/COMPETITOR PRODUCTS (THE PIVOT STRATEGY): You strictly deal in Goals Floors products. If a user asks about an outside product (e.g., Wallpaper, Normal Paint, Real Wood, Tile):
   - Step A: Politely point out a practical flaw or disadvantage of that outside product (e.g., Wallpaper tears easily and gets ruined by dampness/seelan; Paint requires regular maintenance; Real wood gets termites).
   - Step B: Immediately pitch a Goals Floors product as the perfect, premium alternative (e.g., "Iski jagah aap humare 100% waterproof WPC Fluted Panels ya PU Stone lagaiye...").

5. DEVELOPER CREDITS: If anyone asks who created you or the website, proudly state that you and the website were developed by Neyab Ansari, a Full Stack Developer from Gurugram.

6. LINKS & NAVIGATION: Use these exact formats for navigation:
   - For collections: `[View All Products](/products)`
   - For becoming a dealer: `[Become a Dealer](/dealer)`
   - For contact: `[Contact Us](/contact)`
   - Always ensure there is NO space between `]` and `(`.

7. BOUNDARIES: Do not invent prices, policies, or products. If something is completely out of scope, guide them to contact the team at +91 7217644573.
"""

# Gemini Settings
GEMINI_API_KEY = (os.environ.get("GEMINI_API_KEY") or "").strip()
GEMINI_MODEL = "gemini-flash-latest"

# Google Sheets Webhook
WEBHOOK_URL = os.environ.get("GOOGLE_SHEET_URL", "").strip()

app = FastAPI(title="Goals Floors AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

async def send_to_google_sheets(user_message: str, ai_response: str):
    """Background task to send chat logs to Google Sheets webhook without slowing down the user."""
    if not WEBHOOK_URL:
        logger.info("GOOGLE_SHEET_URL not set in environment. Skipping sync.")
        return
    
    try:
        async with httpx.AsyncClient() as http_client:
            payload = {
                "userMessage": user_message,
                "aiResponse": ai_response
            }
            # Sending data to Google Apps Script
            response = await http_client.post(WEBHOOK_URL, json=payload, timeout=5.0)
            if response.status_code == 200:
                logger.info("Successfully synced chat logs to Google Sheets.")
            else:
                logger.error(f"Google Sheet error: {response.status_code} - {response.text}")
    except Exception as e:
        logger.error(f"Connection failure to Google Sheets: {e}")


def build_history(messages: List[dict]):
    history = []
    for message in messages[:-1]:
        role = message.get("role", "user")
        content = message.get("content", "").strip()

        if not content or role == "system":
            continue

        if role == "assistant":
            role = "model"

        history.append({"role": role, "parts": [{"text": content}]})

    return history


def extract_gemini_text(event: dict) -> str:
    candidates = event.get("candidates") or []
    if not candidates:
        return ""

    content = candidates[0].get("content") or {}
    parts = content.get("parts") or []
    texts = []

    for part in parts:
        text = part.get("text")
        if text:
            texts.append(text)

    return "".join(texts)

async def generate_stream(messages: List[dict]):
    max_retries = 3
    retry_delay = 2  # Seconds to wait before first retry

    for attempt in range(max_retries):
        try:
            if not GEMINI_API_KEY:
                raise ValueError("GEMINI_API_KEY missing in app.py")

            history = build_history(messages)

            user_message = ""
            for message in reversed(messages):
                if message.get("role") == "user" and message.get("content", "").strip():
                    user_message = message["content"].strip()
                    break

            if not user_message:
                raise ValueError("No user message found in request")

            full_response = ""
            gemini_url = (
                f"https://generativelanguage.googleapis.com/v1beta/models/"
                f"{GEMINI_MODEL}:streamGenerateContent?key={GEMINI_API_KEY}&alt=sse"
            )
            
            # Build contents with system prompt as first message
            contents = [{"role": "user", "parts": [{"text": SYSTEM_PROMPT}]}, {"role": "model", "parts": [{"text": "Understood. I will follow all these rules."}]}]
            contents.extend(history)
            contents.append({"role": "user", "parts": [{"text": user_message}]})
            
            payload = {
                "contents": contents,
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 1024,
                },
            }

            async with httpx.AsyncClient(timeout=None) as http_client:
                async with http_client.stream("POST", gemini_url, json=payload) as response:
                    if response.status_code >= 400:
                        error_text = await response.aread()
                        error_msg = error_text.decode('utf-8', errors='ignore')
                        error_lower = error_msg.lower()
                        # FULL error log karo taaki debug ho sake
                        logger.error(f"[Gemini Error] Status: {response.status_code} | Body: {error_msg[:500]}")

                        # API Key invalid/missing check (specific)
                        if response.status_code in (401, 403) or "api key" in error_lower or "api_key" in error_lower or "not valid" in error_lower:
                            raise ValueError("API_KEY_INVALID")
                        # Rate limit check
                        elif response.status_code == 429 or "quota" in error_lower or "rate limit" in error_lower or "resource_exhausted" in error_lower:
                            if attempt < max_retries - 1:
                                logger.warning(f"Rate limit hit. Attempt {attempt + 1}, retrying in {retry_delay}s...")
                                await asyncio.sleep(retry_delay)
                                retry_delay *= 2
                                continue
                            raise ValueError("TRAFFIC_HIGH")
                        # Model not found check (specific to model errors)
                        elif response.status_code == 404 or ("model" in error_lower and ("not found" in error_lower or "does not exist" in error_lower)):
                            raise ValueError(f"MODEL_INVALID: {error_msg[:200]}")
                        else:
                            raise ValueError(f"Gemini API error {response.status_code}: {error_msg[:200]}")

                    async for line in response.aiter_lines():
                        if not line or not line.startswith("data:"):
                            continue

                        data = line[5:].strip()
                        if data == "[DONE]":
                            break

                        try:
                            event = json.loads(data)
                        except json.JSONDecodeError:
                            continue

                        content = extract_gemini_text(event)
                        if content:
                            full_response += content
                            yield f"data: {json.dumps({'content': content})}\n\n"
                    
            yield "data: [DONE]\n\n"

            # FIRE & FORGET: After stream is complete, send data to Google Sheets
            user_msg = messages[-1]["content"] if messages and messages[-1]["role"] == "user" else ""
            asyncio.create_task(send_to_google_sheets(user_msg, full_response))
            return # Success, exit retry loop

        except Exception as e:
            error_str = str(e)
            logger.error(f"Attempt {attempt + 1} failed: {error_str}")

            if "API_KEY_INVALID" in error_str:
                friendly_message = "⚙️ AI configuration error: API key is invalid or missing. Please contact the admin."
                yield f"data: {json.dumps({'error': friendly_message})}\n\n"
                break

            if "MODEL_INVALID" in error_str:
                friendly_message = "⚙️ AI model configuration error. Please contact the admin."
                yield f"data: {json.dumps({'error': friendly_message})}\n\n"
                break

            if attempt < max_retries - 1 and "TRAFFIC_HIGH" not in error_str:
                await asyncio.sleep(retry_delay)
                retry_delay *= 2
                continue

            # Final failure message
            friendly_message = "We apologize! 😅 Our server is currently experiencing high traffic or has reached its daily limit. Please try again after a few moments or contact us at +91 7217644573. 🙏"
            yield f"data: {json.dumps({'error': friendly_message})}\n\n"
            break

@app.get("/")
async def keep_alive():
    return {"status": "Goals AI is awake and running!"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    if not GEMINI_API_KEY or GEMINI_API_KEY == "PASTE_YOUR_GEMINI_API_KEY_HERE":
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY missing in app.py")
    messages_dict = [m.model_dump() for m in request.messages]
    return StreamingResponse(generate_stream(messages_dict), media_type="text/event-stream")