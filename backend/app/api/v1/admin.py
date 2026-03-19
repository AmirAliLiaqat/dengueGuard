import uuid
import csv
from pathlib import Path
from typing import List, Dict, Any

import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile

from app.api.v1.auth import get_current_user
from app.core.config import settings
from app.models.dengue import User, DiagnosisReport, Doctor
from app.schemas.user import UserResponse
from app.schemas.diagnosis import DiagnosisResponse
from app.schemas.doctor import DoctorCreate, DoctorUpdate, DoctorResponse

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)


router = APIRouter()


_COUNTRY_BASE_BY_NAME: Dict[str, int] = {}


def _load_country_base_stats() -> Dict[str, int]:
  """
  Aggregate dengue_total by country name from the WHO CSV so that
  admin charts can show real-world burden, not just in-app samples.
  Cached in-memory after first load.
  """
  global _COUNTRY_BASE_BY_NAME
  if _COUNTRY_BASE_BY_NAME:
    return _COUNTRY_BASE_BY_NAME

  # Resolve CSV relative to backend/app/api/v1/ → ../../data/...
  data_path = (
    Path(__file__)
    .resolve()
    .parents[3]
    / "backend"
    / "data"
    / "Country Base Data (Long).csv"
  )

  if not data_path.exists():
    _COUNTRY_BASE_BY_NAME = {}
    return _COUNTRY_BASE_BY_NAME

  agg: Dict[str, int] = {}
  try:
    with data_path.open(newline="", encoding="utf-8") as f:
      reader = csv.DictReader(f)
      for row in reader:
        # Prefer full_name, fall back to adm_0_name
        name = (row.get("full_name") or row.get("adm_0_name") or "Unknown").strip() or "Unknown"
        try:
          count = int(row.get("dengue_total") or 0)
        except (TypeError, ValueError):
          count = 0
        if count < 0:
          continue
        agg[name] = agg.get(name, 0) + count
  except Exception:
    # On any parsing error, fail gracefully and just return empty so API still works.
    agg = {}

  _COUNTRY_BASE_BY_NAME = agg
  return _COUNTRY_BASE_BY_NAME


async def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
  if current_user.role != "admin":
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Admin privileges required",
    )
  return current_user


@router.get("/overview")
async def get_admin_overview(_: User = Depends(get_current_admin)) -> Dict[str, Any]:
  """High-level stats for admin dashboard."""
  # Dashboard user count should exclude admins.
  total_users = await User.find(User.role == "user").count()
  total_reports = await DiagnosisReport.find().count()
  total_doctors = await Doctor.find().count()

  # Use WHO base data for burden by country.
  by_country: Dict[str, int] = _load_country_base_stats()

  # Keep age and gender distributions based on in-app diagnosis reports.
  reports = await DiagnosisReport.find().to_list()
  by_gender: Dict[str, int] = {}
  by_age_band: Dict[str, int] = {}

  for r in reports:
    symptoms = r.symptoms or {}
    country = (symptoms.get("country") or "Unknown") or "Unknown"
    gender = (symptoms.get("gender") or "Unknown") or "Unknown"
    age_val = symptoms.get("age") or symptoms.get("patient_age")
    try:
      age = int(age_val) if age_val is not None else None
    except (TypeError, ValueError):
      age = None

    by_country[country] = by_country.get(country, 0) + 1
    by_gender[gender] = by_gender.get(gender, 0) + 1

    if age is None:
      band = "Unknown"
    elif age < 18:
      band = "<18"
    elif age < 30:
      band = "18-29"
    elif age < 45:
      band = "30-44"
    elif age < 60:
      band = "45-59"
    else:
      band = "60+"
    by_age_band[band] = by_age_band.get(band, 0) + 1

  return {
    "total_users": total_users,
    "total_reports": total_reports,
    "total_doctors": total_doctors,
    "diagnoses_by_country": by_country,
    "diagnoses_by_gender": by_gender,
    "diagnoses_by_age_band": by_age_band,
  }


@router.get("/users", response_model=List[UserResponse])
async def list_users(_: User = Depends(get_current_admin)):
  # Only list app users; exclude admin (and any other non-"user" roles).
  users = await User.find(User.role == "user").to_list()
  return [
    UserResponse(
      id=str(u.id),
      email=u.email,
      full_name=u.full_name,
      phone=u.phone,
      role=u.role,
      is_verified=u.is_verified,
      is_active=u.is_active,
      profile_picture=u.profile_picture,
      notifications_enabled=u.notifications_enabled,
      daily_reminders=u.daily_reminders,
      biometric_enabled=u.biometric_enabled,
      two_factor_enabled=u.two_factor_enabled,
      secondary_email=u.secondary_email,
      is_public=u.is_public,
    )
    for u in users
  ]


