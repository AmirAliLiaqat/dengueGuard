from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.dengue import User, OTPRecord, DiagnosisReport, RuleDocument, Notification, BenchmarkMetric, Doctor
from app.core.config import settings
from app.core import security
from app.api.v1 import router as api_router

app = FastAPI(
    title="Dengue KBS API",
    description="Backend for AI-Based Dengue Detection and Knowledge-Based Expert System",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    
    # Bugfix for Beanie 2.1.0/Motor 3.7.0 compatibility:
    # Motor returns a Database object for any missing attribute, which causes Beanie's hasattr check to pass erroneously.
    if not hasattr(client.__class__, "append_metadata"):
        client.append_metadata = lambda x: None

    await init_beanie(
        database=client.get_default_database(),
        document_models=[User, OTPRecord, DiagnosisReport, RuleDocument, Notification, BenchmarkMetric, Doctor]
    )

    # Seed a default benchmark record (editable in DB / via admin endpoint).
    existing = await BenchmarkMetric.find_one(BenchmarkMetric.key == "example_ann_diagnosis")
    if not existing:
        await BenchmarkMetric(
            key="example_ann_diagnosis",
            label="Published ANN diagnostic example",
            metrics={"auc": 0.899, "sensitivity": 0.90, "specificity": 0.82},
            citation="Effectiveness of a diagnostic algorithm for dengue based on an artificial neural network (reported AUC 0.899, sensitivity 0.90, specificity 0.82).",
        ).insert()

    # Keep exactly one admin account tied to configured credentials.
    # This prevents normal users from accidentally retaining/admin role.
    hashed = security.get_password_hash(settings.ADMIN_PASSWORD)
    configured_admin = await User.find_one(User.email == settings.ADMIN_EMAIL)
    all_admins = await User.find(User.role == "admin").to_list()

    # If the configured admin account does not exist, create it.
    if not configured_admin:
        configured_admin = User(
            email=settings.ADMIN_EMAIL,
            hashed_password=hashed,
            full_name=settings.ADMIN_FULL_NAME,
            role="admin",
            is_active=True,
            is_verified=True,
        )
        await configured_admin.insert()
    else:
        # Ensure configured admin always has admin privileges and current credentials.
        configured_admin.role = "admin"
        configured_admin.full_name = configured_admin.full_name or settings.ADMIN_FULL_NAME
        configured_admin.hashed_password = hashed
        configured_admin.is_verified = True
        configured_admin.is_active = True
        await configured_admin.save()

    # Demote any other admin users to regular users.
    for admin_user in all_admins:
        if str(admin_user.id) == str(configured_admin.id):
            continue
        admin_user.role = "user"
        await admin_user.save()

    # Seed a baseline doctor directory (idempotent by name).
    default_doctors = [
        {
            "name": "Dr. Ayesha Rahman",
            "age": 41,
            "picture_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
            "bio": "Infectious disease specialist with 12+ years in tropical fever management across urban and rural clinics.",
            "dengue_expertise": "Early warning signs, hydration protocols, platelet trend interpretation, and outpatient risk triage.",
        },
        {
            "name": "Dr. Omar Farooq",
            "age": 46,
            "picture_url": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80",
            "bio": "Consultant physician focused on vector-borne diseases and emergency stabilization for severe febrile patients.",
            "dengue_expertise": "Severe dengue recognition, shock prevention, referral timing, and evidence-based monitoring plans.",
        },
        {
            "name": "Dr. Maria Santos",
            "age": 38,
            "picture_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
            "bio": "Public health and internal medicine doctor coordinating community dengue screening and patient education programs.",
            "dengue_expertise": "Community outbreak response, symptom staging, home-care counseling, and prevention strategy design.",
        },
        {
            "name": "Dr. Hassan Ali",
            "age": 50,
            "picture_url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
            "bio": "Senior clinician in critical care with extensive experience managing complicated dengue admissions.",
            "dengue_expertise": "Inpatient escalation pathways, warning-lab correlation, fluid balance decisions, and ICU coordination.",
        },
    ]

    for doctor_data in default_doctors:
        exists = await Doctor.find_one(Doctor.name == doctor_data["name"])
        if not exists:
            await Doctor(**doctor_data).insert()

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
