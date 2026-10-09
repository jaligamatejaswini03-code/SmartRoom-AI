"""
AI Interior Design Chat Assistant Router
Answers user questions in real-time with full awareness of the active room design.
"""
import os
import json
from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="", tags=["Chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest):
    """
    Context-aware AI Interior Design Assistant.
    Understands current room type, dimensions, budget, furniture, style, and lighting.
    """
    user_msg = req.message.strip()
    ctx = req.design_context or {}

    room_type = ctx.get("room_type", "Living Room")
    dimensions = ctx.get("dimensions", "14 ft × 12 ft")
    style = ctx.get("style", "Modern")
    budget = ctx.get("budget", "₹1,00,000–₹2,00,000")
    colors = ", ".join([c.get("name", "") if isinstance(c, dict) else str(c) for c in ctx.get("color_palette", [])])
    furniture = ", ".join([f.get("name", "") if isinstance(f, dict) else str(f) for f in ctx.get("furniture_recommendations", [])])

    system_prompt = f"""You are 'SmartRoom AI Assistant', an empathetic, highly knowledgeable senior architectural interior designer.
The user is currently viewing this generated room design:
- Room Type: {room_type}
- Dimensions: {dimensions}
- Interior Style: {style}
- Allocated Budget: {budget}
- Current Color Palette: {colors}
- Recommended Furniture: {furniture}

Answer the user's question directly, practically, and concisely. Keep answers grounded in real interior design best practices, ergonomics, and value-engineering.
Give 2 to 3 actionable next steps or suggestions at the end."""

    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("AI_API_KEY")

    if api_key and api_key != "MY_GEMINI_API_KEY" and not api_key.startswith("your_"):
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = f"{system_prompt}\n\nUser Question: {user_msg}\n\nProvide your expert advice:"
            response = client.models.generateContent(
                model="gemini-3.8-flash",
                contents=prompt
            )
            reply_text = response.text
            return ChatResponse(
                reply=reply_text,
                suggested_actions=[
                    "Regenerate with lighter palette",
                    "Optimize storage layout",
                    "View budget breakdown"
                ]
            )
        except Exception as e:
            print(f"Gemini chat call failed: {e}")

    # Tailored contextual response generator for demo/offline mode
    lower = user_msg.lower()
    if "cheaper" in lower or "cost" in lower or "budget" in lower:
        reply = (
            f"To reduce the cost of your {room_type} without sacrificing the {style} aesthetic, "
            f"I recommend: \n1. **Material Value Engineering**: Swap solid wood joinery for engineered plywood with textured laminates (saves ~25% on carpentry).\n"
            f"2. **Direct-to-Consumer Lighting**: Opt for surface track lighting instead of recessed gypsum ceiling cutouts.\n"
            f"3. **Modular Flat-Pack Furniture**: Prioritize modular units for items like the wardrobe or TV credenza.\n\n"
            f"Would you like me to trigger the 'Optimize My Budget' workflow to apply these savings?"
        )
        actions = ["Run Budget Optimizer", "Swap materials to laminate", "Remove decorative extras"]
    elif "furniture" in lower or "remove" in lower:
        reply = (
            f"For your {dimensions} {room_type}, the core essentials are the primary seating and functional storage. "
            f"If you'd like to free up floor clearance or reduce expenditure, removing secondary items like the accent armchair or "
            f"supplementary side tables can reclaim up to 15-20 sq.ft of open negative space, creating a much airier circulation path."
        )
        actions = ["Remove accent pieces", "Increase walkway clearance", "Regenerate layout"]
    elif "color" in lower or "paint" in lower or "wall" in lower:
        reply = (
            f"For this {style} layout, painting the primary accent wall with a soothing muted tone (such as Sage Pine, Soft Greige, or Warm Oat) "
            f"will add dimensional depth while keeping adjacent walls in reflective off-white. This visually expands your {dimensions} footprint."
        )
        actions = ["Change to Warm Greige", "Change to Sage Accent", "Use textured limewash"]
    elif "lighting" in lower:
        reply = (
            f"Great lighting makes all the difference! In this {room_type}, layered illumination is key: \n"
            f"• **Ambient**: 3000K warm diffuse ceiling downlights.\n"
            f"• **Task**: Directional 400-lumen reading sconce or desk lamp.\n"
            f"• **Accent**: Concealed 2700K LED ribbon strips beneath the credenza or behind the headboard to create floating architectural warmth."
        )
        actions = ["Add 2700K cove light", "Add architectural track lights", "Dimmable controls"]
    elif "study" in lower or "work" in lower:
        reply = (
            f"To enhance this space for study/work: \n"
            f"1. Place a 48\"×24\" desk perpendicular to the natural light window to avoid screen reflections.\n"
            f"2. Add a dual-plug wire raceway to keep cables completely invisible.\n"
            f"3. Install two floating shelves directly above the desk for books and stationery."
        )
        actions = ["Add ergonomic study desk", "Add floating bookshelf", "Configure task lighting"]
    elif "storage" in lower:
        reply = (
            f"To maximize storage in your {dimensions} space: \n"
            f"• Utilize the full vertical height (up to the ceiling line) with seamless handle-less cabinets.\n"
            f"• Choose hydraulic under-bed or sofa storage compartments for seasonal items.\n"
            f"• Build a recessed perimeter niche that doesn't eat into the 36-inch walking corridor."
        )
        actions = ["Add full-height wardrobe", "Add under-bed hydraulic storage", "Recessed niche shelving"]
    else:
        reply = (
            f"Based on your {dimensions} {style} {room_type}, I'm here to refine any element! "
            f"We can tweak the color balance ({colors}), swap specific furniture items, improve space efficiency, "
            f"or fine-tune the ₹{budget} budget distribution. What would you like to explore next?"
        )
        actions = ["Optimize layout", "Adjust colors", "Review budget breakdown"]

    return ChatResponse(reply=reply, suggested_actions=actions)
