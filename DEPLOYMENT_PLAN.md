# SwasthAI - Complete Deployment Plan

**Created:** December 30, 2025  
**Status:** Ready for Deployment

---

## 📋 Project Overview

SwasthAI is a comprehensive healthcare web application with:
- **Frontend:** React 18 + Vite + TailwindCSS + Leaflet Maps
- **Backend:** Node.js + Express + Prisma ORM
- **Database:** PostgreSQL (production) / SQLite (development)
- **Cache:** Redis
- **Architecture:** Microservices with Docker Compose

---

## ✅ Current State Analysis

### ✨ What's Ready
- ✅ Complete backend API with 8+ route modules
- ✅ Full-featured React frontend with 20+ pages
- ✅ Docker & Docker Compose configuration
- ✅ Prisma database schema (537 lines, fully defined)
- ✅ Security middleware (Helmet, CORS, Rate Limiting, JWT)
- ✅ Comprehensive documentation
- ✅ Health checks and monitoring endpoints

### ⚠️ What Needs Setup Before Deployment
1. **Environment Variables** - Need production values
2. **Database Initialization** - Prisma migrations
3. **Backend Node Modules** - Installation required
4. **Frontend Build** - Production build
5. **External Services** - AWS S3, Stripe, SendGrid, OpenAI, etc.
6. **SSL/TLS Certificates** - For HTTPS
7. **Monitoring & Logging** - Sentry, New Relic setup

---

## 🚀 Deployment Options

### Option 1: **LOCAL DEVELOPMENT** (Recommended First)
**Time:** 15-30 minutes | **Cost:** Free | **Effort:** Easy

```bash
# Requires: Docker, Docker Compose
docker-compose up -d
# Services available:
# - Backend API: http://localhost:5000
# - Frontend: http://localhost:3000
# - Database GUI: http://localhost:5050
```

**Best for:** Testing, development, demos

---

### Option 2: **AWS DEPLOYMENT** (Recommended Production)
**Time:** 1-2 hours | **Cost:** $50-200/month | **Effort:** Medium

#### Components:
- **Amazon ECS** - Container orchestration (Backend + Frontend)
- **AWS RDS** - Managed PostgreSQL
- **ElastiCache** - Managed Redis
- **CloudFront** - CDN for static assets
- **ALB** - Application Load Balancer
- **Route53** - DNS management
- **ACM** - SSL certificates (free)

#### Cost Estimate:
```
ECS Fargate:      $30-50/month
RDS PostgreSQL:   $20-40/month
ElastiCache:      $15-30/month
ALB:              $15-20/month
Data Transfer:    $10-20/month
────────────────────────
Total:            $90-160/month
```

---

### Option 3: **HEROKU DEPLOYMENT** (Quick Start)
**Time:** 30-45 minutes | **Cost:** $50-100/month | **Effort:** Easy

**Pros:**
- Fastest to deploy
- Automatic scaling
- Built-in CI/CD

**Cons:**
- More expensive
- Limited customization
- Monthly bills

---

### Option 4: **DIGITAL OCEAN / LINODE** (Balanced)
**Time:** 45 minutes - 1 hour | **Cost:** $40-80/month | **Effort:** Medium-Hard

**Pros:**
- Good price/performance
- Simple UI
- Managed databases available

**Cons:**
- More server management required
- Manual scaling

---

### Option 5: **KUBERNETES (K8S)** (Advanced)
**Time:** 2-3 hours | **Cost:** Variable | **Effort:** Hard

**Best for:** Large-scale deployments with auto-scaling

---

## 🔧 Step-by-Step Deployment Guide

### PHASE 1: LOCAL TESTING (Windows Machine)

#### Step 1.1: Verify Prerequisites
```powershell
# Check Docker
docker --version  # Should be 20.10+
docker-compose --version  # Should be 2.0+

# Check Node (for local development)
node --version  # Should be 18+
npm --version
```

