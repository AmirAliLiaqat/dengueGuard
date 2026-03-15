# 🩺 Dengue Diagnose AI: Mobile & Backend System

A professional, high-end AI-Based Dengue Detection and Knowledge-Based Expert System (KBS). This project combines advanced Machine Learning with a rules-based medical inference engine to provide accurate diagnostic assistance.

---

## ✨ Key Features
- **AI-Powered Diagnosis**: Random Forest classification for high-accuracy dengue risk detection.
- **Expert System**: Forward-chaining inference engine applying medical rules for clinical recommendations.
- **Premium UI**: Stunning dark-mode mobile interface with glassmorphism and smooth animations.
- **Secure Auth**: JWT-based authentication, user roles (Admin, Doctor, User), and OTP email verification.
- **Profile Management**: Customizable user profiles including name, email, and phone number.

---

## 🛠️ Tech Stack
- **Frontend**: React Native (Expo SDK 51), Redux Toolkit, RTK Query, Lucide Icons.
- **Backend**: Python 3.12, FastAPI, Beanie (ODM), MongoDB (Motor).
- **AI/ML**: Scikit-Learn (Random Forest), Pandas, NumPy.
- **Email**: SMTP integration with STARTTLS support for Gmail.

---

## 🚀 Local Development

### 1. Backend Setup (FastAPI)
1. **Navigate to backend**:
   ```powershell
   cd backend
   ```
2. **Setup virtual environment**:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. **Install dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```
4. **Configure Environment**: Create or update `.env` with your `MONGODB_URL`, `SMTP_USER`, and `SMTP_PASSWORD`.
5. **Run the server**:
   ```powershell
   uvicorn app.main:app --reload --host 0.0.0.0
   ```
   *Note: Using `--host 0.0.0.0` is required for your mobile device to connect to your computer's IP.*

### 2. Frontend Setup (React Native)
1. **Navigate to frontend**:
   ```powershell
   cd frontend
   ```
2. **Install dependencies**:
   ```powershell
   npm install
   ```
3. **Set API IP**: Open `src/services/api.js` and update `API_BASE_URL` to your computer's local IPv4 address (found via `ipconfig`).
4. **Run the app**:
   ```powershell
   npx expo start
   ```

---

## 🌍 Deployment on Render.com

Follow these steps to deploy the **Python Backend** only:

1. **GitHub Repository**: Push your code to a GitHub repository.
2. **Create Web Service**:
   - Log in to [Render.com](https://render.com).
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository.
3. **Configure Settings**:
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: 
     ```bash
     gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
     ```
4. **Environment Variables**:
   Add the following in the **Environment** tab:
   - `MONGODB_URL`: Your MongoDB Atlas connection string.
   - `SECRET_KEY`: A secure random string for JWT.
   - `SMTP_HOST`: `smtp.gmail.com`
   - `SMTP_PORT`: `587`
   - `SMTP_USER`: Your Gmail address.
   - `SMTP_PASSWORD`: Your Gmail App Password.
   - `EMAILS_FROM_EMAIL`: Your Gmail address.

---

## 📊 Database (MongoDB)
The system uses MongoDB Atlas with Beanie ODM:
- `users`: Stores account data, authentication tokens, and **phone numbers**.
- `otp_records`: Temporary storage for signup and password reset verification codes.
- `diagnosis_reports`: History of AI predictions and symptoms for each user.
- `knowledge_rules`: Rules repository for the KBS inference engine.

---

## 🛡️ Security & Privacy
- **Bcrypt Hashing**: Passwords stored using secure hashing.
- **JWT Protection**: All private endpoints require a valid bearer token.
- **STARTTLS**: Email communication is encrypted for maximum security.
