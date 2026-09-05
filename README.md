# 🛡️ SecureSentinel

> **Autonomous File Integrity Monitoring, Provable Data Possession & Cryptographic Vault Security**  
> 🔥 **Track: Agentic Solutions: Powered by x402 on Algorand Testnet**

![Algorand](https://img.shields.io/badge/Algorand-Testnet-000000?logo=algorand)
![x402](https://img.shields.io/badge/x402-AVM%20Protocol-F3BE65)
![Facilitator](https://img.shields.io/badge/Facilitator-GoPlausible-8CD7A5)
![Explorer](https://img.shields.io/badge/Explorer-LoRA%20AlgoKit-blue)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-green?logo=fastapi)

---

## 🔥 Hackathon Track: Agentic Solutions (Powered by x402 & Algorand)

SecureSentinel integrates an **Autonomous Security Sentinel Agent** that performs on-chain cryptographic file possession attestations and deep forensic threat scans, gated by the **x402 HTTP Payment Protocol** on **Algorand Testnet** through the **GoPlausible Facilitator**.

### 🛠️ Mandatory Track Compliance Verification

| Requirement | Implementation in SecureSentinel | Verification Link / Command |
|---|---|---|
| **x402 Integration** | HTTP 402 Payment Required challenge-response protocol with AVM exact scheme | `curl -i -X POST https://securesentinel.onrender.com/api/x402/challenge` |
| **Algorand Blockchain** | Algorand Testnet (Genesis: `testnet-v1.0`, CAIP-2: `algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=`) | `/api/x402/config` |
| **GoPlausible Facilitator** | Payments routed and verified via GoPlausible multi-chain facilitator | `https://facilitator.goplausible.xyz` |
| **LoRA Testnet Explorer** | Live confirmed on-chain transactions directly verifiable on LoRA | [LoRA Testnet Explorer](https://lora.algokit.io/testnet) |
| **`@x402-avm` Package** | Genuine `@x402-avm/avm` (v2.6.1) and `algosdk` integrated | `client/package.json` |
| **Live Working Flow** | Interactive **Agentic x402 Hub** in UI (`/agentic-hub`) with 4-step challenge-response | `/agentic-hub` in dashboard |

### 🔄 x402 Protocol Architecture

```
1. Client/Agent Request  ──> POST /api/x402/attest (Unsigned)
2. HTTP 402 Challenge    <── 402 Payment Required (Price: $0.005 USDC, GoPlausible Facilitator)
3. On-Chain Settlement   ──> Transaction signed & settled on Algorand Testnet via GoPlausible
4. Immutable Proof       <── 200 OK + Certified Attestation + LoRA Explorer URL
```

---

## 📖 Overview

SecureSentinel is a cybersecurity-focused web application that verifies file integrity using **SHA-256 cryptographic hashing**. It enables organizations to upload files, verify file authenticity, monitor audit logs, detect tampered files, and generate professional verification reports.

The application features a modern dashboard, JWT-based authentication, audit logging, analytics, and PDF report generation.

---

# ✨ Features

### 🔐 Authentication
- JWT Authentication
- Protected API Endpoints
- Protected React Routes
- Secure Login
- Logout

### 📂 File Management
- Drag & Drop Upload
- SHA-256 Hash Generation
- Secure File Storage
- File Verification

### 🛡 Security
- Tamper Detection
- Integrity Verification
- Audit Logging
- Security Alerts

### 📊 Dashboard
- Statistics Cards
- Verification Analytics
- Recent Activity
- Security Status

### 📄 Reports
- Download Verification Report (PDF)
- SHA-256 Information
- Verification Status

---

# 🏗 Tech Stack

## Frontend
- React
- Vite
- React Router
- Axios
- Recharts
- React Icons
- React Toastify

## Backend
- FastAPI
- Python
- SQLAlchemy
- SQLite
- JWT Authentication
- ReportLab

## Tools
- Git
- GitHub
- VS Code
- Linux (Ubuntu)

---

# 📁 Project Structure

```
SecureSentinel
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── app/
│   │   ├── auth/
│   │   ├── database/
│   │   ├── services/
│   │   ├── main.py
│   │   └── ...
│   │
│   ├── uploads/
│   ├── reports/
│   └── requirements.txt
│
└── README.md
```

---

# ⚙️ System Architecture

```
                User
                  │
                  ▼
        React + Vite Frontend
                  │
          REST API (Axios)
                  │
                  ▼
          FastAPI Backend
                  │
     ┌────────────┴────────────┐
     │                         │
     ▼                         ▼
 SQLite Database         SHA-256 Engine
     │                         │
     └────────────┬────────────┘
                  ▼
          PDF Report Generator
```

---

# 🔄 Workflow

```
User Login
      │
      ▼
Upload File
      │
      ▼
Generate SHA-256 Hash
      │
      ▼
Store Hash in Database
      │
      ▼
Verify Uploaded File
      │
      ▼
Compare SHA-256 Hashes
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Verified  Tampered
 │         │
 └────┬────┘
      ▼
Audit Logs
      │
      ▼
Generate PDF Report
```

---

# 📊 Modules

## Dashboard
- Statistics
- Verification Analytics
- Recent Activity
- Security Status

## Upload
- Drag & Drop Upload
- SHA-256 Generation
- Success Notification

## Verify
- File Integrity Verification
- SHA-256 Comparison
- Verification Result
- PDF Report Download

## Audit Logs
- Upload History
- Verification History
- Search Logs

## Alerts
- Tampered Files
- Security Warnings

## Profile
- Administrator Information
- Session Status

---

# 🔒 Security Features

- JWT Authentication
- Protected Routes
- Protected APIs
- SHA-256 File Hashing
- Audit Logging
- Tamper Detection
- Secure Report Generation

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/SecureSentinel.git
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

---

## Backend

```bash
cd server

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

# 🔑 Default Login

```
Username:
admin

Password:
admin123
```

---

# 📷 Screenshots

## Login
<img width="1920" height="965" alt="Screenshot From 2026-07-22 13-38-30" src="https://github.com/user-attachments/assets/bf16243e-e064-4771-a50b-2f5864804c9e" />


## Dashboard
<img width="1920" height="965" alt="Screenshot From 2026-07-22 13-38-54" src="https://github.com/user-attachments/assets/02ba5fa6-9592-4fa8-b600-a95130513bfd" />


## Upload
<img width="1920" height="965" alt="Screenshot From 2026-07-22 13-39-08" src="https://github.com/user-attachments/assets/3341d7c7-f37c-41df-99e3-5e45c2c3b589" />


## Verify
<img width="1920" height="965" alt="Screenshot From 2026-07-22 13-39-18" src="https://github.com/user-attachments/assets/8bf58fdb-5c9e-4114-9f73-158d7e205bc3" />


## Audit Logs
<img width="1920" height="965" alt="Screenshot From 2026-07-22 13-39-28" src="https://github.com/user-attachments/assets/643674ec-468b-4938-b3d7-c8bd7a0bfc01" />


## Alerts
<img width="1920" height="965" alt="Screenshot From 2026-07-22 13-39-39" src="https://github.com/user-attachments/assets/8184b18a-9b80-4ebf-9be9-ea08f2d8becc" />


## Profile
<img width="1920" height="965" alt="Screenshot From 2026-07-22 13-39-50" src="https://github.com/user-attachments/assets/12f57270-2a40-4e04-8509-46a13c75e56a" />


---

# 📈 Future Enhancements

- Role-Based Access Control
- Email Notifications
- Cloud Deployment
- PostgreSQL Support
- Multi-user Authentication
- AI-based Threat Detection
- Real-Time Monitoring
- Blockchain Integrity Verification

---

# 🎯 Learning Outcomes

This project demonstrates knowledge of:

- React
- FastAPI
- REST APIs
- JWT Authentication
- SQLAlchemy
- SQLite
- File Upload Handling
- SHA-256 Cryptographic Hashing
- Audit Logging
- PDF Generation
- Data Visualization
- Full Stack Development

---

# 👨‍💻 Author

**Syed Irfan Ahmed**

Computer Science Engineering Student

GitHub: https://github.com/YOUR_USERNAME

LinkedIn: https://linkedin.com/in/YOUR_PROFILE

---

# 📜 License

This project is licensed under the MIT License.

---

## ⭐ If you like this project, consider giving it a star on GitHub!
