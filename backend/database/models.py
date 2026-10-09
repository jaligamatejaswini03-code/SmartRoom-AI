"""
Database Model Helpers & CRUD Operations for SQLite
"""
import uuid
import json
from datetime import datetime
from .database import get_db_connection

def save_design_request(data: dict, user_id: str = "default_user") -> str:
    """Inserts a new design request into SQLite and returns its ID."""
    request_id = str(uuid.uuid4())
    conn = get_db_connection()
    cursor = conn.cursor()

    dimensions = f"{data.get('length', '')}x{data.get('width', '')}x{data.get('height', '')}"
    colors_json = json.dumps(data.get("colors", []))
    furniture_json = json.dumps(data.get("furniture", []))
    decorations_json = json.dumps(data.get("decorations", []))

    cursor.execute("""
    INSERT INTO design_requests (
        id, user_id, room_type, dimensions, style, colors,
        budget, furniture, lighting, decorations, additional_requirements
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        request_id,
        user_id,
        data.get("room_type"),
        dimensions,
        data.get("style"),
        colors_json,
        data.get("budget"),
        furniture_json,
        data.get("lighting"),
        decorations_json,
        data.get("additional_requirements", "")
    ))
    conn.commit()
    conn.close()
    return request_id

def save_design_result(request_id: str, design_data: dict, image_url: str) -> str:
    """Inserts generated design results into SQLite and returns the result ID."""
    result_id = str(uuid.uuid4())
    conn = get_db_connection()
    cursor = conn.cursor()

    recommendations_payload = {
        "color_palette": design_data.get("color_palette", []),
        "furniture_recommendations": design_data.get("furniture_recommendations", []),
        "furniture_placement": design_data.get("furniture_placement", ""),
        "lighting_recommendations": design_data.get("lighting_recommendations", {}),
        "decoration_ideas": design_data.get("decoration_ideas", []),
        "space_utilization": design_data.get("space_utilization", ""),
        "materials_suggestions": design_data.get("materials_suggestions", []),
        "design_tips": design_data.get("design_tips", []),
        "concepts": design_data.get("concepts", [])
    }

    cursor.execute("""
    INSERT INTO design_results (
        id, request_id, design_summary, recommendations, budget_breakdown, image_url
    ) VALUES (?, ?, ?, ?, ?, ?)
    """, (
        result_id,
        request_id,
        design_data.get("design_summary", ""),
        json.dumps(recommendations_payload),
        json.dumps(design_data.get("budget_breakdown", {})),
        image_url
    ))
    conn.commit()
    conn.close()
    return result_id

def get_all_designs(limit: int = 50):
    """Retrieves all past designs with request metadata."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT 
        r.id as result_id,
        req.id as request_id,
        req.room_type,
        req.dimensions,
        req.style,
        req.budget,
        req.colors,
        req.furniture,
        req.lighting,
        req.decorations,
        req.additional_requirements,
        r.design_summary,
        r.recommendations,
        r.budget_breakdown,
        r.image_url,
        r.created_at
    FROM design_results r
    JOIN design_requests req ON r.request_id = req.id
    ORDER BY r.created_at DESC
    LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()

    designs = []
    for row in rows:
        designs.append({
            "result_id": row["result_id"],
            "request_id": row["request_id"],
            "room_type": row["room_type"],
            "dimensions": row["dimensions"],
            "style": row["style"],
            "budget": row["budget"],
            "colors": json.loads(row["colors"]) if row["colors"] else [],
            "furniture": json.loads(row["furniture"]) if row["furniture"] else [],
            "lighting": row["lighting"],
            "decorations": json.loads(row["decorations"]) if row["decorations"] else [],
            "additional_requirements": row["additional_requirements"],
            "design_summary": row["design_summary"],
            "recommendations": json.loads(row["recommendations"]) if row["recommendations"] else {},
            "budget_breakdown": json.loads(row["budget_breakdown"]) if row["budget_breakdown"] else {},
            "image_url": row["image_url"],
            "created_at": row["created_at"]
        })
    return designs

def get_design_by_id(result_id: str):
    """Retrieves a single design result by ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT 
        r.id as result_id,
        req.id as request_id,
        req.room_type,
        req.dimensions,
        req.style,
        req.budget,
        req.colors,
        req.furniture,
        req.lighting,
        req.decorations,
        req.additional_requirements,
        r.design_summary,
        r.recommendations,
        r.budget_breakdown,
        r.image_url,
        r.created_at
    FROM design_results r
    JOIN design_requests req ON r.request_id = req.id
    WHERE r.id = ?
    """, (result_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return {
        "result_id": row["result_id"],
        "request_id": row["request_id"],
        "room_type": row["room_type"],
        "dimensions": row["dimensions"],
        "style": row["style"],
        "budget": row["budget"],
        "colors": json.loads(row["colors"]) if row["colors"] else [],
        "furniture": json.loads(row["furniture"]) if row["furniture"] else [],
        "lighting": row["lighting"],
        "decorations": json.loads(row["decorations"]) if row["decorations"] else [],
        "additional_requirements": row["additional_requirements"],
        "design_summary": row["design_summary"],
        "recommendations": json.loads(row["recommendations"]) if row["recommendations"] else {},
        "budget_breakdown": json.loads(row["budget_breakdown"]) if row["budget_breakdown"] else {},
        "image_url": row["image_url"],
        "created_at": row["created_at"]
    }

def delete_design_by_id(result_id: str) -> bool:
    """Deletes a design result from SQLite."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM design_results WHERE id = ?", (result_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted
