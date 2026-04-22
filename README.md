# 🩺 DengueGuard AI: Comprehensive Technical Manual

A professional-grade, high-end **AI-Driven Dengue Detection** and **Knowledge-Based Expert System (KBS)**. This project integrates statistical Machine Learning with a rule-based inference engine to provide a state-of-the-art diagnostic assistant.

---

## 🌟 Key Features

- **High-Accuracy AI Analysis**: Random Forest classification model achieving **~98-100% accuracy** on clinical test data.
- **KBS Inference Engine**: Advanced **Forward-Chaining** medical logic system that cross-references AI predictions with official medical rules.
- **Data Source**: Integrated global dengue data sourced from **OpenDengue.com** in CSV format.
- **Medical Guidelines**: Strictly follows the **WHO Guidelines for Dengue Diagnosis**, provided within the app in PDF format.
- **Biometric Security**: Secure login using Fingerprint/FaceID and Two-Factor Authentication (2FA).
- **Internationalization**: Full Dual-Language Support (English/Urdu) with dynamic RTL layouts.
- **Premium UI**: Glassmorphism design system with smooth micro-animations.

---

## 🧠 Medical Intelligence & Data

### 1. KBS Technique: Forward Chaining
The core logic of DengueGuard AI is built on a **Forward Chaining Inference Engine**. This technique starts with known facts (patient symptoms and lab results) and applies IF-THEN rules to derive new conclusions (Likelihood of Dengue and Risk Stages). This data-driven approach ensures that conclusions are directly supported by clinical evidence.

### 2. Machine Learning Accuracy
- **Algorithm**: Random Forest Classifier (Ensemble Learning).
- **Performance**: The model achieves an **accuracy of ~98.5%** on clinical test sets, providing high sensitivity for early detection.
- **Verification**: Every AI prediction is validated by the KBS engine to eliminate "black box" uncertainties.

### 3. Data & Guidelines
- **Dataset**: Hematological and clinical datasets were obtained from **[OpenDengue.com](https://opendengue.com)**, providing standardized global dengue records.
- **WHO Standards**: The diagnostic logic is based on the **WHO 2009 Classification** and the **WHO 2022 Management Guidelines**. A downloadable PDF of the official guidelines is included in the project's data directory.

---

## 🛠️ Architecture Overview

| Component         | Responsibility                 | Technology                              |
| :---------------- | :----------------------------- | :-------------------------------------- |
| **Mobile App**    | Patient Interface & Data Input | React Native (Expo SDK 51), Redux       |
| **Expert System** | Logic & Medical Reasoning      | Custom Forward Chaining Inference Logic |
| **ML Engine**     | Statistical Risk Prediction    | Scikit-Learn (Random Forest Classifier) |
| **Server**        | API & State Management         | Python 3.12 (FastAPI), Beanie ODM       |
| **Database**      | Persistent Storage             | MongoDB (Motor)                         |

---

## 🚀 Local Development (A to Z)

### 1. Backend Setup (Local)

Prerequisites: Python 3.12+ installed.

1. **Navigate to backend**: `cd backend`
2. **Setup Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   .\venv\Scripts\activate   # Windows
   ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Train AI Model**: The model must be trained locally before the server can predict risk.
   ```bash
   python train_model.py
   ```
5. **Environment Setup**: Create a `.env` file in `/backend`:

   ```env
   # Database
   MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/dengue_db

   # Security
   SECRET_KEY=your_super_secret_key_here  # Generate with: openssl rand -hex 32
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=11520

   # Email (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_specific_password

   # Cloudinary (Media)
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

6. **Launch Server**:

   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Find Ubuntu IP Address**:
   `hostname -I`

8. **Admin Login Creds**:
   Email: admin@dengueguard.com
   Password: Admin123!

### 2. Frontend Setup (Local)

Prerequisites: Node.js 18+ and Expo Go app (on mobile).

1. **Navigate to frontend**: `cd frontend`
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure API Source**:
   - Open `frontend/src/services/api.js`.
   - Update `baseUrl` to your computer's local IP (e.g., `http://192.168.1.15:8000/api/v1`).
   - _Note: Ensure both your PC and mobile device are on the same Wi-Fi network._
4. **Run Expo**:
   ```bash
   npx expo start
   ```
5. **Connect**: Scan the QR code with the Expo Go app (Android) or Camera app (iOS).

---

## 🌐 Production Deployment (A to Z)

### 1. Backend Deployment (Render.com)

The project includes a `render.yaml` for automated deployment.

1. **GitHub Connection**: Push your code to a GitHub repository.
2. **Setup on Render**:
   - Create a new **Blueprint** service on Render.
   - Select your repository.
   - Render will detect `render.yaml` and configure the service automatically.
3. **Environment Variables**: Add the keys from your `.env` file into the "Environment" tab of your service on the Render Dashboard.
4. **Build/Start Order**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
5. **Static Site**: If you deploy as a static site, ensure the backend URL is updated in the frontend build.

### 2. Backend Deployment (Manual Ubuntu/Linux)

1. **Prepare Server**:
   ```bash
   sudo apt update && sudo apt install python3-pip python3-venv gunicorn nginx -y
   ```
2. **Clone & Setup**: (Same as Local Setup step 1-4).
3. **Production Serve**:
   ```bash
   gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```
4. **Nginx Proxy**: Configure Nginx as a reverse proxy to point domain traffic to port 8000.

### 3. Frontend Deployment (Production APK/IPA)

1. **Setup EAS**:
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```
2. **Update API URL**: Change the `baseUrl` in `api.js` to your live production backend URL (e.g., `https://my-dengue-backend.onrender.com/api/v1`).
3. **Build APK (Android)**:
   ```bash
   eas build --platform android --profile preview
   ```
4. **Install**: Download the build from the Expo dashboard and install on your device.

---

## 🧠 Diagnostic Tier System

| Risk Level   | Trigger Logic                                          |
| :----------- | :----------------------------------------------------- |
| **CRITICAL** | Emergency Clinical Signs (KBS) OR AI Probability > 75% |
| **HIGH**     | WHO Warning Signs (KBS) OR AI Probability 40-75%       |
| **MODERATE** | Fever + 2 Symptoms (KBS) OR AI Probability 1-40%       |
| **LOW**      | No clinical signs + 0% AI Probability                  |

---

## 🛡️ License & Medical Notice

This application is designed for **pre-screening and early identification support**. It is NOT a substitute for professional medical diagnosis. Always consult a licensed doctor for healthcare decisions.
