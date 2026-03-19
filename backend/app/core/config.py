from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DengueGuard"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "45c5c77d8fcfbe97e0d13ad1125ade5cbcf4ad6ebaf6580320b77a404ace8ca24a2de599" # Change in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # MongoDB settings
    MONGODB_URL: str = "mongodb+srv://amirliaqat2020:Secureatlab2023@denguediagnose.djwbbld.mongodb.net/dengue_db"
    
    # Email / SMTP settings for OTP
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_USER: str = "demouser0309@gmail.com" # Set in .env
    SMTP_PASSWORD: str = "lxsv awvc pmze ukjq" # Set in .env
    EMAILS_FROM_EMAIL: str = "demouser0309@gmail.com"
    
    # Cloudinary settings
    CLOUDINARY_CLOUD_NAME: str = "your_cloud_name"
    CLOUDINARY_API_KEY: str = "your_api_key"
    CLOUDINARY_API_SECRET: str = "your_api_secret"

    # Default admin bootstrap (can be overridden via .env)
    # Use the same email/password you want to log in with.
    ADMIN_EMAIL: str = "admin@dengueguard.com"
    ADMIN_PASSWORD: str = "Admin123!"
    ADMIN_FULL_NAME: str = "DengueGuard Admin"

    model_config = {
        "case_sensitive": True,
        "env_file": ".env"
    }

settings = Settings()
