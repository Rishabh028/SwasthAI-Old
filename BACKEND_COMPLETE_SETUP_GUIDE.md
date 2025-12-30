# SwasthAI Backend - Complete Setup & Deployment Guide

## Overview

SwasthAI is a comprehensive healthcare platform built with:
- **Frontend**: React 18.2, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js 18+, Express.js, Prisma ORM
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Authentication**: JWT with bcryptjs
- **API**: RESTful with comprehensive documentation

---

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites
```bash
# Required
- Node.js 18+ (https://nodejs.org)
- Docker & Docker Compose (https://docker.com)
- Git

# Optional
- Postman (for API testing)
- pgAdmin (included in docker-compose)
```

### 2. Setup Environment Variables

Create `.env` file in `/backend`:

```env
# Database
DATABASE_URL="postgresql://swasth:swasth123@postgres:5432/swasthai"

# Redis
REDIS_URL="redis://redis:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this"
JWT_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Server
NODE_ENV="development"
PORT=5000
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"

# Optional Services
SENTRY_DSN=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
```

### 3. Start Services

```bash
# From project root
docker-compose up -d

# Wait 30 seconds for services to initialize
sleep 30

# Run migrations and seeding
cd backend
npm install --legacy-peer-deps

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Seed sample data
node src/scripts/seed.js

# Start backend server
npm run dev
```

### 4. Verify Setup

```bash
# Test health check
curl http://localhost:5000/health

# Expected response:
# {
#   "status": "OK",
#   "timestamp": "2024-12-30T10:30:00.000Z",
#   "uptime": 245.123
# }

# Test API
curl http://localhost:5000/api/v1

# Start frontend (in another terminal)
npm run dev
```

### 5. Access URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/v1
- **Health Check**: http://localhost:5000/health
- **pgAdmin**: http://localhost:5050
  - Email: admin@example.com
  - Password: admin

---

## 🔑 Test Credentials

### Patient Account
```
Email: patient@example.com
Password: Patient@123
```

### Doctor Accounts
```
Email: doctor1@example.com (Cardiologist)
Email: doctor2@example.com (General Physician)
Email: doctor3@example.com (Dermatologist)
Password (all): Doctor@123
```

---

## 📁 Project Structure

