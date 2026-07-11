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

# Load environment variables from ../.env.local for local testing
try:
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env.local")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    if k not in os.environ:
                        os.environ[k] = v
except Exception as e:
    logger.warning(f"Could not load .env.local manually: {e}")

# Nayi JSON Data file load karna
with open("KNOWLEDGE_BASE.json", "r", encoding="utf-8") as file:
    goals_data = json.load(file)

def get_system_prompt(user_message: str = "") -> str:
    user_msg_lower = user_message.lower()
    
    dynamic_data = {
        "developer_info": goals_data.get("developer_info"),
        "company_pages": goals_data.get("company_pages"),
        "legal_and_policies": goals_data.get("legal_and_policies"),
        "products": []
    }
    
    # =====================================================================
    # SMART KEYWORD GROUPS — Category-based + Hinglish + Specific product
    # =====================================================================
    # Group 1: Flooring — agar user ne koi bhi flooring word use kiya, sab flooring products ka full data do
    FLOORING_KEYWORDS = ["spc", "flooring", "floor", "farz", "farsh", "laminate", "herringbone", "hybrid", "vinyl"]
    # Group 2: Wall panels
    WALL_KEYWORDS = ["wall", "panel", "deewar", "wpc", "pvc", "fluted", "stone", "pu stone", "cladding", "moulding", "trim", "charcoal", "cobra"]
    # Group 3: Ceilings
    CEILING_KEYWORDS = ["ceiling", "chhat", "baffle", "linear", "tube", "timber", "partition"]
    # Group 4: Outdoor / exterior
    OUTDOOR_KEYWORDS = ["outdoor", "exterior", "outside", "bahar", "decking", "deck", "grass", "turf", "lawn", "louver", "louvre", "upfit", "balcony", "terrace", "garden"]

    # Which DB categories map to which group
    FLOORING_CATEGORIES = ["premium-flooring"]
    WALL_CATEGORIES = ["wall-panels"]
    CEILING_CATEGORIES = ["ceilings"]
    OUTDOOR_CATEGORIES = ["outdoors"]

    # Detect which category groups the user query is about
    user_wants_flooring = any(kw in user_msg_lower for kw in FLOORING_KEYWORDS)
    user_wants_wall     = any(kw in user_msg_lower for kw in WALL_KEYWORDS)
    user_wants_ceiling  = any(kw in user_msg_lower for kw in CEILING_KEYWORDS)
    user_wants_outdoor  = any(kw in user_msg_lower for kw in OUTDOOR_KEYWORDS)

    # Direct specific product keywords that always match their exact product
    DIRECT_PRODUCT_KEYWORDS = ["spc", "wpc", "pvc", "cobra", "baffle", "louver", "louvre", "upfit",
                                "moulding", "herringbone", "hybrid", "artificial", "laminate", "stone"]

    for p in goals_data.get("products", []):
        p_name     = p.get("name", "").lower()
        p_category = p.get("category", "").lower()
        p_slug     = p.get("slug", "").lower()
        p_desc     = p.get("short_description", "").lower()
        search_text = f"{p_name} {p_category} {p_slug} {p_desc}"

        is_match = False

        # 1. Direct keyword check — user specifically mentioned this product's keyword
        for kw in DIRECT_PRODUCT_KEYWORDS:
            if kw in user_msg_lower and kw in search_text:
                is_match = True
                break

        # 2. Category group match — user asked about a category, so show all products in that category
        if not is_match:
            if user_wants_flooring and p_category in FLOORING_CATEGORIES:
                is_match = True
            elif user_wants_wall and p_category in WALL_CATEGORIES:
                is_match = True
            elif user_wants_ceiling and p_category in CEILING_CATEGORIES:
                is_match = True
            elif user_wants_outdoor and p_category in OUTDOOR_CATEGORIES:
                is_match = True

        if is_match:
            # Matched: essential fields only (no id/slug/category/variants — saves tokens)
            dynamic_data["products"].append({
                "name": p.get("name"),
                "url": p.get("url"),
                "price_range": p.get("price_range"),
                "short_description": p.get("short_description"),
                "details": p.get("details")
            })
        else:
            # Unmatched: name + url + price only (maximum token savings)
            dynamic_data["products"].append({
                "name": p.get("name"),
                "url": p.get("url"),
                "price_range": p.get("price_range")
            })

    return f"""
You are the Virtual Architectural Consultant for Goals Floors, an expert AI assistant developed by Goals Floors Team.
Your goal is to provide highly engaging, consultative, and professional support to Architects, Interior Designers, Builders, and Retailers based strictly on the following KNOWLEDGE BASE:
{json.dumps(dynamic_data)}
CORE RULES FOR YOUR BEHAVIOR:
1. LANGUAGE & TONE: Always reply in the exact language the user uses. If they use Hinglish (Roman Hindi), reply in natural, friendly, and engaging Hinglish. Use exactly 2-3 emojis per response — place them naturally at key moments (e.g., when introducing a product ✨, confirming a benefit 💧, or ending warmly 😊). Never use emojis on every sentence.
2. BE A CONSULTANT, NOT JUST A BOT: If a user asks open-ended questions like "Deewar pe kya lagau?" (What should I put on the wall?) or "Ise kaise lagau?" (How to install?), give them creative interior design suggestions and practical installation advice based ONLY on Goals Floors products. Make the conversation fun, interesting, and highly valuable.
3. PRODUCT LINKS (MANDATORY): Whenever you suggest a product or category, you MUST include its relative URL in this exact Markdown format: [View Product Name](/products/exact-url-from-data).
   - CRITICAL: NEVER put a newline or space between `]` and `(`. Example: `[View Wall Panels](/products/wall-panels)` is CORRECT. `[View Wall Panels]\\n(/products/wall-panels)` is WRONG.
   - Always keep the link on the same line as the product description.
4. HANDLING OUTSIDE/COMPETITOR PRODUCTS (THE PIVOT STRATEGY): You strictly deal in Goals Floors products. If a user asks about an outside product (e.g., Wallpaper, Normal Paint, Real Wood, Tile):
   - Step A: Politely point out a practical flaw or disadvantage of that outside product (e.g., Wallpaper tears easily and gets ruined by dampness/seelan; Paint requires regular maintenance; Real wood gets termites).
   - Step B: Immediately pitch a Goals Floors product as the perfect, premium alternative (e.g., "Iski jagah aap humare 100% waterproof WPC Fluted Panels ya PU Stone lagaiye...").
5. DEVELOPER CREDITS: If anyone asks who created you or the website, proudly state that you and the website were developed by Goals Floors Team, a Full Stack Developer from Gurugram.
6. LINKS & NAVIGATION: Use these exact formats for navigation:
   - For collections: `[View All Products](/products)`
   - For becoming a dealer: `[Become a Dealer](/dealer)`
   - For contact: `[Contact Us](/contact)`
   - Always ensure there is NO space between `]` and `(`.
7. BOUNDARIES: Do not invent prices, policies, or products. If something is completely out of scope, guide them to contact the team at +91 7217644573.
8. PRODUCT COMPARISONS (THE AI COMPARE TOOL): If a user asks you to compare two products (e.g., "SPC Flooring vs Laminate Flooring" or "Which is better between PU Stone and Fluted Panel?"):
   - DO NOT provide the comparison yourself.
   - Tell them that Goals Floors has a dedicated, built-in Real-Market AI Comparison tool specifically designed for this.
   - Give them the link to the compare page: `[Use AI Compare Tool](/compare)` so they can generate a detailed, side-by-side comparison report.
9. THE QUIZ TRIGGER (CRITICAL): If the user needs help choosing, suggest the Product Match Quiz. You MUST insert this EXACT secret tag INLINE where you want the quiz button to appear: [ACTION:TRIGGER_QUIZ]. You can continue your sentence after the tag. Example: "Aap confuse hain toh ye quiz lijiye: \\n\\n[ACTION:TRIGGER_QUIZ]\\n\\nIske baad main aapko quotes de dunga!"
"""