#### Step 1.2: Create Production `.env` File
**Location:** `backend/.env.production`

```dotenv
# ============================================
# PRODUCTION ENVIRONMENT
# ============================================
NODE_ENV=production
PORT=5000
API_BASE_URL=https://api.yourdomain.com

# ============================================
# DATABASE (Production PostgreSQL)
# ============================================
DATABASE_URL="postgresql://swasthai_user:YOUR_SECURE_PASSWORD@postgres:5432/swasthai_db"
DB_HOST=postgres
DB_PORT=5432
DB_NAME=swasthai_db
DB_USER=swasthai_user
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

# ============================================
# REDIS
# ============================================
REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

# ============================================
# JWT (CHANGE THESE!)
# ============================================
JWT_SECRET=YOUR_VERY_LONG_RANDOM_SECRET_KEY_MIN_32_CHARS
REFRESH_TOKEN_SECRET=YOUR_VERY_LONG_RANDOM_REFRESH_SECRET
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d

# ============================================
# CORS (Update with your domain)
# ============================================
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# ============================================
# AWS S3 (For file uploads)
# ============================================
AWS_ACCESS_KEY_ID=YOUR_AWS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET
AWS_REGION=ap-south-1
S3_BUCKET_NAME=swasthai-prod-files

# ============================================
# PAYMENTS (Stripe)
# ============================================
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ============================================
# EMAIL (SendGrid)
# ============================================
SENDGRID_API_KEY=SG.YOUR_SENDGRID_API_KEY
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# ============================================
# AI (OpenAI)
# ============================================
OPENAI_API_KEY=sk-YOUR_OPENAI_KEY

# ============================================
# MONITORING (Sentry)
# ============================================
SENTRY_DSN=https://YOUR_SENTRY_DSN
```

#### Step 1.3: Local Docker Compose Test
```powershell
# Navigate to project root
cd C:\Users\Rishabh\OneDrive\Desktop\Coding\SwasthAI

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Test endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/v1

# Access services:
# - API:        http://localhost:5000/api/v1
# - Frontend:   http://localhost:3000
# - Database:   http://localhost:5050 (pgadmin)
#   - Email: admin@swasthai.com
#   - Password: admin123
```

#### Step 1.4: Verify Database & Migrations
```powershell
# Access backend container
docker-compose exec backend /bin/sh

# Inside container:
npm run migrate  # Run Prisma migrations
npm run seed     # Seed database with sample data
```

---

### PHASE 2: CLOUD DEPLOYMENT (AWS Recommended)

#### Step 2.1: Prerequisites
- AWS Account (free tier available)
- AWS CLI installed
- Docker Hub account (or use ECR)

#### Step 2.2: Prepare Docker Images

**Build & Push to Docker Hub:**
```powershell
# Login to Docker Hub
docker login

# Build backend image
docker build -f backend/Dockerfile -t yourusername/swasthai-backend:latest .

# Build frontend image
docker build -f frontend/Dockerfile -t yourusername/swasthai-frontend:latest . `
  --build-arg VITE_API_BASE_URL=https://api.yourdomain.com

# Push images
docker push yourusername/swasthai-backend:latest
docker push yourusername/swasthai-frontend:latest
```

#### Step 2.3: AWS Setup

**A. Create VPC & Security Groups**
```bash
# Create custom VPC for SwasthAI
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create security group for ALB (Allow HTTP/HTTPS)
# Create security group for ECS (Allow traffic from ALB)
# Create security group for RDS (Allow PostgreSQL from ECS only)
```

**B. Create RDS PostgreSQL Database**
```bash
# Via AWS Console or CLI:
- Engine: PostgreSQL 15.x
- Multi-AZ: Yes (for HA)
- Storage: 20 GB with autoscaling
- Backup retention: 30 days
- Enable encryption at rest
- Create parameter group for optimization
```

**C. Create ElastiCache Redis**
```bash
# Via AWS Console:
- Engine: Redis 7.x
- Node type: cache.t3.micro (free tier eligible)
- Multi-AZ: Yes
- Automatic failover: Enabled
```

**D. Push Images to ECR**
```bash
# Create ECR repositories
aws ecr create-repository --repository-name swasthai-backend
aws ecr create-repository --repository-name swasthai-frontend

