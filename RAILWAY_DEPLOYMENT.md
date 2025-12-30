# Railway Deployment - Complete Setup Guide

**Recommended Platform for SwasthAI** ⭐⭐

---

## Why Railway?

- ✅ Full-stack support (Frontend + Backend + Database)
- ✅ PostgreSQL & Redis built-in
- ✅ Starting at just $5/month
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ✅ Environment variables managed easily
- ✅ Docker support
- ✅ Perfect for your architecture

---

## 🚀 10-Minute Quick Start

### Step 1: Push Code to GitHub (2 minutes)

```bash
cd C:\Users\Rishabh\OneDrive\Desktop\Coding\SwasthAI

# Make sure git is initialized
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Railway deployment"

# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/SwasthAI.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Create Railway Account (2 minutes)

1. Go to https://railway.app
2. Click "Start Project"
3. Click "Deploy from GitHub repo"
4. Sign in with GitHub account
5. Authorize Railway

### Step 3: Create New Project (3 minutes)

1. In Railway Dashboard, click "Create New Project"
2. Click "Deploy from GitHub repo"
3. Select "SwasthAI" repository
4. Click "Deploy Now"

### Step 4: Add Services (3 minutes)

#### A. Add PostgreSQL Database

```
1. In Railway Project, click "Add Service"
2. Search for "PostgreSQL"
3. Click to add
4. Railway auto-creates DATABASE_URL ✅
```

#### B. Add Redis Cache

```
1. Click "Add Service"
2. Search for "Redis"
3. Click to add
4. Railway auto-creates REDIS_URL ✅
```

#### C. Configure Backend Service

```
1. Click existing service from GitHub repo
2. Go to "Settings"
3. Set these variables:
   - Root Directory: backend
   - Start Command: npm start
   - Build Command: npm install
4. Go to "Variables"
5. Add environment variables (see below)
6. Deploy ✅
```

#### D. Configure Frontend Service

```
1. Add another service from GitHub repo
2. Go to "Settings"
3. Set these variables:
   - Root Directory: frontend
   - Build Command: npm run build
   - Start Command: npm run preview
4. Go to "Variables"
5. Add: VITE_API_BASE_URL={backend_url}/api/v1
6. Deploy ✅
```

---

## 🔐 Environment Variables Setup

### For Backend Service

In Railway Dashboard → Your Project → Backend Service → Variables

Add these one by one:

```
NODE_ENV                = production
PORT                    = 5000
API_BASE_URL           = https://your-backend-url.railway.app
DATABASE_URL           = ${{Postgres.DATABASE_URL}}
REDIS_URL              = ${{Redis.REDIS_URL}}
JWT_SECRET             = generate-a-long-random-string-here-min-32-chars
REFRESH_TOKEN_SECRET   = generate-another-long-random-string-here
CORS_ORIGIN            = https://your-frontend-url.railway.app,https://yourdomain.com
```

**To generate secure secrets:**
```bash
# Open Terminal and run:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the output and paste into JWT_SECRET
# Run again for REFRESH_TOKEN_SECRET
```

### For Frontend Service

In Railway Dashboard → Your Project → Frontend Service → Variables

Add these:

```
VITE_API_BASE_URL = https://your-backend-railway-url/api/v1
VITE_API_URL      = https://your-backend-railway-url
```

---

## ✅ Verify Deployment

### Check Backend

```bash
# Get your backend URL from Railway Dashboard
curl https://your-backend-url.railway.app/health

# Should return:
# {"status":"OK","timestamp":"...","uptime":...}
```

### Check Frontend

```bash
# Visit in browser:
https://your-frontend-url.railway.app

# Should show the SwasthAI home page
```

### Check Database Connection

```bash
# In Railway Dashboard:
1. Go to PostgreSQL service
2. Click "Data"
3. Should show database tables ✅
```

---

## 🔧 Running Database Migrations

### Option A: Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run npm run migrate
```

### Option B: Via Django/Terminal

```bash
# SSH into backend service
1. In Railway Dashboard → Backend → Settings
2. Copy Connection String
3. Run migrations locally (if needed)
4. Or add migrate script to build process
```

### Option C: Add to Deploy Hook

Create `railway.json` in project root:

```json
{
  "build": "npm install && npm run build",
  "deploy": "npm run migrate && npm start"
}
```

---

## 🌍 Custom Domain Setup (Optional)

### Add Your Domain

1. In Railway Dashboard → Project Settings
2. Click "Domain"
3. Click "Add Custom Domain"
4. Enter your domain (e.g., api.yourdomain.com)

### Update DNS Records

Go to your domain provider (GoDaddy, Namecheap, etc.):