```
SwasthAI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Prisma client setup
│   │   ├── controllers/              # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── users.controller.js
│   │   │   ├── doctors.controller.js
│   │   │   ├── appointments.controller.js
│   │   │   ├── medicines.controller.js
│   │   │   ├── lab.controller.js
│   │   │   ├── health.controller.js
│   │   │   ├── forum.controller.js
│   │   │   ├── articles.controller.js
│   │   │   └── notifications.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication
│   │   │   ├── errorHandler.js      # Error handling
│   │   │   └── logger.js            # Request logging
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── users.routes.js
│   │   │   ├── doctors.routes.js
│   │   │   ├── appointments.routes.js
│   │   │   ├── medicines.routes.js
│   │   │   ├── lab.routes.js
│   │   │   ├── health.routes.js
│   │   │   └── forum.routes.js
│   │   ├── scripts/
│   │   │   └── seed.js              # Database seeding
│   │   └── app.js                   # Express server setup
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── migrations/              # Migration files
│   ├── .env.example
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── pages/                   # 29 complete pages
│   │   ├── Components/
│   │   ├── api/                     # API client
│   │   └── App.jsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints Summary

### Authentication (5 endpoints)
```
POST   /auth/register              - Register new user
POST   /auth/login                 - User login
POST   /auth/refresh               - Refresh access token
POST   /auth/forgot-password       - Request password reset
POST   /auth/reset-password        - Reset password with token
GET    /auth/me                    - Get current user (protected)
```

### Users (5 endpoints)
```
GET    /users/:id                  - Get user by ID
GET    /users/profile              - Get my profile (protected)
PUT    /users/profile              - Update profile (protected)
PUT    /users/health-profile       - Update health profile (protected)
PUT    /users/change-password      - Change password (protected)
```

### Doctors (6 endpoints)
```
GET    /doctors                    - List all doctors
GET    /doctors/nearby             - Get nearby doctors by location
GET    /doctors/:id                - Get doctor details
POST   /doctors/:id/reviews        - Add review to doctor (protected)
GET    /doctors/:id/reviews        - Get doctor reviews
```

### Appointments (7 endpoints)
```
POST   /appointments               - Book appointment (protected)
GET    /appointments               - Get my appointments (protected)
GET    /appointments/:id           - Get appointment details (protected)
PATCH  /appointments/:id/status    - Update appointment status (protected)
PATCH  /appointments/:id/reschedule - Reschedule appointment (protected)
DELETE /appointments/:id           - Cancel appointment (protected)
GET    /appointments/doctor/list   - Get doctor's appointments (protected)
```

### Medicines (5 endpoints)
```
GET    /medicines                  - List all medicines
GET    /medicines/:id              - Get medicine details
POST   /medicines/order            - Order medicines (protected)
GET    /medicines/orders/my        - Get my orders (protected)
PATCH  /medicines/orders/:id       - Update order status (protected)
```

### Lab Tests (6 endpoints)
```
GET    /lab/tests                  - List all lab tests
GET    /lab/tests/:id              - Get test details
POST   /lab/book                   - Book lab test (protected)
GET    /lab/bookings               - Get my bookings (protected)
GET    /lab/bookings/:id           - Get booking details (protected)
POST   /lab/bookings/:id/report    - Upload lab report (protected)
```

### Health Records (5 endpoints)
```
GET    /health/records             - Get my health records (protected)
GET    /health/records/:id         - Get record details (protected)
POST   /health/records             - Upload health record (protected)
PUT    /health/records/:id         - Update record (protected)
DELETE /health/records/:id         - Delete record (protected)
```

### Health Articles (5 endpoints)
```
GET    /health/articles            - List all articles
GET    /health/articles/:id        - Get article details
GET    /health/articles/saved      - Get saved articles (protected)
POST   /health/articles/:id/save   - Save article (protected)
DELETE /health/articles/:id/save   - Remove saved article (protected)
```

### Forum (7 endpoints)
```
GET    /forum/posts                - List all posts
POST   /forum/posts                - Create post (protected)
GET    /forum/posts/:id            - Get post details
PUT    /forum/posts/:id            - Update post (protected)
DELETE /forum/posts/:id            - Delete post (protected)
POST   /forum/posts/:id/comments   - Add comment (protected)
GET    /forum/posts/:id/comments   - Get comments
POST   /forum/posts/:id/upvote     - Upvote post (protected)
```

### Notifications (5 endpoints)
```
GET    /health/notifications       - Get my notifications (protected)
PATCH  /health/notifications/:id/read - Mark as read (protected)
PATCH  /health/notifications/read-all - Mark all as read (protected)
DELETE /health/notifications/:id   - Delete notification (protected)
GET    /health/notifications/unread-count - Get unread count (protected)
```

**Total: 50+ Endpoints fully implemented**

---

## 🗄️ Database Schema

### Core Models

**User**
- Central model with 10+ relationships
- Supports patients, doctors, admins
- Health profile, appointments, orders, forum posts, etc.

**Doctor**
- Specialty, qualifications, experience
- Location (latitude/longitude)
- Availability schedule, ratings, reviews

**Appointment**
- Booking system with status tracking
- Consultation type (online/in-clinic)
- Symptoms, notes, payment tracking

**HealthRecord**
- File storage with metadata
- Type categorization (prescription, lab_report, etc.)
- Sharing capabilities

**Medicine** & **MedicineOrder**
- Pharmacy inventory system
- Order tracking with status
- Prescription requirements

**LabTest** & **LabBooking**
- Lab services catalog
- Booking with home collection option
- Report generation and storage

**ForumPost** & **ForumComment**
- Community discussion
- Upvoting system
- Nested comments

**HealthArticle**
- Educational content
- Author information
- View/like tracking

**Notification**
- User notifications
- Multiple types (appointment, health reminder, etc.)
- Read status tracking

---

## 🔐 Security Features

✅ **Authentication**
- JWT with access & refresh tokens
- Short-lived access tokens (15 minutes default)
- Long-lived refresh tokens (7 days default)

✅ **Authorization**
- Role-based access control (RBAC)
- Protected routes with `@protect` middleware
- Resource ownership verification

✅ **Password Security**
- bcryptjs hashing with salt
- Minimum 8 characters required
- Password change functionality

✅ **Data Protection**
- SQL injection prevention (via Prisma)
- XSS protection (via validation)
- CORS enabled with configurable origins
- Helmet.js for HTTP headers

✅ **Rate Limiting**
- 100 requests per 15 minutes per IP
- Stricter limits for auth endpoints (5 per 15 min)

---

## 📊 Database Migrations

### Run Migrations
```bash
# Create new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations (production)
npx prisma migrate deploy

