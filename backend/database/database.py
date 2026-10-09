"""
SmartRoom AI - Database Connection and Schema Setup
Using SQLite as specified in project requirements.
"""
import os
import sqlite3
import json
from datetime import datetime

DB_PATH = os.environ.get("DATABASE_PATH", "smartroom.db")

def get_db_connection():
    """Returns a SQLite connection with dict-like row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the required SQLite tables: users, design_requests, design_results."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Table 1: users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Table 2: design_requests
    cursor.execute("""
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

    # Table 3: design_results
    cursor.execute("""
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

    # Create default demo user if not exists
    cursor.execute("SELECT id FROM users WHERE id = 'default_user'")
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO users (id, name, email) VALUES (?, ?, ?)",
            ("default_user", "Interior Design Explorer", "user@smartroom.ai")
        )

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("SQLite database initialized successfully at", DB_PATH)
