# Health0 - Secure Health Identity & Clinical Suite 🛡️🏥💨

Health0 is a premium, high-density Electronic Medical Record (EMR) and Patient Identity platform. It leverages live **Interswitch NIN Verification** to ensure 100% identity accuracy and provides patients with a secure, digital vault for their medical history.

---

## 🚀 Live Demo (For Judges)

### 🖥️ Production Ecosystem
- **Patient Mobile (Web Mode)**: [https://health0.vercel.app](https://health0.vercel.app)
- **Hospital Portal**: [https://healthhospital.vercel.app](https://healthhospital.vercel.app)
- **Admin Dashboard**: [https://healthadmin-delta.vercel.app](https://healthadmin-delta.vercel.app)
- **Production API**: [https://health0.onrender.com/api/](https://health0.onrender.com/api/)
- **Mobile App(Android) APK link**: [drive.google.com](https://drive.google.com/file/d/17MKQxTkm9egtPgv5a6iPjBEAZrtVCVpZ/view?usp=sharing)


### 📶 USSD Offline Demo 
To experience the offline medical ledger:
1.  Go to the [Africa's Talking USSD Simulator](https://developers.africastalking.com/simulator).
2.  Log in and set your test phone number to: `0800000000`
3.  Dial the service code: `*384*11911#`
4.  **Workflow**: Check health status, request data delivery, or reset your PIN using your NIN!

---

## 💠 Core Ecosystem

### 👤 Patient Mobile Experience
- **NIN-Verified Registration**: Seamless onboarding via Interswitch Identity Marketplace.
- **Digital Health Vault**: Categorized storage for clinical documents, lab results, and imaging.
- **Unified Health Timeline**: Aggregated view of all clinical events (Hospital-verified vs. Manual).
- **Secure Sharing**: Access-controlled sharing via Email or Physical Delivery with mandatory PIN authentication.

### 📶 USSD Offline Gateway (Access for All)
- Provides critical health data (Blood Group, Genotype, Allergies) without internet.
- Securely reset PIN via NIN verification.
- Trigger physical report delivery to the registered home address.

### 🏥 Hospital Command Center
- **EMR Detail View**: High-density clinical history of a patient with verified/unverified markers.
- **Identity Gateway**: Automated KYC checking via NIN/VNIN.

---

## 🛠️ Tech Stack
- **Backend**: Django (Python 3.14) & Django REST Framework (DRF)
- **Frontend**: React Native & Expo (Web-optimized)
- **Identity**: Interswitch Identity Marketplace API
- **Persistence**: PostgreSQL (Production)
- **Infrastructure**: Hosted on Render & Vercel

---

## 📄 License
MIT License - Copyright (c) 2026 Foundation Team for Enyata Hackathon 2026.
