# ✅ SwasthAI - Getting Started Checklist

**Complete your setup in 5 steps!**

---

## 📋 Pre-Flight Checklist

Before you start, make sure you have:

- [ ] **Docker & Docker Compose** installed
  ```bash
  docker --version
  docker-compose --version
  ```

- [ ] **Node.js 18+** installed (for local development)
  ```bash
  node --version
  npm --version
  ```

- [ ] **Git** installed for version control
  ```bash
  git --version
  ```

- [ ] **At least 4GB RAM** available
- [ ] **Free ports**: 5000 (backend), 5173 (frontend), 5432 (database), 5050 (pgAdmin)

---

## 🚀 Step 1: Prepare Environment (2 minutes)

### 1.1 Navigate to Project
```bash
cd /path/to/SwasthAI
```

### 1.2 Create Backend Environment File
Create `backend/.env` with:

```env
# Database
DATABASE_URL="postgresql://swasth:swasth123@postgres:5432/swasthai"

# Redis
REDIS_URL="redis://redis:6379"

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
JWT_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Server
NODE_ENV="development"
PORT=5000
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
```

### 1.3 Create Frontend Environment File
Create `frontend/.env.local` with:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 🐳 Step 2: Start Services (1 minute)

### 2.1 Start Docker Services
```bash
# From project root
docker-compose up -d
```

### 2.2 Verify Services Running
```bash
# Check all services
docker-compose ps

# Expected output:
# NAME                 STATUS
# postgres            Up 30 seconds
# redis              Up 30 seconds
# pgadmin            Up 30 seconds
```

### 2.3 Wait for Database Ready
```bash
# Wait 30 seconds for database to be fully initialized
sleep 30

# Or manually check
docker-compose logs postgres | grep "database system is ready"
```

---

## 🔧 Step 3: Initialize Backend (1.5 minutes)

### 3.1 Install Dependencies
```bash
cd backend
npm install --legacy-peer-deps
```

### 3.2 Generate Prisma Client
```bash
npx prisma generate
```

### 3.3 Run Migrations
```bash
# This creates the database schema
npx prisma migrate dev --name init
```

### 3.4 Seed Database with Test Data
```bash
# This populates the database with sample data
npm run seed
```

Expected output:
```
🌱 Starting database seeding...
🗑️  Clearing existing data...
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

---

## ▶️ Step 4: Start Services (1 minute)

### 4.1 Start Backend Server
```bash
# From backend directory
npm run dev

# Expected output:
# ✓ Server is running on http://localhost:5000
# ✓ Health check: http://localhost:5000/health
```

### 4.2 Verify Backend is Running
```bash
# Open a new terminal
curl http://localhost:5000/health

# Expected response:
# {"status":"OK","timestamp":"...","uptime":...}
```

### 4.3 Start Frontend Server
```bash
# In another terminal, from project root
cd frontend
npm install
npm run dev

# Expected output:
# ✓ ready in 1234 ms.
# ➜  Local:   http://localhost:5173/
```

---

## 🎯 Step 5: Verify Everything Works (1 minute)

### 5.1 Access Frontend
- Open http://localhost:5173 in your browser
- You should see the SwasthAI homepage

### 5.2 Test Login
```bash
# Click "Login" on the page
# Use these credentials:
Email:    patient@example.com
Password: Password@123
```

### 5.3 Verify Database
```bash
# Open pgAdmin
# URL: http://localhost:5050
# Email: admin@example.com
# Password: admin

# Then connect to PostgreSQL:
# Host: postgres
# Port: 5432
# Username: swasth
# Password: swasth123
# Database: swasthai
```

### 5.4 Test API Endpoint
```bash
# Login and get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "Password@123"
  }' | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# Get user profile
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Expected response includes your user profile
```

---

## ✅ Success Checklist

- [ ] Docker services running (`docker-compose ps` shows all green)
- [ ] Backend initialized and running on port 5000
- [ ] Frontend running on port 5173
- [ ] Database created and seeded with data
- [ ] Can access http://localhost:5173
- [ ] Can login with patient@example.com / Password@123
- [ ] Can see doctor list on frontend
- [ ] Can access API health check (http://localhost:5000/health)

---

## 📝 Key Credentials

### Patient Account
```
Email:    patient@example.com
Password: Password@123
```

### Doctor Accounts
```
Email:    doctor1@example.com (General Physician)
Email:    doctor2@example.com (Cardiologist)
Email:    doctor3@example.com (Dermatologist)
Password: Password@123 (all)
```

### pgAdmin (Database Management)
```
URL:      http://localhost:5050
Email:    admin@example.com
Password: admin
```

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main application |
| Backend API | http://localhost:5000/api/v1 | API endpoints |
| Health Check | http://localhost:5000/health | Backend status |
| pgAdmin | http://localhost:5050 | Database management |
| Prisma Studio | (run `npx prisma studio`) | Database browser |

---

## 🧪 Quick Testing

### Test API Endpoint (with cURL)
```bash
# Get doctors list
curl http://localhost:5000/api/v1/doctors

# Should return:
# {
#   "success": true,
#   "data": [
#     {
#       "id": 2,
#       "fullName": "Dr. Rajesh Kumar",
#       "specialty": "General Physician",
#       ...
#     },
#     ...
#   ]
# }
```

### Test Protected Endpoint (with Authentication)
```bash
# 1. Login and get token
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "Password@123"
  }'

