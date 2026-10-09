"""
Routes for Design Generation and Modification
"""
import uuid
from fastapi import APIRouter, HTTPException, Depends
from models.schemas import (
    RoomRequirementsRequest,
    DesignResponse,
    ModifyDesignRequest,
    BudgetOptimizationRequest
)
from services.ai_design_service import generate_interior_plan
from services.ai_image_service import generate_room_image, get_concept_images
from services.budget_service import optimize_budget_plan
from database.models import save_design_request, save_design_result, get_design_by_id

router = APIRouter(prefix="", tags=["Design"])

@router.post("/generate-design", response_model=DesignResponse)
async def generate_design(req: RoomRequirementsRequest):
    """
    Main endpoint: Accepts room requirements, constructs prompts,
    calls Generative AI and Image generation, saves to SQLite, and returns structured plan.
    """
    try:
        req_dict = req.model_dump()
        
        # 1. Save input requirements to SQLite
        request_id = save_design_request(req_dict)

        # 2. Call Generative AI for structured interior plan
        design_plan = generate_interior_plan(req_dict)

        # 3. Call AI Image generation
        image_url, image_prompt = generate_room_image(req_dict)

        # 4. Populate concept images
        concept_imgs = get_concept_images(req.room_type, req.style)
        concepts = design_plan.get("concepts", [])
        for i, c in enumerate(concepts):
            c["image_url"] = concept_imgs[i] if i < len(concept_imgs) else image_url

        # 5. Save generated result to SQLite
        result_id = save_design_result(request_id, design_plan, image_url)

        dimensions_str = f"{req.length} ft × {req.width} ft" + (f" × {req.height}" if req.height else "")

        return DesignResponse(
            id=result_id,
            request_id=request_id,
            room_type=req.room_type,
            dimensions=dimensions_str,
            style=req.style,
            budget=req.budget,
            image_url=image_url,
            prompt_used=design_plan.get("prompt_used", ""),
            image_prompt_used=image_prompt,
            design_summary=design_plan.get("design_summary", ""),
            color_palette=design_plan.get("color_palette", []),
            furniture_recommendations=design_plan.get("furniture_recommendations", []),
            furniture_placement=design_plan.get("furniture_placement", ""),
            lighting_recommendations=design_plan.get("lighting_recommendations", {}),
            decoration_ideas=design_plan.get("decoration_ideas", []),
            space_utilization=design_plan.get("space_utilization", ""),
            budget_breakdown=design_plan.get("budget_breakdown", {}),
            materials_suggestions=design_plan.get("materials_suggestions", []),
            design_tips=design_plan.get("design_tips", []),
            concepts=concepts
        )
    except Exception as e:
        print(f"Error in /generate-design: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unable to generate the design right now. Please try again."
        )

@router.post("/modify-design", response_model=DesignResponse)
async def modify_design(req: ModifyDesignRequest):
    """
    Modifies an existing design based on user text prompt and quick chips.
    Updates original requirements, regenerates plan and room image.
    """
    try:
        orig = req.original_requirements.model_dump()
        prompt_notes = req.modification_prompt
        if req.quick_tags:
            prompt_notes = f"{prompt_notes} Quick modifications applied: {', '.join(req.quick_tags)}."

        orig["additional_requirements"] = f"{orig.get('additional_requirements', '')} | Modification request: {prompt_notes}".strip()

        # Handle specific quick tags
        if "Make It More Minimalist" in req.quick_tags:
            orig["style"] = "Minimalist"
        elif "Make It More Luxurious" in req.quick_tags:
            orig["style"] = "Luxury"
        elif "Add Plants" in req.quick_tags:
            if "Indoor plants" not in orig.get("decorations", []):
                orig["decorations"] = orig.get("decorations", []) + ["Indoor plants"]
        elif "Add Storage" in req.quick_tags:
            if "Storage" not in orig.get("furniture", []):
                orig["furniture"] = orig.get("furniture", []) + ["Storage"]

        # Re-generate with updated requirements
        return await generate_design(RoomRequirementsRequest(**orig))
    except Exception as e:
        print(f"Error in /modify-design: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unable to modify the design right now. Please try again."
        )

@router.post("/optimize-budget")
async def optimize_budget(req: BudgetOptimizationRequest):
    """
    Provides intelligent budget optimization breakdown with cheaper alternatives.
    """
    try:
        req_dict = req.requirements.model_dump()
        current_plan = generate_interior_plan(req_dict)
        analysis = optimize_budget_plan(current_plan, req.target_budget)
        return analysis
    except Exception as e:
        print(f"Error in /optimize-budget: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unable to optimize budget right now. Please try again."
        )
