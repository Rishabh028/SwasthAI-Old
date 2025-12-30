# SwasthAI Backend - Developer Quick Reference

## 🚀 Commands Cheat Sheet

### Initial Setup
```bash
cd backend
npm install --legacy-peer-deps
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### Development
```bash
# Start backend in dev mode (with auto-reload)
npm run dev

# Run linter
npm run lint

# Format code
npm run format

# Run tests (if configured)
npm test

# Check for vulnerabilities
npm audit
```

### Database
```bash
# Open Prisma Studio
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (deletes all data)
npx prisma migrate reset

# Show migration status
npx prisma migrate status

# Seed database
npm run seed
```

### Docker
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild
docker-compose up -d --build

# Remove volumes
docker-compose down -v
```

---

## 📂 File Structure Quick Guide

```
backend/
├── src/
│   ├── app.js                      # Main Express app
│   ├── config/
│   │   └── database.js             # Prisma client
│   ├── controllers/                # Business logic
│   ├── middleware/                 # Auth, logging, errors
│   ├── routes/                     # API endpoints
│   └── scripts/
│       └── seed.js                 # Database seeding
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Migration history
├── .env                            # Environment variables
├── package.json
└── docker-compose.yml
```

---

## 🔑 Key Environment Variables

```
DATABASE_URL            # PostgreSQL connection string
JWT_SECRET              # JWT signing key (change in production!)
JWT_REFRESH_SECRET      # Refresh token key
NODE_ENV                # development/production
PORT                    # Server port (default: 5000)
CORS_ORIGIN             # Allowed origins
```

---

## 🛣️ Route Patterns

### Pattern 1: List with Filters
```javascript
// GET /api/v1/doctors?specialty=Cardiologist&city=Mumbai&minRating=4
GET /doctors
GET /doctors?specialty=value&city=value&minRating=value
```

### Pattern 2: CRUD Operations
```javascript
GET    /resource              // List all
POST   /resource              // Create
GET    /resource/:id          // Get one
PUT    /resource/:id          // Update
DELETE /resource/:id          // Delete
```

### Pattern 3: Nested Resources
```javascript
GET    /doctors/:id/reviews   // Get doctor's reviews
POST   /doctors/:id/reviews   // Add review
```

### Pattern 4: Actions
```javascript
POST   /appointments/:id/reschedule  // Custom action
PATCH  /appointments/:id/status      // Update status
POST   /health/articles/:id/save     // Save article
```

---

## 🔐 Authentication Quick Reference

### Protected Route
```javascript
router.get('/profile', protect, getProfile);
```

### Check in Controller
```javascript
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;  // Available from protect middleware
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
```

### Get Token from Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "Password@123"
  }'

# Token in response.accessToken
```

### Use Token
```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

## 🗄️ Common Prisma Queries

### Create
```javascript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    fullName: 'John Doe',
    passwordHash: hashedPassword
  }
});
```

### Read
```javascript
// Single
const user = await prisma.user.findUnique({
  where: { id: 1 }
});

// Multiple
const users = await prisma.user.findMany({
  where: { city: 'Mumbai' },
  take: 10,
  skip: 0
});
```

### Update
```javascript
const user = await prisma.user.update({
  where: { id: 1 },
  data: { phone: '1234567890' }
});
```

### Delete
```javascript
const user = await prisma.user.delete({
  where: { id: 1 }
});
```

### With Relations
```javascript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    healthProfile: true,
    appointments: true,
    doctorProfile: true
  }
});
```

---

## 🧪 Testing Endpoints

### Step 1: Get Token
```bash
# Save as TOKEN variable
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"Password@123"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

echo $TOKEN
```

