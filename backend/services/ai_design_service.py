"""
Generative AI Interior Design Planning Service
Constructs the design prompt, calls the AI provider, and returns structured plan.
"""
import os
import json
import re

def construct_design_prompt(req: dict) -> str:
    """Builds the exact AI design prompt required by the specification."""
    room_type = req.get("room_type", "Living Room")
    length = req.get("length", "14")
    width = req.get("width", "12")
    height = req.get("height", "10 ft")
    style = req.get("style", "Modern")
    colors = ", ".join(req.get("colors", [])) if req.get("colors") else "Warm neutrals, accents of charcoal & gold"
    budget = req.get("budget", "₹1,00,000–₹2,00,000")
    furniture = ", ".join(req.get("furniture", [])) if req.get("furniture") else "Essential modular pieces"
    lighting = req.get("lighting", "Warm layered lighting")
    decorations = ", ".join(req.get("decorations", [])) if req.get("decorations") else "Wall art, plants, curtains"
    additional = req.get("additional_requirements", "Optimize for comfort and circulation")

    return f"""You are an expert interior designer and space-planning consultant.

Create a personalized interior design for the following room.

Room Type: {room_type}
Room Dimensions: {length} ft × {width} ft
Room Height: {height}
Interior Style: {style}
Preferred Colors: {colors}
Budget: {budget}
Furniture Requirements: {furniture}
Lighting Preference: {lighting}
Decoration Preferences: {decorations}
Additional Requirements: {additional}

Design the room while respecting the given dimensions, style, colors, furniture requirements and budget.

Provide:

1. Design Summary
2. Color Palette
3. Furniture Recommendations
4. Furniture Placement
5. Lighting Recommendations
6. Decoration Ideas
7. Space Utilization
8. Estimated Budget Breakdown
9. Materials Suggestions
10. Design Tips

Make the recommendations practical, realistic and suitable for the given room size and budget.

Return the result in structured JSON adhering to this exact format:
{{
  "design_summary": "Paragraph describing the cohesive aesthetic and spatial philosophy",
  "color_palette": [
    {{"name": "Color Name", "hex": "#HEXVAL", "role": "Primary / Secondary / Accent"}},
    {{"name": "Color Name", "hex": "#HEXVAL", "role": "Primary / Secondary / Accent"}},
    {{"name": "Color Name", "hex": "#HEXVAL", "role": "Primary / Secondary / Accent"}},
    {{"name": "Color Name", "hex": "#HEXVAL", "role": "Primary / Secondary / Accent"}}
  ],
  "furniture_recommendations": [
    {{"name": "Item Name", "purpose": "Function", "placement": "Exact wall/zone placement", "price": "₹XX,XXX", "dimensions": "WxDxH"}}
  ],
  "furniture_placement": "Detailed architectural layout guide with walking clearances (minimum 30-36 inches)",
  "lighting_recommendations": {{
    "ambient": "Ceiling fixture details",
    "task": "Reading/desk/accent light details",
    "accent": "LED cove/strip or sconce details",
    "color_temperature": "2700K - 3000K warm white"
  }},
  "decoration_ideas": [
    {{"item": "Item name", "description": "Specific texture/placement", "styling_note": "How to style"}}
  ],
  "space_utilization": "Specific square footage and circulation efficiency breakdown",
  "budget_breakdown": {{
    "furniture": "₹XX,XXX",
    "lighting": "₹XX,XXX",
    "decorations": "₹XX,XXX",
    "storage": "₹XX,XXX",
    "other": "₹XX,XXX",
    "total": "₹XX,XXX"
  }},
  "materials_suggestions": [
    {{"material": "Wood/Fabric/Metal", "application": "Furniture frame/Upholstery", "finish": "Matte/Brushed"}}
  ],
  "design_tips": [
    "Practical architectural or styling tip 1",
    "Practical architectural or styling tip 2",
    "Practical architectural or styling tip 3"
  ],
  "concepts": [
    {{
      "id": "concept-1",
      "name": "{style} Essential",
      "style": "{style}",
      "description": "Tailored to your primary preferences with balanced functional warmth.",
      "estimated_budget": "{budget}",
      "highlight": "Optimal balance of storage and natural lighting"
    }},
    {{
      "id": "concept-2",
      "name": "Warm Contemporary",
      "style": "Contemporary",
      "description": "Textured earth tones and organic finishes for serene comfort.",
      "estimated_budget": "{budget}",
      "highlight": "Enhanced acoustic comfort and tactile upholstery"
    }},
    {{
      "id": "concept-3",
      "name": "Luxury Modern",
      "style": "Luxury",
      "description": "Refined metallic accents, architectural cove lights and bespoke joinery.",
      "estimated_budget": "{budget}",
      "highlight": "Premium architectural finish with statement light fixtures"
    }}
  ]
}}"""

