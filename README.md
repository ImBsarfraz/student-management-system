# Secure Student Management System
### OAuth 2.0 + Hybrid Cryptography (RSA-OAEP + AES-256) + MERN Stack

A production-grade secure CRUD application where a React frontend and Node.js backend communicate using:

- OAuth 2.0 (Client Credentials Flow)
- JWT Authentication
- RSA-OAEP (SHA-256) Asymmetric Encryption
- AES-256-CBC Symmetric Encryption
- End-to-End Encrypted Payloads
- MongoDB Database

This project demonstrates a **hybrid encryption architecture** similar to real-world secure systems.

---

## Features

### Security Architecture

- OAuth 2.0 `/auth/token` endpoint
- JWT-based client authentication
- RSA public key handshake (`/auth/public-key`)
- AES-256-CBC encryption for request payload
- RSA-OAEP (SHA-256) encryption of AES keys
- Encrypted responses from backend
- Automatic token injection using Axios interceptors
- Middleware-based decryption on backend

---

### Application Features

- Create Student
- Read Students
- Update Student
- Delete Student
- Bootstrap Production UI
- Loading states
- Secure session initialization

---

# Architecture Overview

## Secure Request Flow

1. React generates RSA keypair (Web Crypto API)
2. React sends public key to `/auth/token`
3. Backend issues JWT
4. React fetches server RSA public key
5. For every POST/PUT/DELETE:
   - Generate one-time AES key
   - Encrypt payload using AES-256-CBC
   - Encrypt AES key using Server RSA (OAEP SHA-256)
6. Backend:
   - Verifies JWT
   - Decrypts AES key using private RSA key
   - Decrypts payload
   - Processes request
7. Backend response:
   - Encrypts response with AES
   - Encrypts AES key with client public key
8. React decrypts response

This is a **Hybrid Cryptography Model** used in real secure systems.

---

# Tech Stack

### Frontend
- React
- Web Crypto API
- Axios
- Bootstrap 5

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- jsonwebtoken
- Node Crypto module

---

# Project Structure

student-management-system/

├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ └── app.js
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │ ├── context/
│ │ ├── services/
│ │ └── App.jsx
│ └── main.jsx

---

# Environment Variables

Create `.env` file inside backend:
PORT=5000
MONGO_DB_URI=mongodb://127.0.0.1:27017/student-management-system
JWT_SECRET=your_super_secret_key
CLIENT_ID=system_client
CLIENT_SECRET=supersecretclient
---

# Installation

## Clone Repository
git clone <repo-url>
cd student-management-system
---

## Backend Setup
cd backend
npm install
npm start

Server runs at: (http://localhost:5000)
---

## Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs at: http://localhost:5173


---

# API Endpoints

## Authentication

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/auth/token` |
| GET  | `/api/v1/auth/public-key` |

---

## Students

| Method | Endpoint |
|--------|----------|
| GET | `/api/v1/students` |
| POST | `/api/v1/students` |
| PUT | `/api/v1/students/:id` |
| DELETE | `/api/v1/students/:id` |

All non-GET requests require encrypted payload.

---

# How to Test

1. Start backend
2. Start frontend
3. Open DevTools → Network tab
4. Verify:
   - JWT in Authorization header
   - Encrypted request payload
   - Encrypted response payload

---

# Cryptography Details

| Layer | Algorithm |
|-------|-----------|
| Asymmetric | RSA-OAEP |
| Hash | SHA-256 |
| Symmetric | AES-256-CBC |
| Key Length | 2048-bit RSA |
| Token | JWT |

---

# Security Notes

- RSA keys generated at server startup
- AES key is generated per request (one-time use)
- OAEP hash explicitly set to SHA-256
- Token stored in localStorage (can upgrade to httpOnly cookies in production)
- Designed for educational and architectural demonstration

---

# What This Project Demonstrates

- Deep understanding of OAuth 2.0
- JWT verification & middleware protection
- Hybrid encryption systems
- WebCrypto ↔ Node Crypto compatibility
- Secure API architecture
- Production-ready React state management

---

# Future Improvements

- Refresh token flow
- AES-GCM (authenticated encryption)
- HTTPS deployment
- Docker containerization
- CI/CD pipeline
- Rate limiting
- Request replay protection

---

# Author

Sarfraz Bagwan  
Full Stack Developer (MERN)

---

# Why This Project Is Important

This project goes beyond CRUD.

It demonstrates:

- Secure system design
- Cryptographic interoperability
- Authentication + encryption layering
- Real-world backend architecture

---





