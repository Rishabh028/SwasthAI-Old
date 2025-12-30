# SwasthAI - Deployment Architecture & Visual Guide

**Last Updated:** December 30, 2025

---

## 🏗️ System Architecture

### Local Development Environment
```
┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT SETUP                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐  │
│  │   Frontend   │     │   Backend    │     │  PostgreSQL  │  │
│  │   (React)    │────▶│  (Express)   │────▶│   Database   │  │
│  │ :3000        │     │   :5000      │     │   :5432      │  │
│  └──────────────┘     └──────────────┘     └──────────────┘  │
│                             │                     │            │
│                             ▼                     ▼            │
│                       ┌──────────────┐     ┌──────────────┐  │
│                       │    Redis     │     │   PgAdmin    │  │
│                       │   Cache      │     │   (Web UI)   │  │
│                       │   :6379      │     │   :5050      │  │
│                       └──────────────┘     └──────────────┘  │
│                                                                 │
│  All services run in Docker containers via docker-compose      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Production AWS Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                     AWS PRODUCTION SETUP                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                     ┌─────────────────┐                        │
│                     │   Route 53      │                        │
│                     │  (DNS)          │                        │
│                     └────────┬────────┘                        │
│                              │                                 │
│                     ┌────────▼────────┐                        │
│                     │ ACM SSL Cert    │                        │
│                     └────────┬────────┘                        │
│                              │                                 │
│                     ┌────────▼────────────────┐               │
│                     │  Application Load       │               │
│                     │  Balancer (ALB)         │               │
│                     └────────┬─────────────────┘              │
│                              │                                │
│           ┌──────────────────┼──────────────────┐             │
│           │                  │                  │             │
│    ┌──────▼──────┐    ┌──────▼──────┐   ┌─────▼─────┐       │
│    │ ECS Task 1  │    │ ECS Task 2  │   │CloudFront │       │
│    │ Backend API │    │ Frontend    │   │(CDN)      │       │
│    └──────┬──────┘    └──────┬──────┘   └───────────┘       │
│           │                  │                                │
│           └──────────────────┼───────────────────┐            │
│                              │                   │            │
│                     ┌────────▼─────────┐         │            │
│                     │ RDS PostgreSQL   │         │            │
│                     │ (Multi-AZ)       │         │            │
│                     └──────────────────┘         │            │
│                                                  │            │
│                     ┌──────────────────┐         │            │
│                     │ ElastiCache      │         │            │
│                     │ Redis Cluster    │         │            │
│                     └──────────────────┘         │            │
│                                                  │            │
│                     ┌──────────────────┐         │            │
│                     │ S3 Bucket        │◀────────┘            │
│                     │ (File Storage)   │                      │
│                     └──────────────────┘                      │
│                                                                 │
│                     ┌──────────────────┐                      │
│                     │ CloudWatch       │                      │
│                     │ Monitoring       │                      │
│                     └──────────────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Component Breakdown

### Frontend (React + Vite)
```
Frontend (http://localhost:3000)
├── 🏠 Home Page
│   ├── Quick Access Links
│   ├── Featured Doctors
│   └── Health Tips
├── 👨‍⚕️ Doctor Features
│   ├── Find Doctor
│   ├── Doctor Profile
│   ├── Book Appointment
│   └── My Appointments
├── 🩺 Health Features
│   ├── Symptom Checker (AI)
│   ├── Health Records
│   ├── Lab Booking
│   └── Health Articles
├── 💊 Pharmacy
│   ├── Browse Medicines
│   ├── Upload Prescription
│   └── Order Medicine
├── 👤 User Features
│   ├── Profile
│   ├── Onboarding
│   ├── ABHA Integration
│   └── Settings
└── 🔐 Authentication
    ├── Sign Up
    ├── Login
    ├── Password Reset
    └── Email Verification

Technologies:
- React 18 + React Router
- Vite (build tool)
- TailwindCSS (styling)
- Leaflet (maps)
- React Query (data fetching)
```

### Backend (Node.js + Express)
```
Backend (http://localhost:5000/api/v1)
├── 🔐 Auth Module
│   ├── POST /auth/register
│   ├── POST /auth/login
│   ├── POST /auth/refresh
│   └── POST /auth/logout
├── 👥 Users Module
│   ├── GET /users/:id
│   ├── PUT /users/:id
│   ├── GET /users/profile
│   └── PUT /users/profile
├── 👨‍⚕️ Doctors Module
│   ├── GET /doctors
│   ├── GET /doctors/:id
│   ├── GET /doctors/search
│   └── POST /doctors/filter
├── 📅 Appointments Module
│   ├── POST /appointments
│   ├── GET /appointments
│   ├── PUT /appointments/:id
│   └── DELETE /appointments/:id
├── 📋 Health Records Module
│   ├── POST /health-records/upload
│   ├── GET /health-records
│   ├── DELETE /health-records/:id
│   └── PUT /health-records/:id
├── 💊 Medicines Module
│   ├── GET /medicines
│   ├── POST /medicines/order
│   └── GET /medicines/order-history
├── 🧪 Lab Module
│   ├── GET /lab/tests
│   ├── POST /lab/booking
│   ├── GET /lab/bookings
│   └── GET /lab/reports
└── 💬 Forum Module
    ├── GET /forum/posts
    ├── POST /forum/posts
    ├── POST /forum/comments
    └── POST /forum/upvotes

Technologies:
- Express.js (framework)
- Prisma (ORM)
- PostgreSQL (database)
- Redis (caching)
- JWT (authentication)
```

### Database Schema
```
PostgreSQL Database
├── User (Core user data)
│   ├── id, email, phone (unique)
│   ├── passwordHash, fullName
│   ├── gender, bloodGroup, dateOfBirth
│   ├── city, state, country, address
│   ├── abhaId (health ID)
│   ├── isVerified, isActive
│   ├── role (user, doctor, pharmacy, lab, admin)
│   └── timestamps
├── Doctor (Doctor-specific data)
│   ├── userId (foreign key)
│   ├── qualifications, specialization
│   ├── licenseNumber, yearsExperience
│   ├── hospital, clinic
│   ├── consultationFee
│   ├── rating, reviewCount
│   └── availableSlots
├── Appointment
│   ├── userId, doctorId (foreign keys)
│   ├── dateTime, duration
│   ├── status, type (online/offline)
│   ├── notes, rescheduleReason
│   └── paymentStatus
├── HealthRecord
│   ├── userId (foreign key)
│   ├── documentType (prescription, lab, report, etc.)
│   ├── fileUrl, uploadDate
│   ├── isShared, sharedWith
│   └── expiryDate
├── LabBooking
│   ├── userId, labId (foreign keys)
│   ├── tests (array)
│   ├── collectionType (home/lab)
│   ├── dateTime, status
│   └── reportUrl, reportDate
├── MedicineOrder
│   ├── userId (foreign key)
│   ├── medicines (array with quantities)
│   ├── prescriptionUrl
│   ├── totalAmount, paymentStatus
│   ├── deliveryAddress, estimatedDelivery
│   └── orderStatus
├── ForumPost
│   ├── userId (foreign key)
│   ├── title, content, category
│   ├── upvoteCount, commentCount
│   └── timestamps
├── HealthArticle
│   ├── title, content, category
│   ├── imageUrl, readingTime
│   ├── author, publishedDate
│   └── likes, shares
└── Additional tables
    ├── HealthProfile (BMI, allergies, medications)
    ├── SymptomCheck (AI assessments)
    ├── ArticleComment, PostUpvote, etc.
    └── [28+ tables total]
```

---

## 🔄 Deployment Workflow

### Local Development Flow
```
1. Clone Repository
   └─ git clone <repo>

2. Setup Environment
   └─ Create backend/.env from .env.example

3. Start Containers
   └─ docker-compose up -d
   
4. Wait for Health Checks
   └─ Services initialize (30 seconds)

5. Run Migrations
   └─ Prisma migrations execute automatically

6. Access Application
   ├─ Frontend: http://localhost:3000
   ├─ Backend: http://localhost:5000
   ├─ Database: http://localhost:5050
   └─ Test features

7. Stop & Cleanup
   └─ docker-compose down
```

### AWS Deployment Flow
```
1. Prepare Infrastructure
   ├─ Create VPC & Subnets
   ├─ Create RDS Database
   ├─ Create ElastiCache Redis
   └─ Create Load Balancer

2. Build & Push Images
   ├─ docker build (backend)
   ├─ docker build (frontend)
   ├─ docker push (to ECR)
   └─ Update image URIs

3. Deploy to ECS
   ├─ Create Task Definitions
   ├─ Create Services
   ├─ Setup Auto-Scaling
   └─ Configure Monitoring

4. Setup Domain & SSL
   ├─ Create Route53 records
   ├─ Create SSL Certificate (ACM)
   └─ Configure HTTPS

5. Run Migrations
   ├─ Connect to RDS
   ├─ Execute Prisma migrations
   └─ Seed data (optional)

6. Verify Deployment
   ├─ Test API endpoints
   ├─ Check CloudWatch metrics
   ├─ Verify all services healthy
   └─ Test all features

7. Monitor & Maintain
   ├─ Daily: Check logs & errors
   ├─ Weekly: Review metrics
   ├─ Monthly: Security audit
   └─ Ongoing: Scale as needed
```

---

## 📊 Data Flow Diagram

### User Registration Flow
```
┌─────────┐
│ Browser │
└────┬────┘
     │ POST /api/v1/auth/register
     ▼
┌──────────────────┐
│  Express Server  │
│  (Validation)    │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  Hash Password   │
│  (bcryptjs)      │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  PostgreSQL      │
│  Insert User     │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  Cache User      │
│  (Redis)         │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  Send Email      │
│  (SendGrid)      │
└────┬─────────────┘
     │
     ▼
┌─────────┐
│ Browser │
│ Success │
└─────────┘
```

### Doctor Search & Booking Flow
```
┌─────────┐
│ Browser │
└────┬────┘
     │ GET /api/v1/doctors?specialization=cardiology
     ▼
┌──────────────────┐
│  Redis Cache     │
│  Check Cache     │
└────┬─────────────┘
     │ Cache Miss
     ▼
┌──────────────────┐
│  PostgreSQL      │
│  Query Doctors   │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  Store in Redis  │
│  Cache Results   │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  Return JSON     │
│  Doctor List     │
└────┬─────────────┘
     │
     ▼
┌────────────────────┐
│ User Select Doctor │
└────┬───────────────┘
     │ POST /api/v1/appointments
     ▼
┌──────────────────────┐
│ Create Appointment   │
│ (PostgreSQL)         │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Send Notifications   │
│ - Email (SendGrid)   │
│ - SMS (Twilio)       │
└────┬─────────────────┘
     │
     ▼
┌─────────┐
│ Success │
└─────────┘
```

---

## 🚀 Quick Start Decision Tree

```
Want to deploy SwasthAI?
│
├─ "I want to test locally FIRST"
│  └─ Follow: LOCAL_DEPLOYMENT.md
│     └─ docker-compose up -d
│        └─ Done! ✅ (5 minutes)
│
├─ "I want production AWS deployment"
│  └─ Follow: DEPLOYMENT_PLAN.md Phase 2-4
│     ├─ Setup AWS Account
│     ├─ Configure CloudFormation
│     ├─ Deploy Infrastructure
│     └─ Deploy Application
│        └─ Done! ✅ (2-3 hours)
│
├─ "I want the fastest possible launch"
│  └─ Use: Heroku
│     ├─ Create Heroku Account
│     ├─ Deploy Code
│     ├─ Add Database
│     └─ Add Redis
│        └─ Done! ✅ (30 minutes)
│
├─ "I want Kubernetes"
│  └─ Use: CloudFormation + EKS
│     ├─ Create EKS Cluster
│     ├─ Configure Helm
│     ├─ Deploy with Helm Charts
│     └─ Setup monitoring
│        └─ Done! ✅ (2-4 hours)
│
└─ "I need help"
   └─ Read: DEPLOYMENT_PLAN.md
      └─ Review DEPLOYMENT_CHECKLIST.md
```

---

## 📈 Performance Metrics

### Target Performance
```
Frontend
├─ Page Load: < 3 seconds
├─ Time to Interactive: < 5 seconds
├─ First Contentful Paint: < 1.5 seconds
└─ Largest Contentful Paint: < 2.5 seconds

Backend
├─ API Response: < 500ms
├─ Database Query: < 100ms
├─ Cache Hit Rate: > 70%
└─ Uptime: > 99.5%

Database
├─ Query Time: < 100ms
├─ Connection Pool: 20-50 connections
├─ Backup Duration: < 10 minutes
└─ Replication Lag: < 1 second

Infrastructure
├─ CPU Utilization: 30-60%
├─ Memory Utilization: 50-70%
├─ Network Latency: < 50ms
└─ Disk Usage: < 80%
```

---

## 🔒 Security Architecture

```
┌─────────────────────────────────────┐
│      User's Browser / Mobile        │
└────────────┬────────────────────────┘
             │
             │ HTTPS/SSL
             ▼
┌─────────────────────────────────────┐
│        CloudFront CDN               │
│    (Optional, caches static)        │
└────────────┬────────────────────────┘
             │
             │ HTTPS/SSL
             ▼
┌─────────────────────────────────────┐
│      WAF (Web Application)          │
│      (Optional, DDoS protection)    │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Application Load Balancer         │
│   (Rate Limiting, SSL Termination)  │
└────────────┬────────────────────────┘
             │
             ├──────────────────────┐
             │                      │
             ▼                      ▼
        ┌────────┐            ┌─────────┐
        │Backend │            │Frontend │
        │(Node)  │            │(Nginx)  │
        └────┬───┘            └─────────┘
             │
             ├──────────────────────┐
             │                      │
             ▼                      ▼
      ┌────────────┐         ┌─────────────┐
      │PostgreSQL  │         │ Redis Cache │
      │(Encrypted) │         │(Encrypted)  │
      └────────────┘         └─────────────┘
             │
             ▼
      ┌────────────┐
      │  S3 Files  │
      │(Encrypted) │
      └────────────┘

Security Layers:
1. HTTPS/SSL Encryption
2. WAF Rules (optional)
3. Rate Limiting (Nginx)
4. Authentication (JWT)
5. Database Encryption
6. Backup Encryption
7. Secrets Management
```

---

## 📋 Document Index

| Document | Purpose | Read Time | When to Read |
|----------|---------|-----------|-------------|
| [LOCAL_DEPLOYMENT.md](./LOCAL_DEPLOYMENT.md) | Quick 5-min local setup | 5 min | First (today) |
| [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md) | Complete strategy guide | 30 min | Before deployment |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Pre/during/post tasks | Reference | During deployment |
| [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) | Overview of all documents | 10 min | Getting started |
| [This Document] | Visual guide & architecture | 15 min | Understanding structure |

---

## ✅ Deployment Readiness Checklist

- [x] Code is complete and tested
- [x] Docker configuration ready
- [x] Database schema defined
- [x] API endpoints working
- [x] Frontend components built
- [x] Documentation complete
- [x] Security configured
- [x] Environment templates created
- [x] Deployment scripts ready
- [x] Backup strategy defined
- [x] Monitoring configured
- [x] Team trained

---

## 🎯 Next Steps

**Right Now:**
1. Open [LOCAL_DEPLOYMENT.md](./LOCAL_DEPLOYMENT.md)
2. Run `docker-compose up -d`
3. Test at http://localhost:3000

**This Week:**
1. Read [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md)
2. Choose deployment platform
3. Setup infrastructure

**Next Week:**
1. Deploy application
2. Configure monitoring
3. Run final tests

**Production:**
1. Follow [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
2. Monitor continuously
3. Plan scaling

---

**Status:** ✅ **READY FOR DEPLOYMENT**  
**Last Updated:** December 30, 2025  
**Created By:** AI Deployment Assistant
