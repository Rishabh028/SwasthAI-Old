# Netlify Deployment Guide for SwasthAI

**Best for Full-Stack with Serverless** ⭐

---

## Why Netlify?

- ✅ Perfect for Jamstack applications
- ✅ Free tier very generous
- ✅ Serverless functions for backend
- ✅ Built-in CI/CD
- ✅ Form handling included
- ✅ Edge functions for dynamic content
- ✅ Excellent documentation

---

## 🎯 Two Deployment Options

### Option A: Netlify Frontend + Render/Railway Backend (Recommended)

Frontend on Netlify (free/cheap)  
Backend on Railway/Render ($5-20/month)  
**Total:** ~$5-20/month

### Option B: Netlify with Functions as Backend

Frontend + Backend both on Netlify  
Use serverless functions instead of Express  
**Total:** Free-$200/month depending on usage

For your project, **Option A is recommended** because you have a full Express backend.

---

## 🚀 Option A: Frontend on Netlify

### Step 1: Create Netlify Account

1. Go to https://netlify.com
2. Click "Sign up"
3. Click "GitHub"
4. Authorize Netlify

### Step 2: Connect GitHub Repo

1. Click "Add new site"
2. Click "Import an existing project"
3. Click "GitHub"
4. Select "SwasthAI" repository
5. Click "Install"

### Step 3: Configure Build Settings

```
Base directory:        frontend
Build command:         npm run build
Publish directory:     dist
```

### Step 4: Add Environment Variables

1. Go to "Site settings"
2. Click "Build & deploy"
3. Click "Environment"
4. Add variables:

```
VITE_API_BASE_URL  https://your-railway-backend.railway.app/api/v1
VITE_API_URL       https://your-railway-backend.railway.app
```

### Step 5: Deploy

1. Click "Deploy site"
2. Wait for build (2-3 minutes)
3. Get your Netlify URL
4. Site is LIVE! ✅

---

## 📁 Netlify Config File (Optional)

Create `netlify.toml` in project root:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm run dev"
  port = 5173

[[redirects]]
  from = "/api/*"
  to = "https://your-railway-backend.railway.app/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 🌍 Custom Domain

### Add Your Domain

1. Go to "Site settings"
2. Click "Domain management"
3. Click "Add custom domain"
4. Enter domain

### Configure DNS

Go to your domain provider:

```
Option A: Use Netlify DNS
─────────────────────────
1. Change nameservers to Netlify
2. Netlify auto-configures SSL

Option B: Add CNAME (if using existing DNS)
─────────────────────────
Type:  CNAME
Name:  www
Value: your-site.netlify.app
```

### Enable HTTPS

- ✅ Auto-enabled by Netlify
- ✅ Free SSL certificate
- ✅ Renews automatically

---

## 🔐 Environment Variables

### Production Variables

1. Go to "Site settings"
2. "Build & deploy"
3. "Environment"
4. Add:

```
VITE_API_BASE_URL  https://your-backend-url/api/v1
VITE_API_URL       https://your-backend-url
```

### Preview/Branch Variables

```
# For PR previews, use different backend
VITE_API_BASE_URL  https://staging-backend.railway.app/api/v1
```

### Local .env.local (Not Committed)

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_API_URL=http://localhost:5000
```

---

## 🔄 Continuous Deployment

Auto-deploy on every push:

```bash
git push origin main
# Netlify detects push
# Builds frontend
# Deploys to CDN
# Live in 1-2 minutes ✅
```

### Branch Deploys

```bash
# Create feature branch
git checkout -b new-feature

# Push
git push origin new-feature

# Get preview URL for PR
# Test before merging
# Merge to main
# Auto-deploys to production
```

---

## 🧪 Testing

### Test Frontend

```bash
# Visit your Netlify URL
https://your-site.netlify.app

# Open DevTools (F12)
# Check Console for errors
# Network tab should show API calls
```

### Test API Integration

```bash
# In console:
fetch('https://your-backend-url/api/v1/doctors')
  .then(r => r.json())
  .then(data => console.log(data))
