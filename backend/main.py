"""
SmartRoom AI – FastAPI Backend Application Entry Point
A Generative AI-Based Personalized Interior Design and Room Visualization System
"""
import os
import sys
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.database import init_db
from routes.design_routes import router as design_router
from routes.chat_routes import router as chat_router
from routes.history_routes import router as history_router

# Initialize FastAPI App
app = FastAPI(
    title="SmartRoom AI Backend",
    description="Generative AI-Based Personalized Interior Design & Room Visualization API",
    version="1.0.0"
)

# CORS Middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to ensure SQLite tables exist
@app.on_event("startup")
async def startup_event():
    print("Initializing SmartRoom AI SQLite Database...")
    init_db()
    print("SQLite Database ready.")

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Global unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Unable to complete request right now. Please try again."}
    )

# Include Routers
app.include_router(design_router)
app.include_router(chat_router)
app.include_router(history_router)

@app.get("/")
async def root():
    return {
        "app": "SmartRoom AI Backend",
        "status": "online",
        "description": "Generative AI Personalized Interior Design & Room Visualization System",
        "version": "1.0.0",
        "endpoints": [
            "POST /generate-design",
            "POST /modify-design",
            "POST /optimize-budget",
            "POST /chat",
            "GET /designs",
            "GET /designs/{id}",
            "DELETE /designs/{id}"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "sqlite", "ai_provider": "configured"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("BACKEND_PORT", 8000))
    print(f"Starting SmartRoom AI FastAPI server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