# Get login token
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin YOUR_ECR_URI

# Re-tag and push
docker tag yourusername/swasthai-backend:latest YOUR_ECR_URI/swasthai-backend:latest
docker push YOUR_ECR_URI/swasthai-backend:latest
```

**E. Create ECS Cluster**
```bash
# Create cluster
aws ecs create-cluster --cluster-name swasthai-prod

# Create task definitions for backend and frontend
# Update docker-compose.yml with ECR image URIs
```

**F. Setup Load Balancer & Auto Scaling**
```bash
# Create ALB
# Create target groups for backend (port 5000) and frontend (port 3000)
# Setup auto-scaling policies
```

---

### PHASE 3: PRODUCTION SETUP

#### Step 3.1: Domain & SSL Configuration
1. **Register Domain** (GoDaddy, Namecheap, Route53)
2. **Create AWS Certificate** (ACM) - Free SSL
3. **Create Route53 Records:**
   ```
   api.yourdomain.com  → ALB DNS Name
   yourdomain.com      → ALB DNS Name
   www.yourdomain.com  → ALB DNS Name
   ```

#### Step 3.2: Configure External Services

**A. AWS S3 for File Storage**
```bash
# Create S3 bucket
aws s3 mb s3://swasthai-prod-files

# Enable versioning
aws s3api put-bucket-versioning --bucket swasthai-prod-files \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption --bucket swasthai-prod-files \
  --server-side-encryption-configuration '{...}'
```

**B. Stripe Setup** (if using payments)
1. Create Stripe account
2. Get production API keys
3. Add webhook endpoint: `https://api.yourdomain.com/api/v1/webhooks/stripe`

**C. SendGrid Setup** (for emails)
1. Create SendGrid account
2. Add domain verification
3. Get API key

**D. OpenAI Setup** (for AI features)
1. Create OpenAI account
2. Generate API key
3. Set usage limits

---

### PHASE 4: MONITORING & LOGGING

#### Step 4.1: CloudWatch Monitoring
```bash
# Create CloudWatch alarms for:
# - CPU > 70%
# - Memory > 80%
# - HTTP 5xx errors > 5 in 5 minutes
# - Database connections high
# - Redis evictions occurring
```

#### Step 4.2: Setup Sentry (Error Tracking)
```bash
# Create Sentry project
# Add SENTRY_DSN to environment
# Configure alerts for critical errors
```

#### Step 4.3: Application Performance Monitoring
```bash
# Options:
# - DataDog
# - New Relic
# - AWS X-Ray
# - Elastic APM
```

---

## 📊 Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] SSL certificates valid
- [ ] DNS records pointed correctly
- [ ] Security groups properly configured
- [ ] Firewall rules in place
- [ ] Load balancer health checks passing
- [ ] Database migrations successful
- [ ] Static assets optimized and minified
- [ ] API rate limiting configured
- [ ] CORS origins whitelist updated
- [ ] CloudWatch alarms created
- [ ] Backup strategy documented
- [ ] Disaster recovery plan created
- [ ] Load testing completed

### Deployment
- [ ] Create database backup
- [ ] Deploy database migrations first
- [ ] Deploy backend services
- [ ] Deploy frontend services
- [ ] Run smoke tests
- [ ] Monitor error logs
- [ ] Check CloudWatch metrics
- [ ] Verify all endpoints accessible
- [ ] Test payment functionality
- [ ] Test file uploads
- [ ] Test email notifications
- [ ] Test AI features

