# 🏥 SwasthAI - Comprehensive Health Navigator Platform

<div align="center">

[![Frontend](https://img.shields.io/badge/Frontend-Live%20on%20Netlify-success)](https://swasthai-old.netlify.app)
[![Backend](https://img.shields.io/badge/Backend-Live%20on%20Render-success)](https://swasthai-old-backend.onrender.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20on%20Neon-blue)](https://neon.tech)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Node](https://img.shields.io/badge/Node-v18+-blue)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v18.2-blue)](https://react.dev)

**A full-stack healthcare platform with telemedicine, health records, symptom checking, and community forums.**

[Visit Live Site](https://swasthai-old.netlify.app) • [Backend API](https://swasthai-old-backend.onrender.com) • [GitHub](https://github.com/Rishabh028/SwasthAI-Old)

</div>

---

## 📋 Quick Links

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Contributing](#contributing)

---

## 🎯 Overview

**SwasthAI** is a production-ready healthcare platform connecting patients with doctors. Built with modern web technologies and deployed on cloud infrastructure.

### What Makes It Special
- ✅ **Full-Stack Application** - React frontend + Express backend + PostgreSQL database
- ✅ **Production Deployed** - Live on Netlify, Render, and Neon
- ✅ **Secure Authentication** - JWT-based with bcrypt password hashing
- ✅ **Responsive Design** - Mobile-first with Tailwind CSS
- ✅ **Real-time Data** - PostgreSQL with Prisma ORM
- ✅ **Professional UI** - 30+ pages with smooth animations

### Key Achievements
- 🚀 Complete backend-to-frontend integration
- 📦 10,000+ lines of production code
- 🔒 Secure authentication system
- 📊 Real database with 15+ tables
- 🎨 Beautiful UI with animations
- 🌍 Global CDN deployment

---

## 🛠️ Tech Stack

### Frontend
```
React 18.2 (UI Framework)
Vite 5.0 (Build Tool)
TailwindCSS 3.4 (Styling)
React Router 6.20 (Navigation)
Framer Motion 10.16 (Animations)
React Query 5.25 (Data Fetching)
Axios 1.6 (HTTP Client)
```

### Backend
```
Express.js 4.18 (Web Framework)
Node.js 18+ (Runtime)
Prisma 5.0 (ORM)
PostgreSQL 15 (Database)
JWT 9.0 (Authentication)
bcryptjs 2.4 (Password Hashing)
Helmet 7.0 (Security)
```

### Infrastructure
```
Frontend: Netlify (CDN + Auto-deploy)
Backend: Render (Container + Auto-deploy)
Database: Neon PostgreSQL (Cloud)
Version Control: GitHub
```

---

## ✨ Features

### 👤 User Management
- ✅ Secure registration & login
- ✅ JWT-based authentication
- ✅ Profile management
- ✅ Role-based access (User, Doctor, Admin)

### 👨‍⚕️ Doctor Features
- ✅ Doctor profiles with specialties
- ✅ Ratings and reviews
- ✅ Search by specialty
- ✅ Geographic location filtering
- ✅ Consultation fees

### 📅 Appointments
- ✅ Book appointments
- ✅ View appointment history
- ✅ Appointment confirmation
- ✅ Status tracking
- ✅ Reschedule & cancel

### 📋 Health Records
- ✅ Personal health data
- ✅ Medical history
- ✅ Upload documents
- ✅ ABHA ID linking
- ✅ Prescriptions & reports

### 🏥 Lab & Pharmacy
- ✅ Book lab tests
- ✅ Order medicines
- ✅ Prescription management
- ✅ Order tracking
- ✅ Test results

### 💊 Additional Features
- ✅ Symptom checker
- ✅ Health forum
- ✅ Health coach
- ✅ Articles & tips
- ✅ Notifications

---

## 🚀 Live Deployment

### Access Now
```
Frontend:  https://swasthai-old.netlify.app
Backend:   https://swasthai-old-backend.onrender.com
API Health: https://swasthai-old-backend.onrender.com/health
```

### Test Accounts
```
Admin:     admin@swasthai.com / admin123
Doctor:    doctor@swasthai.com / doctor123
Patient:   patient@swasthai.com / patient123
```

---

## ⚡ Quick Start

### Prerequisites
```
Node.js v18+
npm v9+
Git
PostgreSQL (or Neon account)
```

### 1. Clone Repository
```bash
git clone https://github.com/Rishabh028/SwasthAI-Old.git
cd SwasthAI-Old
```

### 2. Install & Run Frontend
```bash
npm install
npm run dev
```
Opens at: http://localhost:5173

### 3. Install & Run Backend
```bash
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```
Runs on: http://localhost:5000

### 4. Create .env Files

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api/v1
```

**Backend (.env)**
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost/swasthai
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

---

## 📦 Installation

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Setup database
npm run migrate    # Run migrations
npm run seed       # Add test data

# Start development
npm run dev

# Production start
npm start
```

### Database Setup (Neon)

1. Create account at https://console.neon.tech
2. Create PostgreSQL project
3. Copy connection string
4. Add to `backend/.env`
```
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require&connection_limit=10"
```

5. Run migrations
```bash
npm run migrate
npm run seed
```

---

## 🔐 Authentication

### How It Works

```
Login Form
    ↓
POST /api/v1/auth/login
    ↓
Server validates & returns JWT
    ↓
Frontend stores in localStorage
    ↓
All API calls include: Authorization: Bearer {token}
    ↓
Server validates token
    ↓
Access granted/denied
```

### Token Details
- Access Token: 15 minutes
- Refresh Token: 7 days
- Storage: localStorage
- Method: JWT (JSON Web Token)

---

## 📡 API Reference

### Base URL
```
Development: http://localhost:5000/api/v1
Production: https://swasthai-old-backend.onrender.com/api/v1
```

### Auth Endpoints

**Login**
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@swasthai.com",
  "password": "admin123"
}
```

**Register**
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Get Current User**
```bash
GET /api/v1/auth/me
Authorization: Bearer {token}
```

**Logout**
```bash
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

### Doctor Endpoints

**Get Doctors**
```bash
GET /api/v1/doctors?limit=10&offset=0&specialty=Cardiology
```

**Get Doctor Profile**
```bash
GET /api/v1/doctors/:id
```

### Appointment Endpoints

**Book Appointment**
```bash
POST /api/v1/appointments
Authorization: Bearer {token}

{
  "doctorId": 1,
  "appointmentDate": "2024-02-15",
  "appointmentTime": "14:30",
  "reason": "General checkup"
}
```

**Get Appointments**
```bash
GET /api/v1/appointments
Authorization: Bearer {token}
```

### Health Records

**Get Records**
```bash
GET /api/v1/health
Authorization: Bearer {token}
```

### Forum

**Get Posts**
```bash
GET /api/v1/forum?category=Health&page=1
```

---

## 📂 Project Structure

### Frontend
```
src/
├── pages/               # 30+ page components
│   ├── Login.jsx       # ✨ Login page
│   ├── Signup.jsx      # ✨ Signup page
│   ├── Home.jsx
│   ├── DoctorSearch.jsx
│   ├── Profile.jsx
│   └── ...
├── Components/         # Reusable components
├── Entities/           # Data models
├── api/
│   └── axiosClient.js  # API client with JWT
├── App.jsx             # Main routing
└── main.jsx            # Entry point
```

### Backend
```
src/
├── app.js              # Express setup
├── routes/             # API routes (8 files)
│   ├── auth.routes.js
│   ├── doctors.routes.js
│   └── ...
├── controllers/        # Business logic (8 files)
│   ├── auth.controller.js
│   ├── doctor.controller.js
│   └── ...
├── middleware/         # Express middleware
│   ├── errorHandler.js
│   ├── protect.js      # JWT validation
│   └── ...
└── config/
    └── database.js     # Prisma client

prisma/
├── schema.prisma       # Database schema (538 lines)
└── migrations/         # Migration files
```

---

## 🔧 Development

### Commands

**Frontend**
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview build
```

**Backend**
```bash
npm run dev        # Development (nodemon)
npm start          # Production
npm run migrate    # Database migrations
npm run seed       # Seed test data
npm run test       # Run tests
npm run lint       # Lint code
```

### Code Quality

```bash
cd backend

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

---

## 🌍 Deployment

### Current Setup

| Component | Platform | Auto-Deploy | Status |
|-----------|----------|------------|--------|
| Frontend | Netlify | ✅ Yes | Live |
| Backend | Render | ✅ Yes | Live |
| Database | Neon | N/A | Connected |

### Deploy Frontend

**Option 1: GitHub Integration (Auto)**
```bash
# Push to main - automatically deployed
git push origin main
```

**Option 2: Manual (Netlify CLI)**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy Backend

**Option 1: GitHub Integration (Auto)**
```bash
# Push to main - automatically deployed
git push origin main
```

**Option 2: Manual (Render Dashboard)**
1. Go to https://dashboard.render.com
2. Select service
3. Click "Manual Deploy"

### Environment Variables

**Frontend (Netlify)**
```
VITE_API_URL=https://swasthai-old-backend.onrender.com/api/v1
```

**Backend (Render)**
```
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
CORS_ORIGIN=https://swasthai-old.netlify.app
PORT=5000
```

---

## 🧪 Testing

### Manual Tests
- [ ] Login/Signup works
- [ ] Logout clears tokens
- [ ] Doctor search works
- [ ] Can book appointment
- [ ] Health records visible
- [ ] Forum posts load
- [ ] Protected routes require auth

### API Testing
```bash
# Test backend health
curl https://swasthai-old-backend.onrender.com/health

# Test login
curl -X POST https://swasthai-old-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@swasthai.com","password":"admin123"}'
```

---

## 🐛 Troubleshooting

### Frontend Issues

**Issue: Login page not loading**
```bash
npm run build
curl https://swasthai-old-backend.onrender.com/health
```

**Issue: Token lost on refresh**
```javascript
// Check localStorage
console.log(localStorage.getItem('authToken'))
// Clear and try again
localStorage.clear()
```

### Backend Issues

**Issue: 500 errors on login**
- Check DATABASE_URL is correct
- Verify JWT_SECRET is set
- Check Render logs

**Issue: CORS errors**
- Update CORS_ORIGIN in .env
- Verify frontend URL

### Database Issues

**Issue: Migration fails**
```bash
cd backend
npm run migrate
```

**Issue: No seed data**
```bash
npm run seed
```

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| React Components | 30+ |
| Pages | 30+ |
| API Endpoints | 50+ |
| Database Tables | 15+ |
| Lines of Code | 10,000+ |
| Frontend Deps | 25+ |
| Backend Deps | 15+ |

---

## 🤝 Contributing

### How to Contribute

1. Fork the repository
2. Create branch (`git checkout -b feature/amazing-feature`)
3. Make changes
4. Commit (`git commit -m 'feat: Add feature'`)
5. Push (`git push origin feature/amazing-feature`)
6. Create Pull Request

### Commit Format
```
feat: Add feature
fix: Fix bug
docs: Update docs
style: Format code
refactor: Refactor code
test: Add tests
chore: Update deps
```

---

## 📄 License

MIT License - See LICENSE file

---

## 📞 Support

- 📖 Read full docs
- 🐛 Report bugs in Issues
- 💬 Discuss features
- 📧 Email: support@swasthai.com

---

## 🎉 Acknowledgments

- React & React Router teams
- Express.js framework
- Prisma ORM
- PostgreSQL
- Netlify & Render hosting
- All contributors

---

<div align="center">

Made with ❤️ by **SwasthAI Team**

[⬆ Back to Top](#-swasthai---comprehensive-health-navigator-platform)

</div>
