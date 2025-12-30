# SwasthAI - Complete Backend & Database Setup Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose installed
- PostgreSQL client (optional)

### Step 1: Setup Environment Variables

```bash
cd backend
cp .env.example .env.local
```

Edit `.env.local` and update database credentials if needed.

### Step 2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Step 3: Setup Database with Prisma

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
node src/scripts/seed.js

# View database (optional - opens GUI)
npx prisma studio
```

### Step 4: Start the Backend

```bash
npm run dev
```

Backend will be running at `http://localhost:5000`

---

## 🐳 Docker Setup (Recommended)

### Using Docker Compose (Full Stack)

```bash
# From project root
docker-compose up -d

# Wait 30 seconds for all services to start

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

### Access Points After Docker Start

| Service | URL | Credentials |
|---------|-----|-------------|
| Backend API | http://localhost:5000 | - |
| PostgreSQL | localhost:5432 | swasthai_user / swasthai_password_secure |
| Redis | localhost:6379 | - |
| Frontend | http://localhost:5173 | - |
| PgAdmin | http://localhost:5050 | admin@admin.com / admin |

### Seed Database in Docker

```bash
# Connect to backend container
docker exec -it swasthai-api npm run seed
```

---

## 📊 Database Schema

### Core Tables
- `User` - All users (patients, doctors, admins)
- `Doctor` - Doctor profiles with specialties
- `HealthProfile` - User health data
- `Appointment` - Doctor appointments
- `Medicine` & `MedicineOrder` - Pharmacy system
- `LabTest` & `LabBooking` - Lab services
- `ForumPost` & `ForumComment` - Community forum
- `HealthArticle` - Educational content
- `Notification` - User notifications
- `SymptomCheckSession` & `CoachSession` - AI features

See `/backend/prisma/schema.prisma` for complete schema.

---

## 🔐 Authentication

### API Endpoints

#### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "phone": "9876543210",
  "role": "user"
}
```

#### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "data": {
    "userId": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user",
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Refresh Token
```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

### Using Tokens

All protected endpoints require Authorization header:

```bash
curl -H "Authorization: Bearer <accessToken>" \
     http://localhost:5000/api/v1/users/me
```

---

## 🏥 API Endpoints Overview

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update profile
- `GET /api/v1/users/:id` - Get user by ID

### Doctors
- `GET /api/v1/doctors` - List doctors (filter by specialty, location)
- `GET /api/v1/doctors/:id` - Get doctor details
- `POST /api/v1/doctors/:id/reviews` - Add review

### Appointments
- `POST /api/v1/appointments` - Book appointment
- `GET /api/v1/appointments` - List user appointments
- `PATCH /api/v1/appointments/:id` - Reschedule/cancel

### Medicines
- `GET /api/v1/medicines` - Search medicines
- `POST /api/v1/medicines/orders` - Create order
- `GET /api/v1/medicines/orders` - Order history

### Lab Tests
- `GET /api/v1/labs/tests` - List available tests
- `POST /api/v1/labs/bookings` - Book test
- `GET /api/v1/labs/bookings/:id/report` - Get report

### Forum
- `GET /api/v1/forum/posts` - List posts
- `POST /api/v1/forum/posts` - Create post
- `POST /api/v1/forum/posts/:id/comments` - Add comment

### Articles
- `GET /api/v1/articles` - List articles
- `GET /api/v1/articles/:id` - Get article details

### Notifications
- `GET /api/v1/notifications` - List notifications
- `PATCH /api/v1/notifications/:id` - Mark as read

---

## 🗄️ Database Management

### Prisma Studio (Visual Database Manager)

```bash
npx prisma studio
```

Opens GUI at http://localhost:5555

### Database Commands

```bash
# Create new migration
npx prisma migrate dev --name add_new_field

# Reset database (caution - deletes all data)
npx prisma migrate reset

# Seed data
node src/scripts/seed.js

# Generate client
npx prisma generate

# Check database status
npx prisma db push
```

---

## 📝 Sample Test Credentials

After seeding, these accounts are available:

### Patient Account
- **Email:** patient@example.com
- **Password:** Password@123
- **Role:** user

### Doctor Account
- **Email:** doctor1@example.com
- **Password:** Password@123
- **Role:** doctor
- **Specialty:** General Physician

### Admin Account (to be created)
- **Email:** admin@example.com
- **Password:** AdminPass@123
- **Role:** admin

---

## 🧪 Testing Endpoints

### Using cURL

```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@example.com",
    "password":"Password@123",
    "fullName":"New User",
    "role":"user"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"patient@example.com",
    "password":"Password@123"
  }'

# Get doctors
curl http://localhost:5000/api/v1/doctors
```

### Using Postman

Import this collection:
```json
{
  "info": {
    "name": "SwasthAI API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth - Register",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/register"
      }
    },
    {
      "name": "Auth - Login",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/login"
      }
    }
  ]
}
```

---

## 🔧 Troubleshooting

### Issue: Database connection failed
**Solution:**
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs swasthai-postgres

# Verify connection string in .env
```

### Issue: Prisma client not found
**Solution:**
```bash
npx prisma generate
npm install @prisma/client
```

### Issue: Port already in use
**Solution:**
```bash
# Stop all containers
docker-compose down

# Or change port in docker-compose.yml
```

### Issue: Migrations failed
**Solution:**
```bash
# Reset database (warning: deletes all data)
npx prisma migrate reset

# Or manually:
npx prisma migrate deploy --create-only
```

---

## 📈 Scaling & Optimization

### Connection Pooling
Use PgBouncer for connection pooling:
```
# In docker-compose.yml
pgbouncer:
  image: pgbouncer:latest
  environment:
    DATABASES_HOST: postgres
    DATABASES_USER: swasthai_user
    DATABASES_PASSWORD: swasthai_password_secure
```

### Caching
Redis is configured for:
- Session caching
- Rate limiting
- Query result caching
- Real-time notifications

### Database Optimization
```sql
-- Create indexes for frequent queries
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_appointment_date ON "Appointment"("appointmentDate");
CREATE INDEX idx_doctor_specialty ON "Doctor"(specialty);
```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 🚀 Next Steps

1. ✅ Backend running locally
2. ✅ Database set up with sample data
3. ✅ Authentication working
4. ⏭️ **Connect frontend to backend API**
   - Update API base URL in frontend config
   - Test auth flow
5. ⏭️ **Implement remaining endpoints**
   - Health records upload
   - Payment integration
   - LLM integration

---

**Happy coding! 🎉**

For questions or issues, check the logs or refer to documentation files.