# Copy the "accessToken" from response

# 2. Use token to access protected endpoint
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Should return your user profile
```

See [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) for complete testing examples.

---

## 🐛 Troubleshooting

### Issue: Port 5000 Already in Use
```bash
# Find what's using the port
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### Issue: Database Connection Failed
```bash
# Check if containers are running
docker-compose ps

# If not, restart
docker-compose restart

# Check database logs
docker-compose logs postgres

# Wait a minute and retry
```

### Issue: "Cannot find module" Errors
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install --legacy-peer-deps

# Regenerate Prisma
npx prisma generate
```

### Issue: Migration Failed
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or manually:
docker-compose down -v  # Removes all volumes
docker-compose up -d    # Recreates containers
npm run seed            # Reseed data
```

### Issue: API Returning 401 Unauthorized
```bash
# Make sure you're using a valid token
# 1. Login first
# 2. Copy the accessToken
# 3. Use in Authorization header: Bearer TOKEN
# 4. Check token is not expired (15 min expiry)
```

See [BACKEND_COMPLETE_SETUP_GUIDE.md](./BACKEND_COMPLETE_SETUP_GUIDE.md) for more troubleshooting.

---

## 📚 Next Steps

### Explore the Features
1. **Login** with patient account
2. **Search doctors** - Use filters (specialty, city)
3. **View doctor profiles** - See detailed info
4. **Book appointment** - Select doctor and time
5. **Browse medicines** - Add to order
6. **View health articles** - Save for later
7. **Join forum** - Create posts and comments
8. **Manage appointments** - Reschedule or cancel

### Understand the Code
1. Read [DEVELOPER_QUICK_REFERENCE.md](./DEVELOPER_QUICK_REFERENCE.md)
2. Check backend structure: `backend/src/`
3. Explore controllers: `backend/src/controllers/`
4. Review routes: `backend/src/routes/`
5. Check database schema: `backend/prisma/schema.prisma`

### Test the APIs
1. Read [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)
2. Test endpoints with cURL
3. Use Postman for organized testing
4. Check response formats

### Set Up Development
1. Install code formatter: `npm install --save-dev prettier`
2. Install linter: `npm install --save-dev eslint`
3. Configure Git hooks with husky
4. Set up VS Code extensions

---

## 📊 Project Overview

```
✅ Frontend:    Complete (29 pages)
✅ Backend:     Complete (50+ endpoints)
✅ Database:    Complete (18+ models)
✅ Auth:        Complete (JWT + bcryptjs)
✅ API:         Complete (Fully tested)
✅ Docs:        Complete (4 guides)

Status: PRODUCTION READY 🚀
```

---

## 🎓 Learning Resources

### Backend Development
- [Express.js Documentation](https://expressjs.com)
- [Prisma ORM Guide](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

### Frontend Development
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [React Query Guide](https://tanstack.com/query/latest)

### DevOps
- [Docker Guide](https://docs.docker.com)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file)
- [PostgreSQL in Docker](https://hub.docker.com/_/postgres)

---

## 🔐 Security Reminders

**IMPORTANT**: Before deploying to production:

- [ ] Change `JWT_SECRET` in `.env`
- [ ] Change `JWT_REFRESH_SECRET` in `.env`
- [ ] Change `POSTGRES` password in `docker-compose.yml`
- [ ] Change `pgAdmin` password in `docker-compose.yml`
- [ ] Enable HTTPS for production
- [ ] Update `CORS_ORIGIN` for your domain
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper database backups
- [ ] Enable database encryption
- [ ] Set up monitoring and logging
- [ ] Run `npm audit` and fix vulnerabilities

---

## ⏱️ Time Estimates

| Step | Time | Status |
|------|------|--------|
| Step 1: Prepare | 2 min | ✅ Quick |
| Step 2: Docker | 1 min | ✅ Quick |
| Step 3: Backend | 1.5 min | ✅ Quick |
| Step 4: Start | 1 min | ✅ Quick |
| Step 5: Verify | 1 min | ✅ Quick |
| **Total** | **5 min** | **✅ Done!** |

---

## 🆘 Getting Help

### Documentation
1. **Setup Issues** → [BACKEND_COMPLETE_SETUP_GUIDE.md](./BACKEND_COMPLETE_SETUP_GUIDE.md)
2. **API Questions** → [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)
3. **Development Help** → [DEVELOPER_QUICK_REFERENCE.md](./DEVELOPER_QUICK_REFERENCE.md)
4. **Project Overview** → [PROJECT_COMPLETION_SUMMARY.md](./PROJECT_COMPLETION_SUMMARY.md)

### Docker Issues
```bash
# View logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs postgres

# Restart services
docker-compose restart

# Full reset (⚠️ deletes data)
docker-compose down -v
docker-compose up -d
```

### Backend Issues
```bash
# Check status
npm run dev

# Check logs
docker-compose logs -f backend

# Database issues
npx prisma studio  # Opens database browser
```

---

## 🎉 You're All Set!

```
✅ Setup Complete!
✅ Services Running!
✅ Database Seeded!
✅ Ready to Code!

Next: Open http://localhost:5173
Login: patient@example.com / Password@123
Enjoy! 🚀
```

---

**Last Updated**: December 30, 2024  
**Status**: Ready to Use ✅  
**Time to Setup**: 5 Minutes ⏱️  

