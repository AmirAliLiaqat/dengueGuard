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
   ```bash
   cd backend
   ```
2. **Setup virtual environment**:
   - **Windows**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **Linux/Ubuntu/macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Train AI Model**: Before running the server, you must generate the model file.
   ```bash
   python train_model.py
   ```
5. **Configure Environment**: Create a `.env` file in the `backend/` directory:
   ```env
   MONGODB_URL=your_mongodb_uri
   SECRET_KEY=your_random_secret_key
   SMTP_USER=your_gmail_address
   SMTP_PASSWORD=your_app_password
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
6. **Run the server**:
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   *Note: Using `--host 0.0.0.0` allows your mobile device to connect to your computer's local IP.*

### 2. Frontend Setup (Expo)
1. **Navigate to frontend**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure API URL**: Update `frontend/src/services/api.js` with your computer's local IP address (e.g., `http://192.168.1.10:8000/api/v1`).
4. **Run the app**:
   ```bash
   npx expo start
   ```

---

## 🌐 Production Deployment

### 1. Deploying on Render.com
Your project is configured for Render via `render.yaml`.
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
- **Environment Variables**: Ensure you add all `.env` keys in the Render Dashboard.

### 2. Deploying on Ubuntu Server
1. **Install Prerequisites**:
   ```bash
   sudo apt update && sudo apt install python3-pip python3-venv gunicorn -y
   ```
2. **Setup Program**: Follow the "Local Development" steps to clone and install.
3. **Run with Gunicorn**:
   ```bash
   gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```
4. **Reverse Proxy**: It is recommended to use **Nginx** to proxy traffic to port 8000.

---

## 🏗️ System Architecture

### 1. AI Diagnosis Module
Uses a **Random Forest Classifier** trained on hematological data (Platelets, WBC, Hematocrit) and symptom frequency (Fever, Headache, etc.).
- Location: `backend/app/ml/model.py`

### 2. Knowledge-Based System (KBS)
Implements a **Forward Chaining Inference Engine** to apply medical rules to patient symptoms and ML outputs.
- Location: `backend/app/engine/inference.py`

### 3. Mobile Application
Built with **React Native (Expo)** using a premium dark-mode design system.
- State Management: **Redux Toolkit + RTK Query**
- Icons: **Lucide React Native**
- Navigation: **React Navigation**

---

## 🧠 7-Tier AI-KBS Hybrid Logic

The system utilizes a sophisticated **Hybrid Inference Engine** that combines statistical Machine Learning (AI) with deterministic Knowledge-Based rules (KBS).

| Tier | Priority | Logic Category | Trigger Criteria & Description | Risk Status |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **100** | **Clinical Emergency** | Life-threatening signs detected (Shock, Severe Bleeding, Organ failure). Overrides all AI probabilities. | **CRITICAL** |
| **2** | **90-80**| **AI High Confidence** | AI predicts "Severe" or "Warning Stage" with **75% - 100%** confidence. | **CRITICAL / HIGH** |
| **3** | **70-60**| **Clinical Warning** | Detects WHO Warning Signs (Abdominal pain, fluid accumulation, lethargy). | **HIGH** |
| **4** | **55-45**| **AI Medium Confidence** | AI predicts risk with **40% - 75%** confidence. Labeled as "AI Predicted Risk". | **HIGH / MODERATE** |
| **5** | **40-30**| **Clinical Baseline** | Classic clinical Dengue symptoms met (Fever + 2 symptoms). Handles Home Management cases. | **MODERATE** |
| **6** | **25-10**| **AI Low Confidence** | Even with **1% - 40%** confidence, AI "Severe" predictions are monitored for safety. | **MODERATE** |
| **7** | **0**    | **Safe Fallback** | No clinical signs present and AI confidence at 0%. | **LOW** |

---

## 📊 Database Schema
The system uses **MongoDB** via the **Beanie ODM** for flexible medical record storage:
- `users`: User authentication, profiles, and roles.
- `diagnosis_reports`: Detailed historical logs of symptoms, ML predictions, and KBS results.
- `notifications`: User action logs, daily reminders, and health alerts.
- `otp_records`: Temporary secure verification codes for authentication.

---

## 🛡️ Security
- **JWT Authentication** for all private API routes.
- **Passlib (Bcrypt)** for password hashing.
- **OTP Verification**: Email-based verification for secure signups.
- **RBAC**: Role-Based Access Control (Admin, Doctor, User).

---

## 🛠️ Summary Tech Stack
- **Mobile**: React Native, Expo, Redux Toolkit, RTK Query, Lucide Icons.
- **Server**: Python, FastAPI, MongoDB, Scikit-Learn.
- **Logic**: Random Forest Classification + Tiered Forward Chaining Engine.
