# SwasthAI - Web Platform Deployment Guide 🚀

**Best Deployment Strategies for Vercel, Netlify, Railway & Beyond**

**Updated:** December 30, 2025

---

## 📊 Platform Comparison & Recommendations

### Quick Comparison Table

| Platform | Frontend | Backend | Database | Cost | Best For | Setup Time |
|----------|----------|---------|----------|------|----------|------------|
| **Vercel** ⭐ | ✅ Best | ✅ Good | ❌ No | $20-100/mo | React/Next.js apps | 5 min |
| **Netlify** | ✅ Excellent | ✅ Good | ❌ No | $20-99/mo | Static + Serverless | 10 min |
| **Railway** ⭐⭐ | ✅ Yes | ✅ Excellent | ✅ Yes | $5-100/mo | Full-stack apps | 10 min |
| **Render** | ✅ Yes | ✅ Excellent | ✅ Yes | $0-100/mo | Full-stack, free tier | 10 min |
| **Fly.io** | ✅ Yes | ✅ Excellent | ✅ Yes | $5-200/mo | Global deployment | 15 min |
| **Heroku** | ✅ Yes | ✅ Yes | ✅ Yes | $50-250/mo | Simplicity | 15 min |
| **PlanetScale** | ❌ | ❌ | ✅ MySQL | $0-50/mo | Database only | - |
| **Supabase** | ❌ | ❌ | ✅ PostgreSQL | $0-200/mo | Database + Auth | - |

---

## 🎯 RECOMMENDATION FOR YOUR PROJECT

### **Best Option: Railway ⭐⭐ (RECOMMENDED)**

**Why Railway is Best:**
- ✅ Full-stack deployment (frontend + backend + database)
- ✅ PostgreSQL included
- ✅ Redis support
- ✅ Cheapest for full-stack ($5-100/month)
- ✅ Free tier available
- ✅ Docker support
- ✅ Easy environment variables
- ✅ GitHub integration
- ✅ Automatic deployments

**Cost:** $5-50/month (very affordable)  
**Setup Time:** 10 minutes

---

### **Alternative Option 1: Vercel + Supabase/Railway**

**For Frontend:**
- Deploy React app to Vercel
- Cost: $20/month (Pro) or free

**For Backend:**
- Deploy Node.js API to Railway
- Cost: $5-20/month

**For Database:**
- Use Supabase PostgreSQL
- Cost: $25/month

**Total:** ~$50/month (scalable, best for enterprise)

---

### **Alternative Option 2: Netlify + Render**

**For Frontend:**
- Deploy React to Netlify
- Cost: Free or $20/month

**For Backend:**
- Deploy Node.js to Render
- Cost: $7/month (free tier available)

**For Database:**
- Use Render PostgreSQL
- Cost: $15/month (free tier available)

**Total:** $20-45/month

---

## 🚀 Step-by-Step Deployment Guides

### ⭐ RECOMMENDED: Railway Deployment (10 minutes)

#### Step 1: Prepare Your Project

```bash
# In project root
cd SwasthAI

# Create .railwayignore file
cat > .railwayignore << 'EOF'
node_modules
.env
.git
dist
build
*.log
.DS_Store
EOF

# Push to GitHub (required for Railway)
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

#### Step 2: Create Railway Account

1. Go to https://railway.app
2. Click "Start Project"
3. Sign in with GitHub
4. Authorize Railway

#### Step 3: Create New Project

1. Click "Create New Project"
2. Select "Deploy from GitHub repo"
3. Select your SwasthAI repository
4. Approve installation

#### Step 4: Add Services

**A. PostgreSQL Database**
```bash
# In Railway Dashboard:
1. Click "Add Service"
2. Select "PostgreSQL"
3. It will auto-populate DATABASE_URL
```

**B. Redis Cache**
```bash
# In Railway Dashboard:
1. Click "Add Service"
2. Select "Redis"
3. It will auto-populate REDIS_URL
```

**C. Backend Service**
```bash
# In Railway Dashboard:
1. Click "Add Service"
2. Select "GitHub Repo"
3. Select your repository
4. Set root directory: ./backend
5. Add environment variables (see section below)
6. Deployment starts automatically
```

**D. Frontend Service**
```bash
# In Railway Dashboard:
1. Click "Add Service"
2. Select "GitHub Repo"
3. Select your repository
4. Set root directory: ./frontend
5. Set build command: npm run build
6. Set start command: npm run preview
7. Set port: 3000
```

#### Step 5: Configure Environment Variables

**For Backend:**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=your_secure_jwt_secret_here
REFRESH_TOKEN_SECRET=your_secure_refresh_secret
CORS_ORIGIN=https://your-frontend-url.railway.app,https://yourdomain.com
```

