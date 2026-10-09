"""
SmartRoom AI - Budget Optimization Service
Analyzes design cost allocation, finds value-engineering substitutions,
and suggests optimized materials and item alternatives.
"""

def optimize_budget_plan(current_design: dict, target_budget: str = None) -> dict:
    """
    Evaluates current furniture and finishes, returning actionable cost savings,
    material swaps, lighting alternatives, and optimized budget breakdown.
    """
    breakdown = current_design.get("budget_breakdown", {})
    raw_total = breakdown.get("total", "₹1,45,000")
    
    # Extract numbers
    def parse_val(v):
        if isinstance(v, (int, float)):
            return int(v)
        clean = "".join([c for c in str(v) if c.isdigit()])
        return int(clean) if clean else 120000

    current_num = parse_val(raw_total)
    target_num = int(current_num * 0.75)  # 25% optimization by default

    furniture_cost = parse_val(breakdown.get("furniture", int(current_num * 0.52)))
    lighting_cost = parse_val(breakdown.get("lighting", int(current_num * 0.14)))
    decor_cost = parse_val(breakdown.get("decorations", int(current_num * 0.10)))
    storage_cost = parse_val(breakdown.get("storage", int(current_num * 0.16)))
    other_cost = parse_val(breakdown.get("other", int(current_num * 0.08)))

    # Optimized values
    opt_furn = int(furniture_cost * 0.78)
    opt_light = int(lighting_cost * 0.65)
    opt_decor = int(decor_cost * 0.60)
    opt_storage = int(storage_cost * 0.80)
    opt_other = int(other_cost * 0.70)
    opt_total = opt_furn + opt_light + opt_decor + opt_storage + opt_other
    savings = current_num - opt_total

    suggestions = [
        {
            "category": "Furniture Alternatives",
            "title": "Engineered Wood & Ready-to-Assemble Units",
            "current_cost": f"₹{furniture_cost:,}",
            "optimized_cost": f"₹{opt_furn:,}",
            "saving": f"₹{furniture_cost - opt_furn:,}",
            "recommendation": "Switch from solid hardwood joinery to premium high-density particle board with moisture-resistant melamine veneer, and choose modular flat-pack frame systems."
        },
        {
            "category": "Alternative Materials",
            "title": "High-Pressure Laminate & Performance Twill",
            "current_cost": "Premium Stone & Solid Oak",
            "optimized_cost": "HPL & Textured Linen Blends",
            "saving": "Est. 15-20% on finishes",
            "recommendation": "Replace honed marble / brass inlays with matte sintered quartz laminate surfaces, and choose stain-resistant blended twill instead of imported bouclé."
        },
        {
            "category": "Lighting Rationalization",
            "title": "Smart Architectural Track & Surface LED",
            "current_cost": f"₹{lighting_cost:,}",
            "optimized_cost": f"₹{opt_light:,}",
            "saving": f"₹{lighting_cost - opt_light:,}",
            "recommendation": "Replace complex gypsum false-ceiling cove wiring with magnetic surface-mount track spots and standalone rechargeable accent sconces."
        },
        {
            "category": "Reduced Decoration Costs",
            "title": "Curated Prints & Local Flora",
            "current_cost": f"₹{decor_cost:,}",
            "optimized_cost": f"₹{opt_decor:,}",
            "saving": f"₹{decor_cost - opt_decor:,}",
            "recommendation": "Use digital art prints in standard frame sizes instead of commissioned canvas art, and source local nursery indoor plants with ceramic terracotta planters."
        },
        {
            "category": "Storage Re-allocation",
            "title": "Semi-Modular Interior Carcasses",
            "current_cost": f"₹{storage_cost:,}",
            "optimized_cost": f"₹{opt_storage:,}",
            "saving": f"₹{storage_cost - opt_storage:,}",
            "recommendation": "Adopt standard 600mm carcass modules with plain sliding doors rather than floor-to-ceiling tinted glass profiles."
        }
    ]

    return {
        "status": "optimized",
        "original_budget": f"₹{current_num:,}",
        "optimized_budget": f"₹{opt_total:,}",
        "total_savings": f"₹{savings:,}",
        "savings_percentage": f"{int((savings / current_num) * 100)}%",
        "optimized_breakdown": {
            "furniture": f"₹{opt_furn:,}",
            "lighting": f"₹{opt_light:,}",
            "decorations": f"₹{opt_decor:,}",
            "storage": f"₹{opt_storage:,}",
            "other": f"₹{opt_other:,}",
            "total": f"₹{opt_total:,}"
        },
        "suggestions": suggestions,
        "action_plan": "You can immediately apply this optimized plan to regenerate the design while preserving the visual aesthetic and essential functionality."
    }
