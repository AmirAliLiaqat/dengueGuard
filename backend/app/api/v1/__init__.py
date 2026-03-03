from fastapi import APIRouter
from .diagnosis import router as diagnosis_router
from .auth import router as auth_router

router = APIRouter()
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(diagnosis_router, prefix="/diagnose", tags=["diagnosis"])