```

### Check Performance

1. Go to "Analytics"
2. View Core Web Vitals
3. Check page performance
4. Monitor Edge requests

---

## 🚨 Troubleshooting

### Issue: Build Failing

```
ERR! npm ERR! missing script: build
```

**Solution:**
```
1. Ensure vite.config.js in frontend/
2. Check package.json has build script
3. Set Base directory: frontend
4. Set Build command: npm run build
```

### Issue: API Calls Failing

```
GET https://undefined/api/v1/doctors 404
```

**Solution:**
```
1. Check VITE_API_BASE_URL in Environment Variables
2. Must match your backend URL exactly
3. Trigger rebuild after changing
4. Clear browser cache (Ctrl+Shift+Delete)
```

### Issue: Static Assets 404

**Problem:** CSS/JS files not loading

**Solution:**
```
1. Check vite.config.js has: build: { outDir: 'dist' }
2. Check Base directory: frontend
3. Check Publish directory: dist
4. Rebuild
```

### Issue: Redirects Not Working

**Problem:** React Router paths showing 404

**Solution:**
```
1. Add netlify.toml to project root
2. Include redirect rules:
   from = "/*"
   to = "/index.html"
   status = 200
3. Commit and push
4. Netlify redeploys automatically
```

---

## 📊 Monitoring

### View Logs

1. Go to "Deploys"
2. Click on deployment
3. View build logs
4. See any errors

### Set Notifications

1. Go to "Site settings"
2. "Build & deploy"
3. "Notifications"
4. Add Slack/Email
5. Get notified on failures

### Monitor Performance

1. Go to "Analytics"
2. Check Core Web Vitals
3. Monitor bandwidth usage
4. Track build times

---

## 💡 Pro Tips

### Tip 1: Environment-Specific Deployments

```toml
# netlify.toml
[context.production]
  command = "npm run build -- --mode production"
  
[context.deploy-preview]
  command = "npm run build -- --mode staging"
```

### Tip 2: Rollback Quickly

1. Go to "Deploys"
2. Find previous working version
3. Click menu (...)
4. Click "Publish deploy"
5. Rolled back instantly ✅

### Tip 3: Use Netlify CLI

```bash
# Install
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod

# View logs
netlify logs
```

### Tip 4: Preview Deployments

```bash
# Create PR
# Netlify creates preview URL
# Test preview
# Merge after approval
# Auto-deploys to production
```

---

## 🔐 Security Best Practices

- ✅ Use HTTPS (auto-enabled)
- ✅ Keep .env files in Git
- ✅ Use netlify.toml for config
- ✅ Enable branch protection
- ✅ Review deployments
- ✅ Monitor logs for errors
- ✅ Use preview URLs before production

---

## 📈 Pricing

### Free Tier ✅
- Unlimited deployments
- Build time: 300 min/month
- Form submissions: 100/month
- Bandwidth: 100 GB/month
- Perfect for most projects!

### Pro ($20/month)
- More build time
- Advanced analytics
- Priority support

### Higher Tiers
- For high-traffic sites
- Custom limits
- Team features

---

## ✅ Deployment Checklist

- [ ] GitHub repo created
- [ ] Netlify account created
- [ ] Project imported to Netlify
- [ ] Base directory: frontend/
- [ ] Build command: npm run build
- [ ] Publish directory: dist
- [ ] Environment variables added
- [ ] Backend URL configured
- [ ] First build successful
- [ ] Frontend loads at Netlify URL
- [ ] API calls working
- [ ] Custom domain added (optional)
- [ ] Branch deployments enabled
- [ ] Performance monitoring enabled

---

## 🚀 Complete Setup (5 Steps)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Netlify account**
   - Go to netlify.com
   - Sign up with GitHub

3. **Import project**
   - Click "Add new site"
   - Select your repo
   - Approve installation

4. **Configure build**
   - Base: frontend
   - Command: npm run build
   - Publish: dist

5. **Add environment**
   - VITE_API_BASE_URL: your-backend-url
   - Deploy ✅

---

## 📞 Support

### Netlify Resources
- Docs: https://docs.netlify.com
- Community: https://community.netlify.com
- Support: https://support.netlify.com

### Quick Links
- Dashboard: https://app.netlify.com
- Create Site: https://app.netlify.com/teams/YOUR_TEAM/sites
- Status: https://www.netlifystatus.com

---

## 🎯 Next Steps

1. **Create Netlify account** (netlify.com)
2. **Connect GitHub repository**
3. **Configure build settings**
4. **Add environment variables**
5. **Deploy website**
6. **Test thoroughly**
7. **Set up custom domain**
8. **Monitor performance**

---

**Status:** ✅ Ready to Deploy  
**Time:** 5-10 minutes  
**Cost:** Free or $20/month  
**Difficulty:** Very Easy ⭐⭐

**Let's get your SwasthAI frontend live on Netlify! 🚀**
