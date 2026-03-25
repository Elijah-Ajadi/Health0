# Health0 - Secure Health Identity & Clinical Suite

Health0 is a premium, high-density Electronic Medical Record (EMR) and Patient Identity platform. It leverages live **Interswitch NIN Verification** to ensure 100% identity accuracy and provides patients with a secure, digital vault for their medical history.

## 🚀 Core Features

### 👤 Patient Experience
- **NIN-Based Identity**: Secure registration and login using your National Identity Number.
- **Digital Health Vault**: Centralized storage for clinical documents, lab results, and imaging (AI-categorized).
- **Health Snapshot**: Real-time view of Blood Group, Genotype, Allergies, and Chronic Conditions.
- **Secure Sharing**: Access-controlled document delivery via Email (password-protected) or physical location requests.
- **Privacy Audit**: Complete observability of which clinical facility accessed your records and when.

### 🏥 Hospital Command Center
- **Clinical Dashboard**: Real-time traffic and critical alert monitoring for hospital wings.
- **Identity Gateway**: NIN-verified patient onboarding with Interswitch KYC integration.
- **Unified EMR View**: A high-density clinical timeline aggregating a patient's history across multiple facilities.
- **SOAP Documentation**: Structured diagnostic and upload portal for Clinical Notes.
- **Clinical Analytics**: RCM (Revenue Cycle Management), Supply Chain, and Patient Wait-Time AI.

---

## 🛠️ Tech Stack
- **Backend**: Django & Django REST Framework (DRF)
- **Frontend**: React Native & Expo (Web-optimized & Mobile-ready)
- **Identity**: Interswitch Identity Marketplace API
- **Persistence**: SQLite (Development) / PostgreSQL (Production)
- **Secure Storage**: `expo-secure-store` & `SecureStore` fallbacks

---

## 📥 Installation Guide

### Prerequisites
- **Python 3.9+**
- **Node.js 18+**
- **NPM** or **Yarn**

### 1. Repository Setup
```bash
git clone <repository-url>
cd health0
```

### 2. Backend Setup (Django)

#### 🪟 Windows
1. Create and active virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Configure environment:
   ```powershell
   copy .env.example .env
   # Update .env with your Interswitch credentials
   ```
4. Run migrations and start server:
   ```powershell
   python manage.py migrate
   python manage.py runserver
   ```

#### 🍎 macOS / 🐧 Linux
1. Create and active virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment:
   ```bash
   cp .env.example .env
   # Update .env with your Interswitch credentials
   ```
4. Run migrations and start server:
   ```bash
   python3 manage.py migrate
   python3 manage.py runserver
   ```

### 3. Frontend Setup (Expo)

1. Navigate to the app directory:
   ```bash
   cd health0_app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure frontend environment:
   Ensure the root `.env` file contains:
   `EXPO_PUBLIC_API_URL=http://localhost:8000` (Update with your local IP for physical device testing).
4. Start the Expo development server:
   ```bash
   npx expo start
   ```

---

## 🔒 Security Note
- Never commit your `.env` file to version control.
- In production, ensure `DEBUG=False` in your `.env` and set a strong `SECRET_KEY`.
- All clinical data is served over authenticated endpoints requiring valid DRF Tokens.

## 📄 License
MIT License - Copyright (c) 2026 Health0 Team.