@router.get("/users/{user_id}/reports", response_model=List[DiagnosisResponse])
async def list_user_reports(user_id: str, _: User = Depends(get_current_admin)):
  reports = await DiagnosisReport.find(
    DiagnosisReport.user_id == user_id
  ).sort("-created_at").to_list()
  return [
    DiagnosisResponse(
      id=str(r.id),
      symptoms=r.symptoms,
      ml_prediction=r.ml_prediction,
      kbs_recommendation=r.kbs_recommendation,
      created_at=r.created_at,
    )
    for r in reports
  ]


@router.post("/doctors/upload-picture")
async def upload_doctor_picture(
    file: UploadFile = File(...),
    _: User = Depends(get_current_admin),
):
  """Upload doctor photo to Cloudinary (admin only). Returns secure URL."""
  if settings.CLOUDINARY_CLOUD_NAME == "your_cloud_name":
    raise HTTPException(
      status_code=500,
      detail="Cloudinary is not configured on the server.",
    )
  try:
    result = cloudinary.uploader.upload(
      file.file,
      folder="dengue_diagnose/doctors",
      public_id=f"doctor_{uuid.uuid4().hex[:16]}",
      resource_type="image",
    )
    url = result.get("secure_url")
    if not url:
      raise HTTPException(status_code=500, detail="Upload failed")
    return {"url": url}
  except HTTPException:
    raise
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")


@router.post("/doctors", response_model=DoctorResponse)
async def create_doctor(data: DoctorCreate, _: User = Depends(get_current_admin)):
  doc = Doctor(**data.dict())
  await doc.insert()
  return DoctorResponse(
    id=str(doc.id),
    name=doc.name,
    age=doc.age,
    picture_url=doc.picture_url,
    bio=doc.bio,
    dengue_expertise=doc.dengue_expertise,
  )


@router.get("/doctors", response_model=List[DoctorResponse])
async def list_doctors(_: User = Depends(get_current_admin)):
  docs = await Doctor.find().to_list()
  return [
    DoctorResponse(
      id=str(d.id),
      name=d.name,
      age=d.age,
      picture_url=d.picture_url,
      bio=d.bio,
      dengue_expertise=d.dengue_expertise,
    )
    for d in docs
  ]


@router.get("/doctors/{doctor_id}", response_model=DoctorResponse)
async def get_doctor(doctor_id: str, _: User = Depends(get_current_admin)):
  d = await Doctor.get(doctor_id)
  if not d:
    raise HTTPException(status_code=404, detail="Doctor not found")
  return DoctorResponse(
    id=str(d.id),
    name=d.name,
    age=d.age,
    picture_url=d.picture_url,
    bio=d.bio,
    dengue_expertise=d.dengue_expertise,
  )


@router.put("/doctors/{doctor_id}", response_model=DoctorResponse)
async def update_doctor(
  doctor_id: str, data: DoctorUpdate, _: User = Depends(get_current_admin)
):
  d = await Doctor.get(doctor_id)
  if not d:
    raise HTTPException(status_code=404, detail="Doctor not found")
  update_data = data.dict(exclude_unset=True)
  for key, value in update_data.items():
    setattr(d, key, value)
  await d.save()
  return DoctorResponse(
    id=str(d.id),
    name=d.name,
    age=d.age,
    picture_url=d.picture_url,
    bio=d.bio,
    dengue_expertise=d.dengue_expertise,
  )


@router.delete("/doctors/{doctor_id}")
async def delete_doctor(doctor_id: str, _: User = Depends(get_current_admin)):
  d = await Doctor.get(doctor_id)
  if not d:
    raise HTTPException(status_code=404, detail="Doctor not found")
  await d.delete()
  return {"message": "Doctor deleted"}


@router.get("/doctors-public", response_model=List[DoctorResponse])
async def list_public_doctors():
  """Public endpoint so normal users can see doctor list."""
  docs = await Doctor.find().to_list()
  return [
    DoctorResponse(
      id=str(d.id),
      name=d.name,
      age=d.age,
      picture_url=d.picture_url,
      bio=d.bio,
      dengue_expertise=d.dengue_expertise,
    )
    for d in docs
  ]


@router.get("/doctors-public/{doctor_id}", response_model=DoctorResponse)
async def get_public_doctor(doctor_id: str):
  d = await Doctor.get(doctor_id)
  if not d:
    raise HTTPException(status_code=404, detail="Doctor not found")
  return DoctorResponse(
    id=str(d.id),
    name=d.name,
    age=d.age,
    picture_url=d.picture_url,
    bio=d.bio,
    dengue_expertise=d.dengue_expertise,
  )

