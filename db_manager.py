"""
Standalone SQLite Database Manager and CLI for SmartRoom AI
Can be invoked from Python backend or Node.js server.
"""
import sys
import os
import json
import sqlite3
import uuid

DB_PATH = os.path.join(os.path.dirname(__file__), "smartroom.db")

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_tables():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS design_requests (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        room_type TEXT NOT NULL,
        dimensions TEXT NOT NULL,
        style TEXT NOT NULL,
        colors TEXT NOT NULL,
        budget TEXT NOT NULL,
        furniture TEXT NOT NULL,
        lighting TEXT NOT NULL,
        decorations TEXT NOT NULL,
        additional_requirements TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS design_results (
        id TEXT PRIMARY KEY,
        request_id TEXT NOT NULL,
        design_summary TEXT NOT NULL,
        recommendations TEXT NOT NULL,
        budget_breakdown TEXT NOT NULL,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(request_id) REFERENCES design_requests(id)
    );
    """)
    # Insert demo default user
    cur.execute("SELECT id FROM users WHERE id = 'default_user'")
    if not cur.fetchone():
        cur.execute("INSERT INTO users (id, name, email) VALUES ('default_user', 'Design Explorer', 'user@smartroom.ai')")
    conn.commit()
    conn.close()

def save_design(payload_str):
    data = json.loads(payload_str)
    req = data.get("request", {})
    res = data.get("result", {})
    image_url = data.get("image_url", "")
    
    init_tables()
    conn = get_conn()
    cur = conn.cursor()

    req_id = str(uuid.uuid4())
    res_id = str(uuid.uuid4())

    dims = f"{req.get('length', '')}x{req.get('width', '')}x{req.get('height', '')}"
    colors_j = json.dumps(req.get("colors", []))
    furniture_j = json.dumps(req.get("furniture", []))
    decorations_j = json.dumps(req.get("decorations", []))

    cur.execute("""
    INSERT INTO design_requests (
        id, user_id, room_type, dimensions, style, colors, budget,
        furniture, lighting, decorations, additional_requirements
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        req_id,
        "default_user",
        req.get("room_type", ""),
        dims,
        req.get("style", ""),
        colors_j,
        req.get("budget", ""),
        furniture_j,
        req.get("lighting", ""),
        decorations_j,
        req.get("additional_requirements", "")
    ))

    rec_payload = {
        "color_palette": res.get("color_palette", []),
        "furniture_recommendations": res.get("furniture_recommendations", []),
        "furniture_placement": res.get("furniture_placement", ""),
        "lighting_recommendations": res.get("lighting_recommendations", {}),
        "decoration_ideas": res.get("decoration_ideas", []),
        "space_utilization": res.get("space_utilization", ""),
        "materials_suggestions": res.get("materials_suggestions", []),
        "design_tips": res.get("design_tips", []),
        "concepts": res.get("concepts", [])
    }

    cur.execute("""
    INSERT INTO design_results (
        id, request_id, design_summary, recommendations, budget_breakdown, image_url
    ) VALUES (?, ?, ?, ?, ?, ?)
    """, (
        res_id,
        req_id,
        res.get("design_summary", ""),
        json.dumps(rec_payload),
        json.dumps(res.get("budget_breakdown", {})),
        image_url
    ))

    conn.commit()
    conn.close()
    return json.dumps({"result_id": res_id, "request_id": req_id})

def get_designs(limit=50):
    init_tables()
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
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
    rows = cur.fetchall()
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
    return json.dumps(designs)

def delete_design(result_id):
    init_tables()
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM design_results WHERE id = ?", (result_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    conn.close()
    return json.dumps({"deleted": deleted, "id": result_id})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        init_tables()
        print(json.dumps({"status": "tables_ready"}))
        sys.exit(0)

    cmd = sys.argv[1]
    if cmd == "init":
        init_tables()
        print(json.dumps({"status": "initialized"}))
    elif cmd == "save":
        payload = sys.argv[2] if len(sys.argv) > 2 else sys.stdin.read()
        print(save_design(payload))
    elif cmd == "list":
        print(get_designs())
    elif cmd == "delete":
        res_id = sys.argv[2]
        print(delete_design(res_id))
    else:
        print(json.dumps({"error": f"Unknown command {cmd}"}))
