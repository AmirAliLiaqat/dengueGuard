from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.api.v1.auth import get_current_user
from app.models.dengue import User, BenchmarkMetric

router = APIRouter()


class BenchmarkUpsert(BaseModel):
    key: str
    label: str
    metrics: Dict[str, float] = Field(default_factory=dict)
    citation: Optional[str] = None


@router.get("/", response_model=List[Dict[str, Any]])
async def list_benchmarks(current_user: User = Depends(get_current_user)):
    # Auth required because this is a medical-related comparison panel.
    items = await BenchmarkMetric.find_all().sort("-updated_at").to_list()
    return [
        {
            "key": b.key,
            "label": b.label,
            "metrics": b.metrics,
            "citation": b.citation,
            "updated_at": b.updated_at.isoformat(),
        }
        for b in items
    ]


@router.post("/", status_code=201)
async def upsert_benchmark(
    payload: BenchmarkUpsert, current_user: User = Depends(get_current_user)
):
    # Only admins can edit benchmarks.
    if getattr(current_user, "role", "user") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")

    existing = await BenchmarkMetric.find_one(BenchmarkMetric.key == payload.key)
    if existing:
        existing.label = payload.label
        existing.metrics = payload.metrics
        existing.citation = payload.citation
        existing.updated_at = datetime.now(timezone.utc)
        await existing.save()
        return {"status": "success", "key": existing.key}

    doc = BenchmarkMetric(
        key=payload.key,
        label=payload.label,
        metrics=payload.metrics,
        citation=payload.citation,
        updated_at=datetime.now(timezone.utc),
    )
    await doc.insert()
    return {"status": "success", "key": doc.key}

