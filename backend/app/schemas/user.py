from typing import Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_verified: Optional[bool] = False
    full_name: Optional[str] = None
    role: Optional[str] = "user"
    phone: Optional[str] = None
    profile_picture: Optional[str] = None

class UserCreate(UserBase):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_picture: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class VerifyOTP(BaseModel):
    email: EmailStr
    otp_code: str
    purpose: str = "signup"
