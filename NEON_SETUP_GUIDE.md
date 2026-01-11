# 🗄️ NEON PostgreSQL Setup Guide for SwasthAI

## Quick Reference

**Free Tier Includes:**
- ✅ 3 Projects
- ✅ 0.5 GB storage per project
- ✅ Unlimited API requests
- ✅ 1 month data retention
- ✅ SSL/TLS encryption

---

## Complete Setup Instructions

### 1️⃣ **Create Neon Account**
- Go to: https://neon.tech/
- Click "Sign Up" → "Continue with GitHub"
- Authorize and complete profile

### 2️⃣ **Create Project**
- Click "Create a project"
- **Project name:** `swasthai-db`
- **Database name:** `swasthai_db`
- **Region:** Choose closest (or US East)
- **PostgreSQL:** Version 16
- Click "Create project"
- ⏳ Wait 30-60 seconds for setup

### 3️⃣ **Get Connection String**
1. Open your project dashboard
2. You'll see a connection string box
3. **Copy the full connection string**

**Example format:**
```
postgresql://neon_user:password123@ep-cool-morning-a1b2c3d4.us-east-2.compute.neon.tech/swasthai_db?sslmode=require
```

### 4️⃣ **Update Backend .env**

Replace this line in `backend/.env`:
```
DATABASE_URL="postgresql://neon_user:password123@ep-cool-morning-a1b2c3d4.us-east-2.compute.neon.tech/swasthai_db?sslmode=require"
```

### 5️⃣ **Test Connection Locally**

```bash
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```

If successful, you should see:
```
✅ Database connected
✅ Server running on http://localhost:5000
```

### 6️⃣ **View Your Data**

In Neon dashboard:
1. Click "SQL Editor"
2. Run sample query:
```sql
SELECT * FROM users LIMIT 5;
SELECT * FROM health_records LIMIT 5;
```

---

## 🔐 **Security Tips**

1. **Never commit `.env` to GitHub**
   - Ensure `.gitignore` includes `.env`
   - Check: `cat .gitignore | grep env`

2. **Create Strong Passwords**
   - Use 16+ characters
   - Mix: uppercase, lowercase, numbers, symbols

3. **Use Different Passwords for Production**
   - Local dev: one password
   - Production/Render: different password

4. **Rotate Credentials Regularly**
   - Change password every 3 months

---

## 📊 **Database Tables Schema**

Your Prisma migrations will create:
- `users` - User accounts
- `health_records` - Patient health data
- `appointments` - Doctor appointments
- `doctors` - Doctor profiles
- `medicines` - Medicine catalog
- `forums` - Health forum posts
- `articles` - Health articles
- And more...

---

## 🚨 **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| Connection refused | Check connection string in `.env` |
| SSL error | Ensure `?sslmode=require` is included |
| Database doesn't exist | Run `npm run migrate` |
| Timeout errors | Check your internet connection |
| 403 error | Credentials wrong - copy again from Neon |

---

## 📱 **Next Steps**

1. ✅ Create database in Neon
2. ✅ Update `.env` with connection string
3. ✅ Test locally: `npm run dev`
4. 🔄 Deploy backend to Render (next step)
5. 🔗 Connect frontend to backend API

---

## 🎯 **Neon Dashboard Shortcuts**

- **Projects:** https://console.neon.tech/app/projects
- **SQL Editor:** https://console.neon.tech/app/projects → Your Project → SQL Editor
- **Connection String:** Your Project → "Connection string" box
- **Monitoring:** Your Project → "Monitoring" tab

---

## 📞 **Neon Support**

- **Docs:** https://neon.tech/docs
- **Status:** https://neon.statuspage.io
- **Community:** https://discord.gg/neon

---

## ✨ **Pro Tips**

1. **Branch your database** - Neon allows branching for testing
2. **Monitor usage** - Check dashboard → "Monitoring" tab
3. **Auto-suspend** - Databases auto-suspend after 5 min idle (free tier)
4. **Backups** - Daily automatic backups
5. **Upgrade anytime** - Start with free, upgrade to paid when needed

