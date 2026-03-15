from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.dengue import User, OTPRecord, DiagnosisReport, RuleDocument, Notification
from app.core.config import settings
from app.api.v1 import router as api_router

app = FastAPI(
    title="Dengue KBS API",
    description="Backend for AI-Based Dengue Detection and Knowledge-Based Expert System",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(
        database=client.get_default_database(),
        document_models=[User, OTPRecord, DiagnosisReport, RuleDocument, Notification]
    )

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Dengue KBS API"}

# Include routers
app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
