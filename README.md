<img width="1920" height="965" alt="Screenshot From 2026-07-22 13-38-30" src="https://github.com/user-attachments/assets/751e5906-1b3d-4ce6-879c-f1878628422f" /># 🛡️ SecureSentinel

> A Secure File Integrity Verification & Audit Management System built with **React**, **FastAPI**, **SQLite**, and **SHA-256**.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-green?logo=fastapi)
![SQLite](https://img.shields.io/badge/SQLite-Database-blue?logo=sqlite)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-green)

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
