from typing import Optional
from pydantic import BaseModel, HttpUrl


class DoctorBase(BaseModel):
  name: str
  age: Optional[int] = None
  picture_url: Optional[HttpUrl | str] = None
  bio: Optional[str] = None
  dengue_expertise: Optional[str] = None


class DoctorCreate(DoctorBase):
  pass


class DoctorUpdate(BaseModel):
  name: Optional[str] = None
  age: Optional[int] = None
  picture_url: Optional[HttpUrl | str] = None
  bio: Optional[str] = None
  dengue_expertise: Optional[str] = None


class DoctorResponse(DoctorBase):
  id: str

  class Config:
    from_attributes = True