# Groq Settings — Multi-Key Rotation Pool
# Keys are tried in order; on 413/429, next key is used automatically
_raw_keys = [
    (os.environ.get("GROQ_API_KEY") or os.environ.get("groq") or "").strip(),
    (os.environ.get("GROQ_API_KEY2") or "").strip(),
    (os.environ.get("GROQ_API_KEY3") or "").strip(),
]
GROQ_API_KEYS = [k for k in _raw_keys if k]  # Remove empty keys
GROQ_MODEL = "llama-3.1-8b-instant"
if GROQ_API_KEYS:
    logger.info(f"Groq key pool loaded: {len(GROQ_API_KEYS)} key(s) available.")
else:
    logger.error("No Groq API keys found! Check environment variables.")

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

        history.append({"role": role, "content": content})

    return history


def extract_groq_text(event: dict) -> str:
    choices = event.get("choices") or []
    if not choices:
        return ""
    delta = choices[0].get("delta") or {}
    return delta.get("content") or ""

async def generate_stream(messages: List[dict]):
    if not GROQ_API_KEYS:
        yield f"data: {json.dumps({'error': '⚙️ AI configuration error: No API keys found. Please contact the admin.'})}\n\n"
        return

    history = build_history(messages)

    user_message = ""
    for message in reversed(messages):
        if message.get("role") == "user" and message.get("content", "").strip():
            user_message = message["content"].strip()
            break

    if not user_message:
        yield f"data: {json.dumps({'error': 'No user message found.'})}\n\n"
        return

    groq_url = "https://api.groq.com/openai/v1/chat/completions"

    # Build contents (quiz or normal)
    if user_message.startswith("[ACTION:QUIZ_COMPLETE]"):
        try:
            json_str = user_message.replace("[ACTION:QUIZ_COMPLETE]", "").strip()
            quiz_data = json.loads(json_str)
            path_str = " -> ".join(quiz_data.get("path", []))
            product_name = quiz_data.get("productName", "")

            matched_product = None
            for p in goals_data.get("products", []):
                if product_name.lower() in p.get("name", "").lower() or p.get("name", "").lower() in product_name.lower():
                    matched_product = p
                    break

            product_url = matched_product.get('url', '/products') if matched_product else '/products'
            product_price = matched_product.get('price_range', '') if matched_product else 'Contact us'

            quiz_prompt = f"""You are the Goals Floors AI Consultant.
A user just completed our Product Match Quiz.
Their journey: {path_str}
The exact product recommended by our system: {product_name}

Here are the details of the recommended product from our Knowledge Base:
{json.dumps(matched_product) if matched_product else "Use your general knowledge about this product."}

TASK:
Write a friendly, extremely concise message to the user recommending this exact product in just 3-4 short bullet points (a few words each).

You MUST strictly follow this exact format and include the markdown link:
* **Perfect Match:** [View {product_name}]({product_url}) - Price: {product_price}
* **Why it fits:** [Write 1 short sentence summarizing why it fits, using a few words only]
* **Key Spec:** [Mention 1 main spec like thickness or material in a few words]
* **Alternative:** [Suggest 1 other product from our catalog]

CRITICAL RULES:
- Do NOT include any of your own internal thought processes or reasoning blocks in the output.
- Keep every bullet point extremely short (just a few words).
- Output ONLY the final response exactly as formatted above.
"""
            contents = [{"role": "system", "content": get_system_prompt(quiz_prompt)}, {"role": "user", "content": quiz_prompt}]
        except Exception as e:
            logger.error(f"Error parsing quiz action: {e}")
            contents = [{"role": "system", "content": get_system_prompt(user_message)}, {"role": "user", "content": user_message}]
    else:
        contents = [{"role": "system", "content": get_system_prompt(user_message)}]
        contents.extend(history)
        contents.append({"role": "user", "content": user_message})

    payload = {
        "model": GROQ_MODEL,
        "messages": contents,
        "temperature": 0.7,
        "max_tokens": 1024,
        "stream": True
    }

    # =========================================================
    # MULTI-KEY ROTATION: Try each key in pool on 413/429 error
    # =========================================================
    full_response = ""
    last_error = ""

    for key_index, api_key in enumerate(GROQ_API_KEYS):
        try:
            logger.info(f"Trying Groq key #{key_index + 1}...")
            success = False

            async with httpx.AsyncClient(timeout=15.0) as http_client:
                async with http_client.stream(
                    "POST", groq_url,
                    headers={"Authorization": f"Bearer {api_key}"},
                    json=payload
                ) as response:

                    if response.status_code >= 400:
                        error_text = await response.aread()
                        error_msg = error_text.decode('utf-8', errors='ignore')
                        error_lower = error_msg.lower()
                        logger.error(f"[Key #{key_index+1}] Status: {response.status_code} | {error_msg[:300]}")

                        # Invalid key — don't try next keys, fail immediately
                        if response.status_code in (401, 403) or "api key" in error_lower or "not valid" in error_lower:
                            yield f"data: {json.dumps({'error': '⚙️ AI configuration error: API key is invalid. Please contact the admin.'})}\n\n"
                            return

                        # 413 Payload Too Large or 429 Rate Limit — try next key
                        elif response.status_code in (413, 429) or "rate_limit" in error_lower or "too large" in error_lower or "quota" in error_lower:
                            last_error = f"Key #{key_index+1} hit limit ({response.status_code}). Trying next key..."
                            logger.warning(last_error)
                            continue  # Try next key in pool

                        # Model error
                        elif response.status_code == 404:
                            yield f"data: {json.dumps({'error': '⚙️ AI model configuration error. Please contact the admin.'})}\n\n"
                            return

                        else:
                            last_error = f"Groq error {response.status_code}"
                            logger.error(last_error)
                            continue  # Try next key

                    # Stream the response
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
                        content = extract_groq_text(event)
                        if content:
                            full_response += content
                            yield f"data: {json.dumps({'content': content})}\n\n"

                    success = True

            if success:
                yield "data: [DONE]\n\n"
                # Fire & forget: log to Google Sheets
                user_msg = messages[-1]["content"] if messages and messages[-1]["role"] == "user" else ""
                asyncio.create_task(send_to_google_sheets(user_msg, full_response))
                return  # Done successfully

        except Exception as e:
            last_error = str(e)
            logger.error(f"[Key #{key_index+1}] Exception: {last_error}")
            continue  # Try next key

    # All keys exhausted
    logger.error(f"All {len(GROQ_API_KEYS)} Groq key(s) failed. Last error: {last_error}")
    friendly_message = "We apologize! 😅 Our server is currently experiencing high traffic or has reached its daily limit. Please try again after a few moments or contact us at +91 7217644573. 🙏"
    yield f"data: {json.dumps({'error': friendly_message})}\n\n"

@app.get("/")
async def keep_alive():
    return {"status": "Goals AI is awake and running!"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    messages_dict = [m.model_dump() for m in request.messages]
    return StreamingResponse(generate_stream(messages_dict), media_type="text/event-stream")