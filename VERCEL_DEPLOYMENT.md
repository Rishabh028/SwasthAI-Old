# Vercel Deployment Guide for SwasthAI Frontend

**Best for React/Frontend Deployment** ⭐

---

## Why Vercel for Frontend?

- ✅ Optimized for Next.js & Vite
- ✅ Fastest edge network
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ✅ Built-in analytics
- ✅ Serverless functions for API routes
- ✅ Perfect for React applications

---

## 📋 Prerequisites

- GitHub account with pushed code
- Vercel account (free)
- Backend deployed elsewhere (Railway, Render, etc.)

---

## 🚀 5-Minute Vercel Setup

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Click "Continue with GitHub"
4. Authorize Vercel to access your repositories

### Step 2: Import Project

1. In Vercel Dashboard, click "Add New..."
2. Click "Project"
3. Click "Continue with GitHub"
4. Select your SwasthAI repository
5. Click "Import"

### Step 3: Configure Project

```
Project Name:          swasthai-frontend
Framework Preset:      Vite
Root Directory:        frontend/
Node Version:          18.x
Build Command:         npm run build
Output Directory:      dist
Environment:           production
```

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```
VITE_API_BASE_URL  = https://your-railway-backend.railway.app/api/v1
VITE_API_URL       = https://your-railway-backend.railway.app
```

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Get your Vercel URL
4. Test at https://your-project.vercel.app

---

## 📁 Project Structure for Vercel

```
SwasthAI/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/           (ignored by Vercel)
└── vercel.json       (optional config)
```

### Create vercel.json (Optional)

Create in project root:

```json
{
  "buildCommand": "npm run build --prefix frontend",
  "outputDirectory": "frontend/dist",
  "devCommand": "npm run dev --prefix frontend",
  "installCommand": "npm install --prefix frontend"
}
```

---

## 🔐 Environment Variables

### In Vercel Dashboard

1. Go to Settings
2. Click "Environment Variables"
3. Add for all environments:

```
VITE_API_BASE_URL  https://your-backend-url/api/v1
VITE_API_URL       https://your-backend-url
```

### .env.local (Local Development - NOT COMMITTED)

```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_API_URL=http://localhost:5000
```

### .env.example (Committed to Git)

```bash
VITE_API_BASE_URL=
VITE_API_URL=
```

---

## 🌍 Custom Domain Setup

### Add Domain

1. Go to Project Settings
2. Click "Domains"
3. Click "Add"
4. Enter your domain

### Configure DNS

Go to your domain provider:

```
Option A: Use Vercel Nameservers
────────────────────────────────
1. Point nameservers to Vercel
2. Vercel handles DNS

Option B: Add CNAME
────────────────────────────────
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
```

Wait 24 hours for DNS propagation.

---

## 🔄 Auto-Deployment

Vercel auto-deploys on every push to main:

```bash
# Make changes
git add .
git commit -m "Update UI"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Builds frontend
# 3. Deploys to CDN
# ✅ Live in 1-2 minutes!
```

### Preview Deployments

Each pull request gets a preview URL:

```
https://swasthai-frontend-pr-123.vercel.app
```

Perfect for testing before merging.

---

## 🧪 Testing Your Deployment

### Check Build

1. Go to Vercel Dashboard
2. Click "Deployments"
3. View recent build logs

### Test Frontend

```bash
# Visit your Vercel URL
https://your-project.vercel.app

# Check console for errors
F12 → Console tab

# Test API calls
Network tab → should show /api/v1 calls
```

### Performance Check

1. Go to Vercel Dashboard
2. Click "Analytics" tab
3. View Core Web Vitals
4. Monitor performance

---

## 🚨 Troubleshooting

### Issue: Build Failing

**Error:**
```
ERR! npm ERR! missing script: build
```

**Solution:**
```
1. Check vite.config.js exists in frontend/
2. Check package.json has "build" script
3. Try locally: npm run build
4. Fix errors, then push to GitHub
```

### Issue: API Calls 404