```
Type: CNAME
Name: api
Value: railway-provided-url
TTL: 3600
```

Wait 5-30 minutes for DNS to propagate.

---

## 🚨 Troubleshooting

### Issue: Build Failing

**Error in logs:**
```
npm ERR! Cannot find module 'express'
```

**Solution:**
```bash
# Make sure package.json exists in backend folder
# Make sure package-lock.json is committed
# In Railway, set Root Directory correctly
```

### Issue: Database Connection Error

**Error:**
```
ECONNREFUSED: connection refused
```

**Solution:**
```
1. Check DATABASE_URL is set correctly
2. Use Railway's auto-populated value: ${{Postgres.DATABASE_URL}}
3. Don't modify it manually
4. Redeploy backend service
```

### Issue: Frontend Can't Reach Backend

**Error:**
```
GET /api/v1/doctors 404
```

**Solution:**
```
1. Check VITE_API_BASE_URL in frontend variables
2. Must match exactly: https://backend-url.railway.app/api/v1
3. Rebuild frontend
4. Clear browser cache (Ctrl+Shift+Delete)
```

### Issue: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE :::5000
```

**Solution:**
```
1. In Railway Backend settings
2. Set PORT environment variable to 5000
3. Or let Railway assign it automatically
4. Redeploy
```

---

## 📊 Monitoring & Logs

### View Logs

1. Go to Railway Dashboard
2. Select your service
3. Click "Logs" tab
4. See real-time logs

### Set Up Alerts (Optional)

1. Go to Project Settings
2. Click "Alerts"
3. Add webhook for errors
4. Get notified on failures

### Monitor Performance

1. Go to each service
2. Click "Deployments" tab
3. View metrics (CPU, Memory, Response time)

---

## 🔄 Auto-Deployment Setup

Railway auto-deploys when you push to GitHub!

```bash
# Make changes locally
git add .
git commit -m "Update features"
git push origin main

# Railway automatically:
# 1. Detects new push
# 2. Builds project
# 3. Runs migrations
# 4. Deploys to production
# ✅ Done!
```

No need to manually trigger deploys.

---

## 💡 Pro Tips

### Tip 1: Use Railway CLI for Development

```bash
# Connect to production database locally
railway connect

# Run local tests against production DB
npm run test
```

### Tip 2: Environment-Specific Variables

```
Development:  NODE_ENV=development
Staging:      NODE_ENV=staging
Production:   NODE_ENV=production
```

### Tip 3: Backup Your Database

```bash
# In Railway Dashboard
1. Go to PostgreSQL service
2. Click "Backups"
3. Enable automatic backups
4. Backups auto-retain 7 days
```

### Tip 4: Scale Services

```bash
# In Railway Dashboard → Service Settings
1. Find "Deploy" section
2. Adjust CPU and Memory
3. Add replicas for auto-scaling
4. Redeploy
```

---

## 📈 Cost Estimation

### Monthly Breakdown

```
Frontend Server:     $5-20 (or free if minimal)
Backend Server:      $5-20
PostgreSQL:          Included in plan
Redis:              Included in plan
────────────────────────────────────
Total:              $5-40/month

vs. Heroku:         $100-300/month
vs. AWS:            $50-300/month
```

### Free Tier Limits

```
- $5 credit per month (first 5 months)
- Limited to 1 web service
- PostgreSQL included
- Perfect for testing
```

---

## ✅ Final Checklist

Before going live:

- [ ] GitHub repo created and pushed
- [ ] Railway account created
- [ ] PostgreSQL database added
- [ ] Redis cache added
- [ ] Backend service configured
- [ ] Frontend service configured
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Backend health check passes
- [ ] Frontend loads successfully
- [ ] API endpoints working
- [ ] Database tables visible
- [ ] Auto-deployments enabled
- [ ] Custom domain configured (optional)
- [ ] Backups enabled (optional)
- [ ] Monitoring set up (optional)

---

## 🚀 Next Steps

1. **Push code to GitHub** (see Step 1 above)
2. **Create Railway account** (see Step 2 above)
3. **Deploy project** (see Step 3-4 above)
4. **Monitor logs** (see Monitoring section)
5. **Set custom domain** (see Custom Domain section)

---

## 📞 Support

### Railway Support
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Email: support@railway.app

### Quick Links
- Dashboard: https://railway.app/dashboard
- Create Project: https://railway.app/new
- Documentation: https://docs.railway.app

---

**Status:** ✅ Ready to Deploy  
**Estimated Time:** 10-15 minutes  
**Cost:** $5-40/month  
**Difficulty:** Easy ⭐

**Start deploying now! 🚀**
