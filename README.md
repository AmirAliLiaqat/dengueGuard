# Dengue KBS Mobile App & AI Backend

This project is a comprehensive AI-Based Dengue Detection and Knowledge-Based Expert System (KBS). It features a Python FastAPI backend with ML and inference engines, and a React Native (Expo) mobile application.

## 🚀 Getting Started

### Backend Setup (FastAPI)
1. **Navigate to backend**: `cd backend`
2. **Setup virtual environment**: `python -m venv venv`
3. **Activate venv**:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. **Install dependencies**: `pip install -r requirements.txt`
5. **Run the server**: `uvicorn app.main:app --reload`

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