**Error in Console:**
```
GET https://undefined/api/v1/doctors 404
```

**Solution:**
```
1. Check VITE_API_BASE_URL in Environment Variables
2. Must be fully qualified URL (with https://)
3. Redeploy after updating
4. Clear browser cache (Ctrl+Shift+Delete)
5. Check backend is running
```

### Issue: Blank Page

**Cause:** Build output directory mismatch

**Solution:**
```
1. Check vite.config.js has: build: { outDir: 'dist' }
2. In Vercel, Output Directory should be: frontend/dist
3. Or use Root Directory: frontend/
4. Rebuild
```

### Issue: Static Assets Not Loading

**Error:** 404 on CSS/JS files

**Solution:**
```
1. Check vite.config.js has correct publicPath
2. Check build output has dist/assets/
3. Vercel should serve from CDN automatically
4. Clear cache and redeploy
```

---

## 📊 Monitoring

### View Logs

1. Go to Deployments tab
2. Click on specific deployment
3. View build logs
4. View runtime logs

### Set Alerts

1. Go to Settings → Integrations
2. Add Slack/Email notifications
3. Get alerted on build failures

### Monitor Performance

1. Go to Analytics
2. View page load times
3. Track Core Web Vitals
4. Monitor API latency

---

## 💡 Pro Tips

### Tip 1: Preview Before Merge

```bash
# Create feature branch
git checkout -b new-feature

# Make changes
# Push
git push origin new-feature

# Create Pull Request on GitHub
# Vercel auto-creates preview URL
# Test preview URL
# Merge after testing
```

### Tip 2: Rollback Quickly

1. Go to Deployments
2. Find previous working version
3. Click "Promote to Production"
4. Done! Reverted in seconds

### Tip 3: Optimize Bundle Size

```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'routing': ['react-router-dom'],
        }
      }
    }
  }
}
```

Check size: `npm run build` and view dist/ folder

### Tip 4: Use Vercel CLI

```bash
# Install
npm i -g vercel

# Deploy
vercel

# View logs
vercel logs

# Set environment variable
vercel env add VITE_API_BASE_URL
```

---

## 🔐 Security Best Practices

- ✅ Use HTTPS everywhere (auto)
- ✅ Never commit .env files
- ✅ Use Vercel Secrets Manager for sensitive data
- ✅ Enable branch protection on GitHub
- ✅ Review deployments before merging
- ✅ Monitor performance metrics

---

## 📈 Pricing

### Free Tier
- ✅ Unlimited deployments
- ✅ Auto-scaling
- ✅ Analytics
- ✅ HTTPS
- ✅ Perfect for most projects

### Pro ($20/month)
- ✅ Advanced analytics
- ✅ Password protection
- ✅ Priority support
- ✅ Custom limits

For a healthcare app, free tier is perfect to start.

---

## ✅ Deployment Checklist

- [ ] GitHub repo created and pushed
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Root directory set to: frontend/
- [ ] Build command correct: npm run build
- [ ] Output directory: dist
- [ ] Environment variables added
- [ ] Backend URL verified
- [ ] First deployment successful
- [ ] Frontend loads at Vercel URL
- [ ] API calls working
- [ ] Custom domain configured (optional)
- [ ] Preview deployments enabled
- [ ] Analytics enabled

---

## 🚀 Next Steps

1. **Create Vercel account** (vercel.com)
2. **Import your GitHub repo**
3. **Configure build settings**
4. **Add environment variables**
5. **Deploy**
6. **Test thoroughly**
7. **Monitor analytics**
8. **Add custom domain** (optional)

---

## 📞 Support

### Vercel Support
- Docs: https://vercel.com/docs
- Community: https://discussions.vercel.com
- Email: support@vercel.com

### Quick Links
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Status: https://www.vercelstatus.com

---

**Status:** ✅ Ready to Deploy  
**Time:** 5 minutes  
**Cost:** Free (starter) or $20/month (pro)  
**Difficulty:** Very Easy ⭐

**Vercel is perfect for your React frontend!**