### Post-Deployment
- [ ] Monitor for 24 hours
- [ ] Check error logs daily
- [ ] Review performance metrics
- [ ] Get user feedback
- [ ] Plan hotfixes if needed
- [ ] Document any issues
- [ ] Update runbook
- [ ] Schedule post-mortem if needed

---

## 🔒 Security Checklist

- [ ] Change all default credentials
- [ ] Enable HTTPS everywhere
- [ ] Implement HSTS headers
- [ ] Enable database encryption
- [ ] Setup VPC with private subnets
- [ ] Use security groups effectively
- [ ] Enable CloudTrail logging
- [ ] Implement WAF (Web Application Firewall)
- [ ] Regular security scans
- [ ] Implement backup encryption
- [ ] Rotate secrets regularly
- [ ] Setup DDoS protection
- [ ] Enable MFA for AWS accounts
- [ ] Implement API key rotation
- [ ] Regular penetration testing

---

## 📈 Performance Optimization

### Frontend
```javascript
// vite.config.js should include:
- Code splitting
- Image optimization
- Asset minification
- Lazy loading routes
- Service worker for offline
```

### Backend
```javascript
// Already configured:
- Compression middleware ✅
- Rate limiting ✅
- Helmet security headers ✅
- Connection pooling (Prisma) ✅

// Needs:
- Redis caching for queries
- Database query optimization
- CDN for static assets
- Image resizing on upload
```

### Database
```sql
-- Add these indexes:
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_appointment_user_id ON "Appointment"("userId");
CREATE INDEX idx_appointment_doctor_id ON "Appointment"("doctorId");
CREATE INDEX idx_health_record_user_id ON "HealthRecord"("userId");
-- etc.
```

---

## 🚀 Quick Deploy Commands

### Docker Compose (Local)
```powershell
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Clean everything (including volumes)
docker-compose down -v
```

### AWS ECS Deployment
```bash
# Deploy latest version
aws ecs update-service \
  --cluster swasthai-prod \
  --service swasthai-backend \
  --force-new-deployment

# Scale service
aws ecs update-service \
  --cluster swasthai-prod \
  --service swasthai-backend \
  --desired-count 3
```

---

## 📞 Support & Troubleshooting

### Common Issues

**1. Backend won't start**
```
Check:
- Docker running? (docker ps)
- Port 5000 available? (netstat -ano | findstr :5000)
- .env file exists and has DATABASE_URL?
- Database container healthy? (docker logs postgres)
```

**2. Frontend can't reach API**
```
Check:
- VITE_API_BASE_URL set correctly?
- CORS_ORIGIN includes frontend domain?
- Backend health endpoint responds? (curl http://localhost:5000/health)
- Network connectivity between containers?
```

**3. Database migration fails**
```
Check:
- PostgreSQL container running? (docker-compose ps postgres)
- DATABASE_URL correct format?
- Enough disk space?
- Run: docker-compose exec backend npm run migrate
```

**4. Redis connection error**
```
Check:
- Redis container running? (docker-compose ps redis)
- REDIS_URL correct? (redis://redis:6379)
- Redis logs: docker-compose logs redis
```

---

## 📚 Additional Resources

- **Docker Official Docs:** https://docs.docker.com
- **Prisma Deployment:** https://www.prisma.io/docs/concepts/components/prisma-client
- **AWS ECS Guide:** https://docs.aws.amazon.com/ecs/
- **Express.js Security:** https://expressjs.com/en/advanced/best-practice-security.html
- **React Performance:** https://react.dev/learn/performance

---

## 🎯 Recommended Next Steps

1. **Today:** Test locally with `docker-compose up -d`
2. **This Week:** Setup AWS account and RDS/ElastiCache
3. **Next Week:** Deploy to AWS ECS with ALB
4. **Later:** Setup CI/CD pipelines, monitoring, auto-scaling

---

**Last Updated:** December 30, 2025  
**Maintained By:** Your Team  
**Status:** Ready for Production