**For Frontend:**
```
VITE_API_BASE_URL=https://your-backend-url.railway.app/api/v1
VITE_API_URL=https://your-backend-url.railway.app
```

#### Step 6: Domain Setup (Optional)

```bash
# In Railway Dashboard:
1. Go to Settings → Domains
2. Add custom domain
3. Point DNS to Railway nameservers
4. Or use Railway subdomain (free)
```

#### Step 7: Verify Deployment

```bash
# Check logs
# In Railway Dashboard > Logs tab

# Test API
curl https://your-backend-url.railway.app/health

# Test Frontend
https://your-frontend-url.railway.app
```

---

### Alternative: Vercel + Railway Deployment

#### For Frontend - Deploy to Vercel

**Step 1: Prepare Frontend**
```bash
# Make sure vite.config.js is correct
# Ensure build output is 'dist'
# Frontend is independent
```

**Step 2: Create Vercel Account**
- Go to https://vercel.com
- Sign up with GitHub
- Create new project
- Select your GitHub repo

**Step 3: Configure Vercel Project**

```javascript
// vercel.json (create in project root)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "routes": [
    {
      "src": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@railway_api_url"
  }
}
```

**Step 4: Set Environment Variables in Vercel**
- Go to Settings → Environment Variables
- Add: `VITE_API_BASE_URL=https://your-railway-backend.railway.app/api/v1`
- Redeploy

#### For Backend - Deploy to Railway

Follow Railway steps above for backend

---

### Alternative: Netlify + Render Deployment

#### For Frontend - Deploy to Netlify

**Step 1: Create Netlify Account**
- Go to https://netlify.com
- Sign in with GitHub
- Click "New site from Git"
- Select your repository

**Step 2: Configure Build Settings**

```
Build command:     npm run build
Publish directory: dist
```

**Step 3: Set Environment Variables**

```
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api/v1
```

**Step 4: Deploy**
- Netlify auto-deploys on git push
- Get your Netlify URL

#### For Backend - Deploy to Render

**Step 1: Create Render Account**
- Go to https://render.com
- Sign up with GitHub

**Step 2: Create New Web Service**
- Click "New +"
- Select "Web Service"
- Connect GitHub repo
- Select your repository

**Step 3: Configure Service**

```
Name: swasthai-backend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
Environment: production
```

**Step 4: Add Environment Variables**

```
DATABASE_URL: (from Render PostgreSQL)
REDIS_URL: (from Render Redis)
NODE_ENV: production
PORT: 5000
JWT_SECRET: your_secret
REFRESH_TOKEN_SECRET: your_refresh_secret
CORS_ORIGIN: https://your-netlify-frontend.netlify.app
```

**Step 5: Create Database**
- In Render Dashboard
- Click "New +"
- Select "PostgreSQL"
- Set database name: swasthai_db
- Copy DATABASE_URL to backend service

**Step 6: Create Redis (Optional)**
- Click "New +"
- Select "Redis"
- Copy REDIS_URL to backend service

---

## 📋 Configuration Files Needed

