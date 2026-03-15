from fastapi import APIRouter, Depends, HTTPException, status, Body, File, UploadFile
import cloudinary
import cloudinary.uploader
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from datetime import datetime, timedelta
from typing import Any
from jose import jwt, JWTError

from app.core import security
from app.core.config import settings
from app.core.email import send_otp_email
from app.schemas.user import UserCreate, UserResponse, Token, VerifyOTP, UserUpdate, TokenPayload
from app.models.dengue import User, OTPRecord

router = APIRouter()
reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

# Cloudinary Config
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

async def get_current_user(token: str = Depends(reusable_oauth2)) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        token_data = TokenPayload(**payload)
    except (JWTError, Exception):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    user = await User.get(token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/signup", response_model=UserResponse)
async def signup(user_in: UserCreate):
    user = await User.find_one(User.email == user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    new_user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role=user_in.role,
        is_verified=False
    )
    await new_user.insert()
    
    # Send OTP
    otp = security.generate_otp()
    otp_record = OTPRecord(
        email=user_in.email,
        otp_code=otp,
        purpose="signup",
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    await otp_record.insert()
    
    try:
        await send_otp_email(user_in.email, otp)
    except Exception as e:
        print(f"Failed to send email: {e}")
        # In real app, maybe don't fail signup but notify user
    
    return UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        full_name=new_user.full_name,
        phone=new_user.phone,
        role=new_user.role,
        is_verified=new_user.is_verified,
        is_active=new_user.is_active
    )

@router.post("/verify-otp")
async def verify_otp(data: VerifyOTP):
    record = await OTPRecord.find_one(
        OTPRecord.email == data.email,
        OTPRecord.otp_code == data.otp_code,
        OTPRecord.purpose == data.purpose,
        OTPRecord.expires_at > datetime.utcnow()
    )
    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    if data.purpose == "signup":
        user = await User.find_one(User.email == data.email)
        if user:
            user.is_verified = True
            await user.save()
            
            # Auto login after successful verification
            access_token = security.create_access_token(subject=str(user.id))
            await record.delete()
            return {
                "message": "Verification successful",
                "access_token": access_token
            }
    
    await record.delete()
    return {"message": "Verification successful"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one(User.email == form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not user.is_verified:
        # Optionally send a new OTP if not verified
        raise HTTPException(status_code=401, detail="Account not verified. Please verify your email.")

    access_token = security.create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        phone=current_user.phone,
        role=current_user.role,
        is_verified=current_user.is_verified,
        is_active=current_user.is_active,
        profile_picture=current_user.profile_picture
    )

@router.put("/me", response_model=UserResponse)
async def update_me(update: UserUpdate, current_user: User = Depends(get_current_user)):
    if update.full_name is not None:
        current_user.full_name = update.full_name
    if update.phone is not None:
        current_user.phone = update.phone
    if update.profile_picture is not None:
        current_user.profile_picture = update.profile_picture
    if update.password is not None:
        current_user.hashed_password = security.get_password_hash(update.password)
    
    await current_user.save()
    return await get_me(current_user)

@router.post("/upload-profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    print(f"Received file: {file.filename}, Content-type: {file.content_type}")
    try:
        # Check if cloudinary is configured
        if settings.CLOUDINARY_CLOUD_NAME == "your_cloud_name":
            raise HTTPException(
                status_code=500, 
                detail="Cloudinary is not configured on the server."
            )

        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file.file,
            folder="dengue_diagnose/profiles",
            public_id=f"user_{str(current_user.id)}",
            overwrite=True,
            resource_type="image"
        )
        
        image_url = result.get("secure_url")
        
        # Optionally update user automatically
        current_user.profile_picture = image_url
        await current_user.save()
        
        return {"url": image_url}
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
