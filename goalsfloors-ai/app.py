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
from huggingface_hub import AsyncInferenceClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# JSON Data Load Karna
with open("data.json", "r") as file:
    goals_data = json.load(file)

# Dynamic System Prompt Banana
SYSTEM_PROMPT = f"""You are the Virtual Architectural Consultant for Goals Floors.

CORE BRAND INFO: {goals_data['brand_info']}
PRODUCTS: {json.dumps(goals_data['products'])}
POLICIES: {json.dumps(goals_data['policies'])}

RULES:
1. MATCH LANGUAGE: Always reply in the exact language the user uses (English or Hinglish).
2. TONE: Premium, professional, highly polite, and consultative.
3. PRICING: NEVER give exact prices. Guide them to connect with an Account Manager.
"""

# Baaki code tumhara same rahega...
HF_TOKEN = os.environ.get("HF_TOKEN", "").strip()
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"
WEBHOOK_URL = os.environ.get("GOOGLE_SHEET_URL", "").strip()
# ... [Baaki ka FastApi Code] ...
app = FastAPI(title="Goals Floors AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncInferenceClient(model=MODEL_ID, token=HF_TOKEN)

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

async def generate_stream(messages: List[dict]):
    try:
        conversation = [{"role": "system", "content": SYSTEM_PROMPT}]
        conversation.extend(messages)

        stream = await client.chat_completion(
            messages=conversation,
            stream=True,
            max_tokens=512,
            temperature=0.7
        )

        full_response = ""
        async for chunk in stream:
            if hasattr(chunk, 'choices') and chunk.choices and len(chunk.choices) > 0:
                content = chunk.choices[0].delta.content
                if content:
                    full_response += content
                    # Stream chunk to frontend instantly
                    yield f"data: {json.dumps({'content': content})}\n\n"
                
        yield "data: [DONE]\n\n"

        # FIRE & FORGET: After stream is complete, send data to Google Sheets
        user_msg = messages[-1]["content"] if messages and messages[-1]["role"] == "user" else ""
        asyncio.create_task(send_to_google_sheets(user_msg, full_response))

    except Exception as e:
        logger.error(f"Error: {e}")
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

@app.get("/")
async def keep_alive():
    return {"status": "Goals AI is awake and running!"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    if not HF_TOKEN:
        raise HTTPException(status_code=500, detail="HF_TOKEN missing in settings")
    messages_dict = [m.model_dump() for m in request.messages]
    return StreamingResponse(generate_stream(messages_dict), media_type="text/event-stream")