### Create `vercel.json` (for Vercel)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "routes": [
    {
      "src": "/api/(.*)",
      "destination": "https://your-backend.railway.app/api/$1"
    },
    {
      "src": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Create `netlify.toml` (for Netlify)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm run dev"
  port = 5173

[[redirects]]
  from = "/api/*"
  to = "https://your-backend.railway.app/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Create `.env.production` for Backend

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
REFRESH_TOKEN_SECRET=your_refresh_secret_key
CORS_ORIGIN=https://your-frontend.vercel.app,https://yourdomain.com
API_BASE_URL=https://your-backend-url.railway.app
```

---

## 🔐 Security Configuration

### Environment Variables Setup

**Never commit secrets to Git:**

```bash
# 1. Create .env.local (gitignored)
echo ".env.local" >> .gitignore

# 2. Set variables in each platform's dashboard:
# - Vercel Settings → Environment Variables
# - Netlify Settings → Build & Deploy → Environment
# - Railway Variables tab
# - Render Environment tab
```

### Database Security

```sql
-- Change default credentials
ALTER USER postgres WITH PASSWORD 'strong_password_123!@#';

-- Create app user with limited permissions
CREATE USER swasthai_app WITH PASSWORD 'app_password_here';
GRANT CONNECT ON DATABASE swasthai_db TO swasthai_app;
GRANT USAGE ON SCHEMA public TO swasthai_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO swasthai_app;
```

### Enable HTTPS Everywhere

- ✅ Vercel: Auto-enabled, free SSL
- ✅ Netlify: Auto-enabled, free SSL
- ✅ Railway: Auto-enabled, free SSL
- ✅ Render: Auto-enabled, free SSL

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Code committed to GitHub
- [ ] `.env.example` files created (no secrets)
- [ ] `package.json` has correct scripts
- [ ] Database migrations ready
- [ ] Vite config optimized
- [ ] Build works locally (`npm run build`)
- [ ] Tests passing (optional)
- [ ] Frontend & backend separated correctly

### Deployment Day
- [ ] Create platform account (GitHub login)
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Trigger first deployment
- [ ] Run database migrations
- [ ] Check deployment logs
- [ ] Verify health endpoints
- [ ] Test all features

### Post-Deployment
- [ ] Monitor logs for errors
- [ ] Check performance metrics
- [ ] Verify database connection
- [ ] Test API endpoints
- [ ] Test frontend functionality
- [ ] Setup custom domain (optional)
- [ ] Enable auto-deployments
- [ ] Configure monitoring/alerts

---

## 🛠️ Platform-Specific Issues & Solutions

### Railway Issues

**Issue: Build failing**
```bash
# Solution: Check build logs in Railway dashboard
# Common cause: Missing environment variables
# Fix: Add all required variables in Railway UI
```

**Issue: Database not connecting**
```bash
# Solution: Use Railway's auto-populated DATABASE_URL
# Don't manually set database credentials
# Check in Settings → Environment Variables
```

### Vercel Issues

**Issue: API calls failing**
```bash
# Solution: Check VITE_API_BASE_URL matches your backend
# Redeploy after changing env variables
```

**Issue: Build size too large**
```bash
# Solution: Enable code splitting in vite.config.js
# Remove unused dependencies
# Check bundle size: npm run build
```

### Netlify Issues

**Issue: Redirects not working**
```bash
# Solution: Use netlify.toml with correct syntax
# Check redirects in Netlify UI
# Clear cache and redeploy
```

---

## 📊 Cost Comparison for Your Project

### Monthly Costs (After First Year)

| Platform | Frontend | Backend | Database | Total/Month | Notes |
|----------|----------|---------|----------|------------|-------|
| **Railway** | Free | $5-20 | Included | **$5-20** | BEST VALUE |
| Vercel + Rail | $20 | $5-20 | Incl | $25-40 | Good |
| Netlify + Render | Free-$20 | $7-25 | $15-40 | $22-85 | Flexible |
| Heroku | $25-100 | $25-100 | $50-100 | $100-300 | Most expensive |
| AWS | Variable | Variable | Variable | $50-300+ | Most complex |

---

## 🌍 Quick Links

### Platform Dashboards
- **Railway:** https://railway.app/dashboard
- **Vercel:** https://vercel.com/dashboard
- **Netlify:** https://app.netlify.com
- **Render:** https://dashboard.render.com
- **Fly.io:** https://fly.io/dashboard

### Documentation
- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **Render Docs:** https://render.com/docs

---

## ⚡ Quick Start Commands

### Railway (Recommended)
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to railway.app
# 3. Create project from GitHub repo
# 4. Add PostgreSQL service
# 5. Add Redis service
# 6. Deploy both frontend and backend
# Done! ✅
```

### Vercel
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Follow prompts
# Done! ✅
```

### Netlify
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy

# 3. Authorize with GitHub
# Done! ✅
```

---

## 📝 Final Recommendation

### For Your SwasthAI Project:

**🏆 BEST: Railway**
- One-click full-stack deployment
- PostgreSQL + Redis included
- Cost: $5-20/month
- Setup time: 10 minutes
- Perfect for your architecture

**🥈 Alternative: Vercel + Railway**
- Vercel for frontend (best performance)
- Railway for backend & database
- Cost: $25-40/month
- More control over each layer

**🥉 Alternative: Netlify + Render**
- Netlify for frontend (excellent)
- Render for backend & database
- Cost: $22-85/month
- Both have free tiers

---

## ✅ Next Steps

1. **Choose Your Platform:**
   - Recommended: Railway
   - Alternative: Vercel + Railway
   - Budget: Netlify + Render

2. **Create Account:**
   - Go to platform website
   - Sign up with GitHub

3. **Connect Repository:**
   - Follow platform's GitHub integration
   - Authorize access

4. **Configure:**
   - Set environment variables
   - Add services (DB, Redis, API, etc.)

5. **Deploy:**
   - Trigger first deployment
   - Monitor logs
   - Test endpoints

6. **Monitor:**
   - Watch logs daily
   - Check performance metrics
   - Handle any issues

---

**Status:** ✅ Ready to Deploy  
**Recommended Platform:** Railway  
**Estimated Time:** 10-15 minutes  
**Cost:** $5-20/month

**Choose a platform above and start deploying! 🚀**
