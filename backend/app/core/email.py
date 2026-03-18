import aiosmtplib
from email.message import EmailMessage
from app.core.config import settings

async def send_otp_email(email_to: str, otp: str):
    message = EmailMessage()
    message["From"] = f"DengueGuard <{settings.EMAILS_FROM_EMAIL}>"
    message["To"] = email_to
    message["Subject"] = f"DengueGuard verification code"
    
    content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .email-container {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7f9;
                padding: 40px 20px;
                color: #333;
            }}
            .card {{
                max-width: 500px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                border: 1px solid #e1e8ed;
            }}
            .header {{
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                padding: 30px;
                text-align: center;
                color: #ffffff;
            }}
            .logo-text {{
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 1px;
                margin: 0;
            }}
            .logo-subtitle {{
                font-size: 12px;
                opacity: 0.8;
                text-transform: uppercase;
                letter-spacing: 2px;
            }}
            .content {{
                padding: 40px;
                text-align: center;
            }}
            .welcome-text {{
                font-size: 18px;
                margin-bottom: 10px;
                color: #1e293b;
            }}
            .instruction {{
                font-size: 14px;
                color: #64748b;
                margin-bottom: 30px;
            }}
            .otp-container {{
                background-color: #f8fafc;
                border: 2px dashed #cbd5e1;
                border-radius: 12px;
                padding: 20px;
                display: inline-block;
                margin: 0 auto;
            }}
            .otp-code {{
                font-size: 36px;
                font-weight: 800;
                letter-spacing: 10px;
                color: #0ea5e9;
                margin: 0;
            }}
            .footer {{
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #94a3b8;
                border-top: 1px solid #f1f5f9;
            }}
            .disclaimer {{
                margin-top: 15px;
                line-height: 1.5;
            }}
        </style>
    </head>
    <body style="margin: 0; padding: 0;">
        <div class="email-container">
            <div class="card">
                <div class="header">
                    <p class="logo-text">DengueGuard</p>
                    <p class="logo-subtitle">AI Health Assistant</p>
                </div>
                <div class="content">
                    <p class="welcome-text">Verify Your Account</p>
                    <p class="instruction">Use the 6-digit verification code below to complete your registration.</p>
                    
                    <div class="otp-container">
                        <p class="otp-code">{otp}</p>
                    </div>
                    
                    <p style="margin-top: 30px; font-size: 13px; color: #64748b;">
                        This code will expire in <strong>10 minutes</strong>.
                    </p>
                </div>
                <div class="footer">
                    <p class="disclaimer">
                        If you didn't request this code, you can safely ignore this email.<br>
                        © 2026 DengueGuard AI. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    message.add_alternative(content, subtype="html")

    await aiosmtplib.send(
        message,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USER,
        password=settings.SMTP_PASSWORD,
        use_tls=False,
        start_tls=settings.SMTP_TLS,
    )
