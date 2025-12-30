# SwasthAI Backend Implementation - Step-by-Step Guide

## Overview

You have a **fully designed** backend with:
- ✅ Prisma database schema (complete)
- ✅ Docker compose setup (complete)
- ✅ Auth middleware and routes (complete)
- ✅ Seed data script (complete)
- ✅ Environment configuration (complete)

Now let's implement it in **4 simple steps**.

---

## Step 1: Set Up Environment & Install Dependencies (5 min)

### 1.1 Create .env file

```bash
cd backend
cp .env.example .env.local
```

### 1.2 Update .env.local (Optional)

For local development, defaults work fine. But update if using different ports:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://swasthai_user:swasthai_password_secure@localhost:5432/swasthai_db"
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 1.3 Install Dependencies

```bash
npm install --legacy-peer-deps
```

---

## Step 2: Set Up Database (10 min)

### Option A: Using Docker (Easiest - Recommended)

```bash
# From project root, NOT backend folder
docker-compose up -d
```

This starts:
- PostgreSQL on localhost:5432
- Redis on localhost:6379
- Frontend on localhost:5173

**Wait 30 seconds for services to start**, then continue.

### Option B: Using Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create database
createdb swasthai_db

# Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://swasthai_user:swasthai_password_secure@localhost:5432/swasthai_db"
```

### 2.1 Run Database Migrations

```bash
cd backend  # Make sure you're in backend folder

# Generate Prisma client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate dev --name init
```

You'll see:
```
✔ Created migration in ./prisma/migrations/...
✔ Generated Prisma Client

Environment variables loaded from .env.local
Prisma schema loaded from prisma/schema.prisma

✔ Database connection successful

✔ Migrations applied successfully
```

### 2.2 Seed Database with Sample Data

```bash
node src/scripts/seed.js
```

You'll see:
```
🌱 Seeding database...
✅ Created users and doctors
✅ Created medicines
✅ Created lab tests
✅ Created articles
✅ Created forum posts
✅ Created sample appointment
✅ Created notifications
🌱 Database seeding completed successfully!

📝 Test Credentials:
  Patient:
    Email: patient@example.com
    Password: Password@123
  Doctor:
    Email: doctor1@example.com
    Password: Password@123
```

### 2.3 Verify Database (Optional)

```bash
# Open Prisma Studio GUI
npx prisma studio
```

Opens database viewer at http://localhost:5555. You can see all tables and data.

---

## Step 3: Start the Backend Server (2 min)

### 3.1 Development Mode (with Hot Reload)

```bash
npm run dev
```

You'll see:
```
🚀 SwasthAI Backend running on port 5000
📚 API Documentation: http://localhost:5000/api/v1
🏥 Health Check: http://localhost:5000/health
```

### 3.2 Test Health Check

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-12-30T10:30:00.000Z",
  "uptime": "0m 5s",
  "environment": "development",
  "database": "connected"
}
```

✅ **Backend is running!**

---

## Step 4: Connect Frontend to Backend (10 min)

### 4.1 Update Frontend API Configuration

Navigate to: `/api/base44Client.js`

Replace the configuration with:

```javascript
// Use real backend instead of mock API
const API_BASE_URL = 'http://localhost:5000/api/v1';

export const apiClient = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(data) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Users
  async getUser(token) {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // Doctors
  async getDoctors(filters) {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/doctors?${params}`);
    return res.json();
  },

  async getDoctor(id) {
    const res = await fetch(`${API_BASE_URL}/doctors/${id}`);
    return res.json();
  },

  // Appointments
  async bookAppointment(data, token) {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAppointments(token) {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // Add more endpoints as needed...
};
```

### 4.2 Update Frontend Environment

Create or update `.env.local` in frontend folder:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_NODE_ENV=development
```

### 4.3 Test Frontend + Backend Integration

1. **Make sure both are running:**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev

   # Terminal 2: Frontend
   cd ..
   npm run dev
   ```

2. **Open frontend:** http://localhost:5173

3. **Test Login:**
   - Email: `patient@example.com`
   - Password: `Password@123`

4. **Check browser console** for any errors

---

## Testing API Endpoints

### Using cURL

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"Password@123"}' \
  | jq -r '.data.accessToken')

# 2. Get current user
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/v1/users/me

# 3. Get doctors
curl http://localhost:5000/api/v1/doctors

# 4. Book appointment
curl -X POST http://localhost:5000/api/v1/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": 1,
    "appointmentDate": "2025-12-31T10:00:00Z",
    "consultationType": "online",
    "reason": "General checkup"
  }'
```

### Using Postman

1. Create a new collection
2. Set `{{baseUrl}}` to `http://localhost:5000/api/v1`
3. Create requests for each endpoint
4. Use tests to set token: `pm.environment.set("token", pm.response.json().data.accessToken)`

---

## Key Files Overview

```
backend/
├── .env.local                 # Environment variables
├── .env.example              # Example environment template
├── package.json              # Dependencies
├── src/
│   ├── app.js               # Main Express server
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   ├── errorHandler.js  # Error handling
│   │   └── logger.js        # Logging
│   ├── routes/
│   │   ├── auth.routes.js       # Authentication endpoints
│   │   ├── users.routes.js      # User endpoints
│   │   ├── doctors.routes.js    # Doctor endpoints
│   │   ├── appointments.routes.js # Appointment endpoints
│   │   ├── medicines.routes.js  # Medicine endpoints
│   │   ├── labs.routes.js       # Lab endpoints
│   │   ├── forum.routes.js      # Forum endpoints
│   │   ├── articles.routes.js   # Articles endpoints
│   │   ├── notifications.routes.js # Notifications
│   │   └── health.routes.js     # Health records
│   └── scripts/
│       └── seed.js          # Database seeding script
└── prisma/
    ├── schema.prisma        # Database schema
    └── migrations/          # Database migrations
```

---

## Common Issues & Solutions

### Issue: "DATABASE_URL not set"
**Solution:** Make sure you have `.env.local` in the backend folder with DATABASE_URL set.

### Issue: "PostgreSQL connection refused"
**Solution:** 
```bash
# Start Docker containers
docker-compose up -d

# Wait 30 seconds for PostgreSQL to start
docker ps | grep postgres
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### Issue: "Prisma client not found"
**Solution:**
```bash
npx prisma generate
npm install @prisma/client
```

---

## Next Steps

After getting backend running:

1. ✅ Backend running with database
2. ✅ Frontend connecting to real API
3. ⏭️ **Implement remaining API endpoints** (if any)
4. ⏭️ **Add payment integration** (Stripe)
5. ⏭️ **Add file uploads** (S3/MinIO)
6. ⏭️ **Add email notifications**
7. ⏭️ **Add LLM integration** (ChatGPT)
8. ⏭️ **Deploy to production**

---

## Quick Verification Checklist

- [ ] Database migrations completed
- [ ] Database seeded with sample data
- [ ] Backend server running (npm run dev)
- [ ] Health check returning OK
- [ ] Can login with patient@example.com
- [ ] Frontend connecting to backend API
- [ ] No CORS errors in browser console

✅ **If all checked, you're ready to start building features!**

---

**Need help?** Check individual route files for endpoint specifications.