### Step 2: Test Protected Endpoint
```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Step 3: Test Post with Data
```bash
curl -X POST http://localhost:5000/api/v1/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doctorId":2,"appointmentDate":"2025-01-15T10:00:00Z","consultationType":"online","symptoms":"Fever"}'
```

---

## ❌ Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| ECONNREFUSED 5432 | Database not running | `docker-compose up -d` |
| EADDRINUSE 5000 | Port in use | Change PORT in .env or kill process |
| 401 Unauthorized | Missing/invalid token | Add `Authorization: Bearer TOKEN` header |
| 403 Forbidden | Not authorized | Check user role/permissions |
| 404 Not Found | Resource missing | Check if ID exists and route is correct |
| 400 Bad Request | Invalid data | Validate request body format |
| 500 Internal Error | Server error | Check backend logs: `docker-compose logs backend` |

---

## 📝 Adding New Endpoint

### Step 1: Update Prisma Schema
```prisma
model NewModel {
  id    Int     @id @default(autoincrement())
  name  String
  userId Int
  user  User    @relation(fields: [userId], references: [id])
}
```

### Step 2: Create Migration
```bash
npx prisma migrate dev --name add_new_model
```

### Step 3: Create Controller
```javascript
// controllers/new.controller.js
export const getAll = async (req, res, next) => {
  try {
    const data = await prisma.newModel.findMany();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
```

### Step 4: Create Routes
```javascript
// routes/new.routes.js
import express from 'express';
import { getAll } from '../controllers/new.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, getAll);
export default router;
```

### Step 5: Register Routes
```javascript
// app.js
import newRoutes from './routes/new.routes.js';
app.use('/api/v1/new', newRoutes);
```

---

## 🔍 Debugging

### Enable Logging
```javascript
// .env
DATABASE_URL="postgresql://...?log=query"
```

### Open Prisma Studio
```bash
npx prisma studio
# Opens http://localhost:5555
```

### Check Logs
```bash
docker-compose logs -f backend --tail=100
```

### Database Connection Test
```bash
psql postgresql://swasth:swasth123@localhost:5432/swasthai
```

---

## 🏗️ API Response Structure

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "statusCode": 400
}
```

### List with Pagination
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

---

## 🔐 Test Credentials

```
Patient:
  Email: patient@example.com
  Password: Password@123

Doctor 1 (General Physician):
  Email: doctor1@example.com
  Password: Password@123

Doctor 2 (Cardiologist):
  Email: doctor2@example.com
  Password: Password@123

Doctor 3 (Dermatologist):
  Email: doctor3@example.com
  Password: Password@123
```

---

## 📊 Database Models Overview

| Model | Purpose | Key Fields |
|-------|---------|-----------|
| User | User accounts | id, email, password, role |
| HealthProfile | Health data | bmi, bloodGroup, allergies |
| Doctor | Doctor profiles | specialty, consultationFee, rating |
| Appointment | Booking system | doctorId, date, status |
| Medicine | Pharmacy | name, price, stock |
| LabTest | Lab services | name, price, turnaroundTime |
| HealthRecord | Medical files | type, fileUrl, metadata |
| ForumPost | Community posts | title, content, upvotes |
| HealthArticle | Educational content | title, content, category |
| Notification | User notifications | type, message, read |

---

## 🚀 Deployment Checklist

- [ ] Change JWT_SECRET in production
- [ ] Change DATABASE_URL to production database
- [ ] Update CORS_ORIGIN with production domains
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure Redis for caching
- [ ] Set up error monitoring (Sentry)
- [ ] Configure file upload service (AWS S3)
- [ ] Set up email service (SendGrid)
- [ ] Set up logging/monitoring
- [ ] Run security audit: `npm audit`
- [ ] Test all critical flows
- [ ] Backup database before deployment

---

## 📞 Quick Contacts

- **Backend Issues**: Check `docker-compose logs -f backend`
- **Database Issues**: Check `docker-compose logs -f postgres`
- **API Documentation**: See API_TESTING_GUIDE.md
- **Setup Issues**: See BACKEND_COMPLETE_SETUP_GUIDE.md

---

**Last Updated**: December 30, 2024

