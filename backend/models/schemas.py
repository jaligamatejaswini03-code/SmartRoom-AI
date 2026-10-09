"""
Pydantic Request & Response Schemas
Validates all fields for SmartRoom AI API.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator

class RoomRequirementsRequest(BaseModel):
    room_type: str = Field(..., description="Type of room (e.g., Bedroom, Living Room)")
    length: str = Field(..., description="Length in feet")
    width: str = Field(..., description="Width in feet")
    height: Optional[str] = Field("9-10 ft", description="Height in feet")
    style: str = Field(..., description="Interior style (e.g., Modern, Scandinavian)")
    colors: List[str] = Field(default_factory=list, description="Preferred colors")
    budget: str = Field(..., description="Estimated budget")
    furniture: List[str] = Field(default_factory=list, description="Required furniture items")
    lighting: str = Field(default="Warm", description="Lighting preference")
    decorations: List[str] = Field(default_factory=list, description="Decoration preferences")
    additional_requirements: Optional[str] = Field("", description="Custom requirements")

    @field_validator("length", "width")
    @classmethod
    def validate_dimension(cls, v: str) -> str:
        clean = v.replace("ft", "").replace("'", "").strip()
        try:
            val = float(clean)
            if val <= 0:
                raise ValueError("Dimension must be greater than 0")
        except ValueError:
            raise ValueError("Dimension must be a valid numeric value")
        return v

    @field_validator("room_type", "style", "budget")
    @classmethod
    def validate_non_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty")
        return v.strip()

class FurnitureItem(BaseModel):
    name: str
    purpose: str
    placement: str
    price: str
    dimensions: Optional[str] = ""

class BudgetBreakdown(BaseModel):
    furniture: str
    lighting: str
    decorations: str
    storage: str
    other: str
    total: str

class DesignConcept(BaseModel):
    id: str
    name: str
    style: str
    description: str
    estimated_budget: str
    image_url: str
    highlight: str

class DesignResponse(BaseModel):
    id: Optional[str] = None
    request_id: Optional[str] = None
    room_type: str
    dimensions: str
    style: str
    budget: str
    image_url: str
    prompt_used: Optional[str] = ""
    image_prompt_used: Optional[str] = ""
    design_summary: str
    color_palette: List[Dict[str, str]]
    furniture_recommendations: List[FurnitureItem]
    furniture_placement: str
    lighting_recommendations: Dict[str, Any]
    decoration_ideas: List[Dict[str, str]]
    space_utilization: str
    budget_breakdown: BudgetBreakdown
    materials_suggestions: List[Dict[str, str]]
    design_tips: List[str]
    concepts: List[DesignConcept]
    created_at: Optional[str] = None

class ModifyDesignRequest(BaseModel):
    current_design_id: Optional[str] = None
    original_requirements: RoomRequirementsRequest
    modification_prompt: str
    quick_tags: Optional[List[str]] = Field(default_factory=list)

class ChatRequest(BaseModel):
    message: str
    design_context: Optional[Dict[str, Any]] = None
    history: Optional[List[Dict[str, str]]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: Optional[List[str]] = Field(default_factory=list)

class BudgetOptimizationRequest(BaseModel):
    current_design_id: Optional[str] = None
    requirements: RoomRequirementsRequest
    target_budget: Optional[str] = None
    current_total: Optional[str] = None
