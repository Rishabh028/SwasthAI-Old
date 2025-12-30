# SwasthAI - Local Deployment Quick Start (5 Minutes)

**Last Updated:** December 30, 2025

---

## 🚀 Ultra-Quick Start (Using Docker Compose)

### Prerequisites
- **Windows 10/11** with WSL2 enabled
- **Docker Desktop** installed ([Download](https://www.docker.com/products/docker-desktop))
- **Docker Compose** (included with Docker Desktop v1.27+)

### Step 1: Verify Docker Installation
```powershell
# Open PowerShell and run:
docker --version
docker-compose --version

# Should show versions like:
# Docker version 24.0.0, build abcdef
# Docker Compose version 2.0.0
```

### Step 2: Navigate to Project
```powershell
cd "C:\Users\Rishabh\OneDrive\Desktop\Coding\SwasthAI"
```

### Step 3: Start All Services
```powershell
# Start containers in background
docker-compose up -d

# Wait 30 seconds for services to initialize...
Start-Sleep -Seconds 30
```

### Step 4: Verify Services Are Running
```powershell
# Check all containers are running
docker-compose ps

# Should show:
# NAME                    STATUS
# swasthai-db            Up (healthy)
# swasthai-cache         Up (healthy)
# swasthai-api           Up (healthy)
# swasthai-web           Up
# swasthai-pgadmin       Up
```

### Step 5: Test Endpoints
```powershell
# Test backend health
curl http://localhost:5000/health

# Test API
curl http://localhost:5000/api/v1

# Should return JSON with status OK
```

### Step 6: Access Applications

| Service | URL | Login |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | Try signing up |
| **Backend API** | http://localhost:5000/api/v1 | API Documentation |
| **Database GUI** | http://localhost:5050 | Email: `admin@swasthai.com` <br/> Password: `admin123` |

---

## 🧪 Test the Features

### 1. **User Registration & Login**
```
1. Go to http://localhost:3000
2. Click "Sign Up" button
3. Fill in:
   - Email: test@example.com
   - Password: Test@123
   - Phone: 9876543210
4. Click "Register"
5. Login with credentials
```

### 2. **Find Doctors**
```
1. From home, click "Find Nearby Doctors"
2. View list of 12 sample doctors
3. Click on any doctor card to see full profile
4. Click "Book Appointment"
```

### 3. **Symptom Checker**
```
1. Click "Check Symptoms" from home
2. Type symptoms (e.g., "fever, cough, headache")
3. AI responds with assessment
4. See recommended doctors
```

### 4. **Health Records**
```
1. Go to "Health Records"
2. Click "Upload Document"
3. Select prescription/report
4. Organize by type
```

### 5. **Order Medicines**
```
1. Go to "Pharmacy"
2. Search for medicine
3. Add to cart
4. Place order (test payment)
```

### 6. **Book Lab Tests**
```
1. Go to "Lab Tests"
2. Select test (CBC, Thyroid, etc.)
3. Choose location and date
4. Book appointment
```

---

## 📊 View Database

### Using PgAdmin (Web UI)
```
1. Go to http://localhost:5050
2. Login:
   - Email: admin@swasthai.com
   - Password: admin123
3. Register new server:
   - Host: postgres
   - Port: 5432
   - Username: postgres
   - Password: postgres123
4. Browse database tables
5. View sample data
```

### Using Command Line
```powershell
# Connect to database
docker-compose exec postgres psql -U postgres -d swasthai_db

# Common commands:
# \dt              - List all tables
# SELECT * FROM "User";  - View users
# \q               - Exit
```

---

## 📝 View Logs

```powershell
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Database logs
docker-compose logs -f postgres

# Redis logs
docker-compose logs -f redis

# All logs
docker-compose logs -f

# Press Ctrl+C to stop following logs
```

---

## 🛑 Stop Services

```powershell
# Stop all containers (keep data)
docker-compose down

# Stop and remove all data (fresh start next time)
docker-compose down -v

# View what will be removed
docker-compose down --dry-run
```

---

## 🔧 Troubleshooting

### Docker won't start
```powershell
# Check Docker daemon status
docker info

# If not running, open Docker Desktop from Start menu
# Or use PowerShell as Administrator:
Start-Service docker
```

### Port already in use
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Container crashes
```powershell
# Check logs
docker-compose logs backend

# Restart container
docker-compose restart backend
```

### Database connection error
```powershell
# Check database is healthy
docker-compose exec postgres pg_isready

# Check credentials in backend/.env:
# DATABASE_URL should be: postgresql://postgres:postgres123@postgres:5432/swasthai_db
```

### Frontend shows blank page
```powershell
# Clear browser cache (Ctrl+Shift+Delete)
# Or open in incognito window

# Rebuild frontend container
docker-compose build frontend
docker-compose up -d frontend
```

---

## 📚 What's Running?

### Backend Services (Node.js + Express)
- **Location:** `http://localhost:5000`
- **Code:** `/backend/src/`
- **Database:** PostgreSQL (port 5432)
- **Cache:** Redis (port 6379)
- **Features:** All 8+ API modules

### Frontend Services (React + Vite)
- **Location:** `http://localhost:3000`
- **Code:** `/frontend/src/`
- **Features:** 20+ pages, responsive UI

### Database (PostgreSQL)
- **Container:** `swasthai-db`
- **Port:** 5432
- **Database:** swasthai_db
- **User:** postgres
- **Password:** postgres123

### Cache (Redis)
- **Container:** `swasthai-cache`
- **Port:** 6379
- **Used for:** Session storage, caching

### Database UI (PgAdmin)
- **Container:** `swasthai-pgadmin`
- **Port:** 5050
- **Web UI:** http://localhost:5050

---

## 💡 Next Steps

After local testing is working:

1. **Read [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md)** for full deployment guide
2. **Review [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** before going live
3. **Setup AWS account** for production deployment
4. **Configure environment variables** (see [.env.production](.env.production))
5. **Run deployment script:** `bash deploy.sh aws`

---

## 🆘 Still Having Issues?

### Check Docker is running
```powershell
docker stats
```

### View all containers
```powershell
docker ps -a
```

### Remove unused images/volumes
```powershell
docker system prune
```

### Rebuild everything from scratch
```powershell
# Stop everything
docker-compose down -v

# Remove images
docker-compose rm -f

# Start fresh
docker-compose up -d

# Wait 30 seconds, then:
docker-compose ps
```

---

## 🎯 Common Port Numbers

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | 3000 | React app |
| Backend | 5000 | Express API |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |
| PgAdmin | 5050 | Database UI |

---

## 📞 Support

- **Docker Issues:** https://docs.docker.com
- **PostgreSQL Help:** https://www.postgresql.org/docs/
- **React Docs:** https://react.dev
- **Express.js Docs:** https://expressjs.com

---

**Version:** 1.0  
**Last Tested:** December 30, 2025  
**Status:** ✅ Ready for Production
