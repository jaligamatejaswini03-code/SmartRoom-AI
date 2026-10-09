"""
Design History & Saved Designs Router (SQLite)
"""
from fastapi import APIRouter, HTTPException
from database.models import get_all_designs, get_design_by_id, delete_design_by_id

router = APIRouter(prefix="", tags=["History"])

@router.get("/designs")
async def list_designs(limit: int = 50):
    """Returns list of previously generated designs from SQLite."""
    try:
        designs = get_all_designs(limit=limit)
        return {"designs": designs, "total": len(designs)}
    except Exception as e:
        print(f"Error fetching designs: {e}")
        raise HTTPException(status_code=500, detail="Database query failed.")

@router.get("/designs/{design_id}")
async def get_design(design_id: str):
    """Returns a single design by ID."""
    design = get_design_by_id(design_id)
    if not design:
        raise HTTPException(status_code=404, detail="Design not found.")
    return design

@router.delete("/designs/{design_id}")
async def delete_design(design_id: str):
    """Deletes a design from SQLite."""
    deleted = delete_design_by_id(design_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Design not found.")
    return {"message": "Design deleted successfully.", "id": design_id}
