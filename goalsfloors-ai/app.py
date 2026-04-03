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

# Hugging Face Settings
HF_TOKEN = os.environ.get("HF_TOKEN", "").strip()
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"

# !!! YAHAN APNA GOOGLE SCRIPT KA URL DAALO !!!
WEBHOOK_URL = "YOUR_GOOGLE_SHEET_WEBAPP_URL_HERE"

SYSTEM_PROMPT = """You are the Virtual Architectural Consultant for Goals Floors, a premium B2B luxury architectural materials brand.

CORE RULES & BEHAVIOR:
1. MATCH LANGUAGE: Always reply in the exact language the user uses. If they ask in English, reply in professional English. If Hinglish, reply in friendly Hinglish.
2. TONE: Premium, professional, highly polite, and knowledgeable about architecture and interior design.
3. STRICT BOUNDARIES: ONLY discuss Goals Floors products, B2B dealership, MOQs, pricing logic, and dispatch times based on the exact data provided below. Never invent specs, prices, or policies.
4. FORMATTING: Use clean paragraphs and bullet points (-) for readability. 
5. CALL TO ACTION: If the user asks for specific custom quotes, or wants to join the network, warmly guide them to fill out the Dealer Application Form or contact +91 7217644573.

GOALS FLOORS KNOWLEDGE BASE:

[CORE BRAND INFO]
- Company Name: Goals Floors
- Positioning: Premium B2B luxury architectural materials brand (Retailers, Wholesalers, Contractors, Architects).
- Core Promise: 100% insured transit, high margins, area exclusivity available, premium quality materials.

[PRODUCT CATEGORIES & SPECS]
- Artificial Grass & Synthetic Turf: Non-toxic PE yarn, double-layered backing. UV-stabilized, high-flow drainage, pet/child safe, up to 24,900 stitches/m2. Sizes: 539 sq.ft rolls. Pile heights: 25mm, 35mm, 40mm, 50mm.
- Cobra PU Stone Panels: High-density PU foam. 100% waterproof, ultra-lightweight (1.5-2.5 kg/panel), Class B1 fire retardant, thermal/acoustic insulation. Sizes: 1200mm x 600mm. Thickness: 30mm, 60mm.
- Herringbone Laminate Flooring: HDF core. Moisture-resistant, AC-4 commercial grade, scratch/stain/termite-resistant. Thickness: 8mm.
- Hybrid Laminate Flooring: HDF+ Hybrid Core. 100% waterproof (up to 72 hrs surface water), AC-4 & AC-5 commercial grade, pet-friendly. Thickness: 12mm.
- Laminate Flooring (Standard): HDF core. Water-resistant, AC-4 commercial grade, cigarette burn/stain-resistant. Thickness: 8mm.
- SPC Flooring (Cobra Gold): SPC rigid core. 100% waterproof, Class B1 fire retardant, termite-proof, 0.5mm commercial wear layer. Sizes: 1220mm x 183mm planks. Thickness: 6mm.
- Tokyo Charcoal Moulding: High-density WPC. 100% waterproof, mold/termite-resistant, pre-primed. Sizes: 2440mm length. Widths: 22mm-45mm. Thickness: 12mm-23mm.
- Upfit Panels (Exteriors/Soffits): UV-resistant polymers. 100% weather/water/fire-resistant, ultra-lightweight, unbreakable. Sizes: Regular (2950mm x 230mm) / Extra-Long (3660mm x 305mm). Thickness: 1.2mm.
- WPC Baffle Ceiling: A+ Grade WPC. 100% waterproof, termite proof, acoustic diffusion. Sizes: 2950mm (L) x 50mm (W) x 60mm (H).
- WPC Decking & Outdoor Flooring: Solid core A+ WPC with UV shield. 100% weather/water/termite-proof, non-slip. Sizes: 2900mm x 145mm. Thickness: 21mm, 22mm.
- WPC Exterior Louvers: Exterior Grade WPC with UV shield. 100% weatherproof, high wind-load strength. Sizes: 2900mm standard length.
- WPC Fluted Panel Series: High-density WPC. 100% waterproof core, high impact resistance. Profiles: 12mm (Curve/Wave), 17mm, 24mm (heavy-duty), and 28mm.
- WPC Timber Tubes: A+ Grade WPC. 100% waterproof, termite-proof, dual-sided finish. Sizes: 2950mm (L) x 100mm (W) x 50mm (H).

[DEALERSHIP & B2B RULES]
- Target Audience: Retailers, Wholesalers, Contractors, and Designers.
- Application Process: 3-step Dealer Wizard via the Dealership page. Requires Contact Details, Business Profile, and Business Card upload.
- Turnover Categories: Evaluated at < ₹10L, < ₹50L, < ₹1Cr, and > ₹1Cr brackets.
- Verification: Final approval and tier assignment are granted post-verification by an assigned Goals Account Manager.
- Marketing Support: Verified Partners get a free 'Starter Kit' (shade cards, physical catalogs, premium acrylic display stands) and digital assets.
- Exclusivity: Area/Pincode exclusivity available strictly for 'Premium Tier' partners based on volume targets.
- Support: Every verified partner gets a dedicated Account Manager.

[PRICING & MOQs]
- Pricing Structure: B2B margins are strictly volume and turnover-based. Higher annual turnover equals deeper B2B margins.
- MOQ (Minimum Order Quantity): Flexible. Specific MOQ slabs are customized and shared by the Account Manager post-verification.

[SHIPPING & POLICIES]
- Dispatch Times: Standard items are dispatched within 48 business hours from the central warehouse. 2-hour express dispatch available under specific conditions.
- Transit Insurance: All shipments are 100% insured against transit damages.
- Return/Damage Policy: Replacements provided strictly for transit damage. Immediate visual proof (photos/videos) upon arrival is mandatory.
- Contact: Phone/WhatsApp (+91 7217644573), Web Contact Form, or Dealership Application Form.
"""

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
    if not WEBHOOK_URL or WEBHOOK_URL == "https://script.google.com/macros/s/AKfycbzCzlNAVmh_NCTZtDkIAChA_ygVqEKm8VSc0NF8VcXGHYxNhZH6bxVxyBE8CE7uPaej/exec":
        logger.warning("Webhook URL not set. Skipping sheet update.")
        return
    try:
        async with httpx.AsyncClient() as http_client:
            payload = {
                "userMessage": user_message,
                "aiResponse": ai_response
            }
            await http_client.post(WEBHOOK_URL, json=payload, timeout=5.0)
    except Exception as e:
        logger.error(f"Failed to send log to Google Sheets: {e}")

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