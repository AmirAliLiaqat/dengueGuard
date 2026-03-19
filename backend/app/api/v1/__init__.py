from fastapi import APIRouter
from .diagnosis import router as diagnosis_router
from .auth import router as auth_router
from .notifications import router as notifications_router
from .benchmarks import router as benchmarks_router
from .admin import router as admin_router

router = APIRouter()
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(diagnosis_router, prefix="/diagnose", tags=["diagnosis"])
router.include_router(notifications_router, prefix="/notifications", tags=["notifications"])
router.include_router(benchmarks_router, prefix="/benchmarks", tags=["benchmarks"])
router.include_router(admin_router, prefix="/admin", tags=["admin"])
