from fastapi import APIRouter, Depends, HTTPException, status, Body, File, UploadFile
import cloudinary
import cloudinary.uploader
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
from typing import Any, List
from jose import jwt, JWTError

from app.core import security
from app.core.config import settings
from app.core.email import send_otp_email
from app.schemas.user import UserCreate, UserResponse, Token, VerifyOTP, UserUpdate, TokenPayload
from app.models.dengue import User, OTPRecord, Notification, DiagnosisReport

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
    
    # Always create normal users from signup; admin accounts are seeded on startup.
    new_user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role="user",
        is_verified=False
    )
    await new_user.insert()
    
    # Send OTP
    otp = security.generate_otp()
    otp_record = OTPRecord(
        email=user_in.email,
        otp_code=otp,
        purpose="signup",
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10)
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
        OTPRecord.expires_at > datetime.now(timezone.utc)
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

@router.post("/request-2fa-otp")
async def request_2fa_otp(email: str = Body(..., embed=True), current_user: User = Depends(get_current_user)):
    otp = security.generate_otp()
    otp_record = OTPRecord(
        email=email,
        otp_code=otp,
        purpose="2fa_verify",
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10)
    )
    await otp_record.insert()
    
    try:
        await send_otp_email(email, otp)
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send verification email")
    
    return {"message": "OTP sent to secondary email"}

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
        profile_picture=current_user.profile_picture,
        notifications_enabled=current_user.notifications_enabled,
        daily_reminders=current_user.daily_reminders,
        biometric_enabled=current_user.biometric_enabled,
        two_factor_enabled=current_user.two_factor_enabled,
        secondary_email=current_user.secondary_email,
        is_public=current_user.is_public
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
    if update.notifications_enabled is not None:
        current_user.notifications_enabled = update.notifications_enabled
    if update.daily_reminders is not None:
        current_user.daily_reminders = update.daily_reminders
    if update.biometric_enabled is not None:
        current_user.biometric_enabled = update.biometric_enabled
    if update.two_factor_enabled is not None:
        current_user.two_factor_enabled = update.two_factor_enabled
    if update.secondary_email is not None:
        current_user.secondary_email = update.secondary_email
    if update.is_public is not None:
        current_user.is_public = update.is_public
    
    await current_user.save()
    
    # Send Notification
    if current_user.notifications_enabled:
        await Notification(
            user_id=str(current_user.id),
            title="Profile Updated",
            message="Your profile details have been successfully updated.",
            type="profile"
        ).insert()
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
        
        # Send Notification
        if current_user.notifications_enabled:
            await Notification(
                user_id=str(current_user.id),
                title="Profile Picture Changed",
                message="Your profile picture has been updated successfully.",
                type="profile"
            ).insert()
        
        return {"url": image_url}
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

@router.get("/public-profiles", response_model=List[UserResponse])
async def get_public_profiles():
    public_users = await User.find(User.is_public == True).to_list()
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
            is_public=u.is_public
        ) for u in public_users
    ]

@router.get("/public-profile/{user_id}")
async def get_public_profile_detail(user_id: str):
    user = await User.get(user_id)
    if not user or not user.is_public:
        raise HTTPException(status_code=404, detail="Public profile not found")
    
    reports = await DiagnosisReport.find(DiagnosisReport.user_id == user_id).to_list()
    
    return {
        "user": UserResponse(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            phone=user.phone,
            role=user.role,
            is_verified=user.is_verified,
            is_active=user.is_active,
            profile_picture=user.profile_picture,
            notifications_enabled=user.notifications_enabled,
            daily_reminders=user.daily_reminders,
            biometric_enabled=user.biometric_enabled,
            two_factor_enabled=user.two_factor_enabled,
            is_public=user.is_public
        ),
        "reports": reports
    }