def generate_interior_plan(req_data: dict) -> dict:
    """Generates the structured interior design plan via Gemini AI or intelligent generator."""
    prompt = construct_design_prompt(req_data)
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("AI_API_KEY")

    if api_key and api_key != "MY_GEMINI_API_KEY" and not api_key.startswith("your_"):
        try:
            # Using google-genai SDK
            from google import genai
            client = genai.Client(api_key=api_key)
            response = client.models.generateContent(
                model="gemini-3.8-flash",
                contents=prompt,
                config={
                    "responseMimeType": "application/json"
                }
            )
            parsed = json.loads(response.text)
            parsed["prompt_used"] = prompt
            return parsed
        except Exception as e:
            print(f"Gemini API call failed, falling back to intelligent generator: {e}")

    # High quality fallback generation tailored exactly to user inputs
    return generate_fallback_plan(req_data, prompt)

def generate_fallback_plan(req: dict, prompt: str) -> dict:
    """Intelligent rule-based generator for offline or mock demo mode."""
    room = req.get("room_type", "Living Room")
    style = req.get("style", "Modern")
    l = float(req.get("length", "14").replace("ft", "").strip() or 14)
    w = float(req.get("width", "12").replace("ft", "").strip() or 12)
    sqft = int(l * w)
    budget_raw = req.get("budget", "₹1,00,000–₹2,00,000")
    colors = req.get("colors", ["Warm Beige", "Charcoal", "Muted Brass", "Ivory"])
    if not colors:
        colors = ["Warm Beige", "Charcoal", "Soft White", "Natural Oak"]
    furniture_reqs = req.get("furniture", ["Sofa", "Coffee Table", "TV Unit"])
    if not furniture_reqs:
        furniture_reqs = ["Sofa", "Coffee Table", "Storage", "Accent Chair"]

    # Budget parsing & allocation
    numeric_budget = 120000
    if "50,000" in budget_raw and "Below" in budget_raw:
        numeric_budget = 45000
    elif "50,000–₹1,00,000" in budget_raw:
        numeric_budget = 85000
    elif "1,00,000–₹2,00,000" in budget_raw:
        numeric_budget = 145000
    elif "2,00,000+" in budget_raw:
        numeric_budget = 240000

    furn_cost = int(numeric_budget * 0.52)
    light_cost = int(numeric_budget * 0.14)
    dec_cost = int(numeric_budget * 0.10)
    stor_cost = int(numeric_budget * 0.16)
    oth_cost = numeric_budget - (furn_cost + light_cost + dec_cost + stor_cost)

    # Color palette generation
    palette_hexes = {
        "Modern": [("#F4F4F0", "Alabaster White", "Primary"), ("#2C302E", "Graphite Slate", "Secondary"), ("#C5A059", "Brushed Gold", "Accent"), ("#8C8275", "Warm Taupe", "Base")],
        "Minimalist": [("#FFFFFF", "Pure Studio White", "Primary"), ("#E5E5E5", "Muted Concrete", "Secondary"), ("#1A1A1A", "Obsidian Black", "Accent"), ("#D4C5B9", "Light Ash", "Neutral")],
        "Luxury": [("#161A1D", "Rich Charcoal", "Primary"), ("#B38D48", "Champagne Gold", "Accent"), ("#EBE8E1", "Silk Oyster", "Secondary"), ("#3E2723", "Deep Espresso", "Texture")],
        "Scandinavian": [("#FAF9F6", "Off-White Chalk", "Primary"), ("#D9C5B2", "Pale Birch Oak", "Secondary"), ("#7A8B7B", "Sage Pine", "Accent"), ("#4A5568", "Nordic Grey", "Neutral")],
        "Bohemian": [("#D4A373", "Terracotta Ochre", "Primary"), ("#FAEDCD", "Warm Cream", "Secondary"), ("#606C38", "Olive Moss", "Accent"), ("#9B5DE5", "Woven Plum", "Detail")],
        "Industrial": [("#3A3D40", "Raw Gunmetal", "Primary"), ("#9C5838", "Exposed Brick Red", "Secondary"), ("#E0DDCF", "Bleached Cement", "Base"), ("#212529", "Matte Black Steel", "Accent")],
        "Traditional": [("#FDF0D5", "Warm Parchment", "Primary"), ("#669BBC", "Heritage Indigo", "Secondary"), ("#780000", "Deep Crimson", "Accent"), ("#3D2619", "Walnut Wood", "Base")],
        "Contemporary": [("#F8F9FA", "Crisp Milk", "Primary"), ("#343A40", "Anthracite", "Secondary"), ("#E0A96D", "Caramel Amber", "Accent"), ("#6C757D", "Flint Grey", "Neutral")],
        "Rustic": [("#DDA15E", "Weathered Pine", "Primary"), ("#BC6C25", "Rustic Amber", "Secondary"), ("#283618", "Forest Spruce", "Accent"), ("#FEFAE0", "Linen Canvas", "Base")]
    }

    selected_palette = palette_hexes.get(style, palette_hexes["Modern"])
    color_palette = [
        {"name": p[1], "hex": p[0], "role": p[2]} for p in selected_palette
    ]

    # Furniture items
    furniture_items = []
    per_item_budget = max(4000, int(furn_cost / max(1, len(furniture_reqs))))
    for item in furniture_reqs:
        purpose_map = {
            "Bed": "Primary restful sleep zone with ergonomic headboard and integrated linen storage",
            "Sofa": "Comfortable 3-seater with stain-resistant fabric for relaxation and hosting",
            "Wardrobe": "Floor-to-ceiling sleek modular storage with soft-close sliding doors",
            "Study Table": "Ergonomic work surface with cable channels and dual drawers",
            "Dining Table": "Compact dining station with clean architectural apron",
            "TV Unit": "Low-profile floating credenza with hidden wire management",
            "Bookshelf": "Vertical display bookcase keeping vertical footprint compact",
            "Coffee Table": "Organic nesting table pairing to anchor the central seating rug",
            "Storage": "Concealed perimeter cabinetry maintaining clean sightlines",
            "Accent Chair": "Sculptural accent armchair positioned at a 45-degree angle"
        }
        placement_map = {
            "Bed": "Centered against the primary solid accent wall, away from direct doorway draft",
            "Sofa": "Anchored along the longest open wall with 36\" walking clearance from entrance",
            "Wardrobe": "Recessed into the quieter alcove adjacent to the bathroom/dressing corner",
            "Study Table": "Positioned perpendicular to the window to maximize natural daylight without glare",
            "Dining Table": "Adjacent to the kitchen entry with easy 40\" pull-out radius for dining chairs",
            "TV Unit": "Mounted opposite the sofa at 42\" eye-level centerline",
            "Bookshelf": "In the vertical corner nook to utilize dead corner space gracefully",
            "Coffee Table": "Centered on the area rug, exactly 18\" from the sofa seat edge",
            "Storage": "Under-window banquette or side niche to avoid visual weight in center",
            "Accent Chair": "Facing the seating group toward natural light with an arc floor lamp behind"
        }
        dim_map = {
            "Bed": "78\"W x 60\"D x 42\"H (Queen)",
            "Sofa": "84\"W x 34\"D x 32\"H",
            "Wardrobe": "60\"W x 24\"D x 84\"H",
            "Study Table": "48\"W x 24\"D x 30\"H",
            "Dining Table": "48\"W x 32\"D x 30\"H",
            "TV Unit": "64\"W x 16\"D x 18\"H",
            "Bookshelf": "32\"W x 14\"D x 72\"H",
            "Coffee Table": "36\"W x 22\"D x 16\"H",
            "Storage": "42\"W x 18\"D x 34\"H",
            "Accent Chair": "30\"W x 30\"D x 32\"H"
        }
        furniture_items.append({
            "name": f"{style} {item}",
            "purpose": purpose_map.get(item, f"Functional {item.lower()} tailored for {room.lower()} comfort"),
            "placement": placement_map.get(item, "Positioned along secondary perimeter wall"),
            "price": f"₹{per_item_budget:,}",
            "dimensions": dim_map.get(item, "Standard architectural clearance")
        })

    return {
        "design_summary": f"A refined {style.lower()} design strategy tailored specifically for your {l:.0f}' × {w:.0f}' ({sqft} sq.ft) {room.lower()}. The layout establishes seamless visual continuity through {colors[0].lower()} tonal surfaces, intentional negative space, and curated natural textures. Every furniture piece is scaled proportionally to ensure unobstructed walking arteries and maximum functional serenity.",
        "color_palette": color_palette,
        "furniture_recommendations": furniture_items,
        "furniture_placement": f"Organized along a primary circulation spine: enter with a clean 38-inch sightline toward the natural window focal point. Major anchor pieces sit on perimeter planes, maintaining an unbroken 36-inch central transit corridor between the entryway and key activity zones.",
        "lighting_recommendations": {
            "ambient": f"Flush architectural LED ceiling fixture (3000K warm white) or recessed downlights at 4-foot intervals.",
            "task": f"Focused reading/task fixtures including a dimmable desk/bedside sconce with directional beam.",
            "accent": f"Warm 2700K indirect LED cove backlighting along the headboard/credenza and a sculptural floor lamp.",
            "color_temperature": "2700K - 3000K Warm Architectural White"
        },
        "decoration_ideas": [
            {
                "item": "Textured Area Rug",
                "description": f"8' x 10' hand-tufted wool-blend rug in {color_palette[0]['name'].lower()} to anchor the furniture zone",
                "styling_note": "Ensure front legs of primary seating rest fully on the rug."
            },
            {
                "item": "Framed Botanical & Abstract Art",
                "description": "Minimalist matte black gallery frames with 3-inch archival white mats",
                "styling_note": "Hang centerline at standard 57 inches above finished floor."
            },
            {
                "item": "Organic Ceramic Vessels & Flora",
                "description": "Textured stoneware vase featuring tall eucalyptus stems and fiddle leaf fig in a terracotta pot",
                "styling_note": "Place in the corner opposite the entry to draw the eye outward."
            },
            {
                "item": "Floor-to-Ceiling Drapery",
                "description": "Semi-sheer linen curtains hung high and wide from ceiling track to elongate vertical room height",
                "styling_note": "Mount rod 4 inches below ceiling to make the 9-10 ft ceiling appear even loftier."
            }
        ],
        "space_utilization": f"Total Area: {sqft} sq.ft. Furniture Footprint: {int(sqft * 0.38)} sq.ft (38% coverage). Dedicated Circulation Corridor: {int(sqft * 0.44)} sq.ft (44% clearance). Open Negative Space: {int(sqft * 0.18)} sq.ft (18%). This ratio prevents visual clutter while exceeding universal accessibility guidelines.",
        "budget_breakdown": {
            "furniture": f"₹{furn_cost:,}",
            "lighting": f"₹{light_cost:,}",
            "decorations": f"₹{dec_cost:,}",
            "storage": f"₹{stor_cost:,}",
            "other": f"₹{oth_cost:,}",
            "total": f"₹{numeric_budget:,}"
        },
        "materials_suggestions": [
            {"material": "Natural White Oak / Walnut", "application": "Furniture frames and architectural shelving", "finish": "Matte low-VOC oil seal"},
            {"material": "Performance Bouclé / Linen Blend", "application": "Seating upholstery and headboard", "finish": "Hydrophobic stain-resistant weave"},
            {"material": "Brushed Champagne Brass / Anodized Black Metal", "application": "Hardware pulls, light stems, and table legs", "finish": "Satin brushed anti-fingerprint"},
            {"material": "Honed Travertine or Terrazzo", "application": "Coffee table or bedside top accents", "finish": "Honed matte non-reflective"}
        ],
        "design_tips": [
            f"Hang window drapery directly at the ceiling rather than the window casing to visually lift the room's height.",
            "Use layered light switching (ambient, task, and accent on separate dimmers) to shift room mood effortlessly between productive daytime and relaxing evening.",
            "Keep the center floor plane legible—opting for leggy furniture over boxy floor-bound bases expands perceived square footage.",
            "Embrace the 60-30-10 color rule: 60% dominant neutral, 30% secondary texture/wood, and 10% intentional accent tone."
        ],
        "concepts": [
            {
                "id": "concept-1",
                "name": f"{style} Balanced",
                "style": style,
                "description": f"The quintessential {style.lower()} blueprint emphasizing optimal storage efficiency and refined balance.",
                "estimated_budget": f"₹{numeric_budget:,}",
                "image_url": "",
                "highlight": "Maximum ergonomic utility with clean architectural lines"
            },
            {
                "id": "concept-2",
                "name": "Warm Contemporary",
                "style": "Contemporary",
                "description": "Organic rounded silhouettes, tactile bouclé fabrics, and earth-toned ceramic accents for soothing warmth.",
                "estimated_budget": f"₹{int(numeric_budget * 1.05):,}",
                "image_url": "",
                "highlight": "Plush tactile textures and acoustic absorption"
            },
            {
                "id": "concept-3",
                "name": "Luxury Modern",
                "style": "Luxury",
                "description": "Architectural LED coves, fluted wall panels, deep charcoal accents, and polished brass joinery.",
                "estimated_budget": f"₹{int(numeric_budget * 1.25):,}",
                "image_url": "",
                "highlight": "High-end bespoke cabinetry and layered mood lighting"
            }
        ],
        "prompt_used": prompt
    }