# View migration status
npx prisma migrate status
```

### Database Management

```bash
# Open Prisma Studio (interactive DB browser)
npx prisma studio

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# Seed database
node src/scripts/seed.js
```

---

## 🧪 Testing APIs

### Using cURL

```bash
# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@12345",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "Patient@123"
  }'

# Get authenticated user profile (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer TOKEN"

# List doctors
curl http://localhost:5000/api/v1/doctors

# Book appointment
curl -X POST http://localhost:5000/api/v1/appointments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": 1,
    "appointmentDate": "2025-01-15T10:00:00Z",
    "timeSlot": "10:00 AM",
    "consultationType": "online",
    "symptoms": "Chest pain"
  }'
```

### Using Postman

1. Import the collection: [Postman Collection](./postman-collection.json)
2. Set environment variables:
   - `base_url`: http://localhost:5000/api/v1
   - `token`: (set after login)
3. Test endpoints with pre-built requests

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend

# View database logs
docker-compose logs -f postgres

# Access PostgreSQL directly
docker exec -it swasthai-postgres psql -U swasth -d swasthai

# Rebuild images
docker-compose up -d --build
```

---

## 🚨 Troubleshooting

### Database Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:5432

Solution:
1. Ensure Docker is running: docker ps
2. Check containers: docker-compose ps
3. Restart services: docker-compose restart
4. Check DATABASE_URL in .env
```

### Port Already in Use
```
Error: bind: address already in use

Solution:
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Prisma Migration Issues
```
# Reset and re-migrate
npx prisma migrate reset

# Or manually:
npx prisma migrate dev --name fix_issue
```

### CORS Errors
```
Solution: Add your frontend URL to CORS_ORIGIN in .env
CORS_ORIGIN="http://localhost:5173,http://localhost:3000,https://yourdomain.com"
```

---

## 📈 Performance Optimization

### Database
- Indexes on frequently queried fields (email, phone, specialty, status)
- Connection pooling with Prisma
- Redis caching layer configured

### API
- Request compression enabled
- Rate limiting implemented
- Async/await for non-blocking operations

### Frontend
- Code splitting with React lazy loading
- Image optimization
- Framer Motion for smooth animations

---

## 📝 Environment Variables Complete Reference

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@host:port/database"

# Redis Cache
REDIS_URL="redis://host:port"

# Authentication
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Server
NODE_ENV="development|production"
PORT=5000

# CORS
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"

# Optional: Cloud Services
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
AWS_S3_BUCKET=""

STRIPE_SECRET_KEY=""
STRIPE_PUBLIC_KEY=""

SENDGRID_API_KEY=""
SENDGRID_FROM_EMAIL=""

TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

OPENAI_API_KEY=""

SENTRY_DSN=""
```

---

## 🚀 Deployment

### Local Deployment
```bash
# Development
npm run dev

# Production Build
npm run build
npm run start
```

### Docker Deployment
```bash
# Build and push to registry
docker build -t username/swasthai-backend:latest .
docker push username/swasthai-backend:latest

# Deploy with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment (AWS)
```bash
# Use provided Terraform templates
terraform init
terraform plan
terraform apply
```

---

## 📚 Additional Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Express Docs**: https://expressjs.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Docker Docs**: https://docs.docker.com
- **JWT Best Practices**: https://tools.ietf.org/html/rfc8725

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test thoroughly
3. Commit with clear messages: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file.

---

## ✉️ Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@swasthai.com
- Documentation: https://swasthai.gitbook.io

---

**Last Updated**: December 30, 2024  
**Backend Version**: 1.0.0  
**Status**: Production Ready ✅
