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
