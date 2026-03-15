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

### Frontend Setup (Expo)
1. **Navigate to frontend**: `cd frontend`
2. **Install dependencies**: `npm install`
3. **Run the app**: `npx expo start`

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

## 📊 Database Schema
The system uses PostgreSQL with the following tables:
- `users`: User authentication and roles.
- `diagnosis_history`: Stores past symptom logs and AI results.
- `knowledge_rules`: Dynamic repository for the KBS engine.
- `doctor_profiles`: Verification and specialization data for medical staff.

---

## 🛡️ Security
- **JWT Authentication** for all private API routes.
- **Passlib (Bcrypt)** for password hashing.
- **RBAC** for Admin, Doctor, and User roles.

---

## 🛠️ Tech Stack
- **Frontend**: React Native, JavaScript, Redux, Expo, Axios.
- **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL, Scikit-Learn.
- **AI**: Random Forest Classification + Forward Chaining Engine.
