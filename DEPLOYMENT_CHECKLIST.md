# SwasthAI - Production Deployment Checklist

**Date:** December 30, 2025  
**Status:** Pre-Deployment

---

## 📋 Pre-Deployment Preparation (1-2 Days Before)

### Infrastructure
- [ ] AWS Account created
- [ ] VPC configured with public/private subnets
- [ ] Security groups created (ALB, ECS, RDS, ElastiCache)
- [ ] IAM roles and policies configured
- [ ] SSH key pairs generated
- [ ] Route53 hosted zone created
- [ ] ACM SSL certificate requested/validated

### Database Setup
- [ ] RDS PostgreSQL instance created
- [ ] Database backup enabled (automated daily)
- [ ] Parameter groups configured
- [ ] Enhanced monitoring enabled
- [ ] Multi-AZ enabled
- [ ] Database users created with secure passwords
- [ ] Backup retention set to 30 days

### Cache Setup
- [ ] ElastiCache Redis cluster created
- [ ] Multi-AZ replication enabled
- [ ] Backup enabled
- [ ] Parameter groups optimized
- [ ] Subnet group created

### Services & APIs
- [ ] AWS S3 bucket created for file uploads
- [ ] Stripe production account setup
- [ ] Stripe webhook configured
- [ ] SendGrid account setup
- [ ] SendGrid API key validated
- [ ] OpenAI API key generated
- [ ] Sentry project created
- [ ] CloudWatch log groups created

### Documentation
- [ ] Database schema reviewed
- [ ] API documentation updated
- [ ] Deployment runbook created
- [ ] Incident response plan documented
- [ ] Backup and recovery plan documented
- [ ] Scaling policies documented

---

## 🔧 Pre-Deployment Configuration (24 Hours Before)

### Environment Variables
- [ ] `.env.production` created with all values
- [ ] JWT_SECRET is cryptographically secure (32+ chars)
- [ ] REFRESH_TOKEN_SECRET is unique (32+ chars)
- [ ] Database password meets complexity requirements
- [ ] Redis password is strong (20+ chars)
- [ ] All API keys validated (Stripe, SendGrid, OpenAI)
- [ ] CORS_ORIGIN updated with production domain
- [ ] No secrets committed to Git

### Docker & Container Images
- [ ] Backend Dockerfile tested locally
- [ ] Frontend Dockerfile tested locally
- [ ] Docker images built successfully
- [ ] Images scanned for vulnerabilities (optional)
- [ ] ECR repositories created
- [ ] Images pushed to ECR
- [ ] Image tags use semantic versioning

### Database Preparation
- [ ] Prisma migrations created
- [ ] Migration script tested locally
- [ ] Seed data prepared (if needed)
- [ ] Database indexes defined
- [ ] Query performance optimized
- [ ] Connection pooling configured

### Load Balancer Configuration
- [ ] ALB created
- [ ] Target groups configured (backend, frontend)
- [ ] Health check endpoints configured
- [ ] Listener rules created
- [ ] SSL certificate attached
- [ ] HTTP to HTTPS redirect configured

### Frontend Build
- [ ] Frontend optimized build created
- [ ] Assets minified and bundled
- [ ] Service worker configured (if using PWA)
- [ ] Environment variables baked into build
- [ ] Sitemap.xml created
- [ ] robots.txt configured

### Security
- [ ] SSL/TLS certificate installed
- [ ] Security headers configured in Nginx
- [ ] HSTS header enabled
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set
- [ ] WAF rules created (optional but recommended)
- [ ] Rate limiting configured
- [ ] CORS properly restricted

---

## 🚀 Deployment Day (Morning)

### Final Checks
- [ ] All services healthy in staging
- [ ] Database backup completed
- [ ] All logs cleared or archived
- [ ] Monitoring dashboards created
- [ ] Alert thresholds set
- [ ] Escalation procedures defined
- [ ] Team notified of deployment window

### Deployment Steps
- [ ] Stop any background jobs/cron tasks
- [ ] Create database backup
- [ ] Run final migrations on production database
- [ ] Deploy backend services
- [ ] Verify backend health endpoints
- [ ] Deploy frontend services
- [ ] Verify frontend is loading
- [ ] Run smoke tests (automated or manual)

### Verification Tests
- [ ] Homepage loads successfully
- [ ] User registration flow works
- [ ] User login flow works
- [ ] Doctor search functionality works
- [ ] Symptom checker working
- [ ] File uploads working (S3 integration)
- [ ] Payment flow working (Stripe)
- [ ] Email notifications sending
- [ ] API rate limiting working
- [ ] Database connections healthy

### Database Initialization (if needed)
- [ ] Sample doctors inserted
- [ ] Sample health articles created
- [ ] Lab tests configured
- [ ] Medicines database populated
- [ ] Forum categories created

---

## 📊 Post-Deployment (First Hour)

### Monitoring
- [ ] CloudWatch metrics normal
- [ ] No errors in CloudWatch logs
- [ ] Error rate below 0.1%
- [ ] API response times < 500ms
- [ ] Database CPU < 20%
- [ ] Memory usage normal
- [ ] Network throughput normal
- [ ] Sentry showing no critical errors

### User Acceptance
- [ ] Core features working for test users
- [ ] No 404 errors
- [ ] No 500 errors
- [ ] No CORS errors
- [ ] No authentication issues
- [ ] All external APIs responding

### Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Database query time < 100ms
- [ ] Cache hit rate > 70%
- [ ] No memory leaks visible

---

## 🔍 Post-Deployment (First Day)

### Extended Monitoring
- [ ] Monitor error logs for 24 hours
- [ ] Check CloudWatch metrics every hour
- [ ] Monitor Sentry for issues
- [ ] Review application logs
- [ ] Check database performance logs
- [ ] Monitor Redis memory usage

### User Reports
- [ ] No critical user reports
- [ ] Response times acceptable
- [ ] No data loss reported
- [ ] All integrations working
- [ ] No duplicate orders/charges

### Documentation
- [ ] Update deployment date in docs
- [ ] Document any issues encountered
- [ ] Create runbook entry
- [ ] Update status page
- [ ] Notify stakeholders

---

## 🔄 Post-Deployment (First Week)

### Performance Tuning
- [ ] Review slow query logs
- [ ] Add database indexes if needed
- [ ] Optimize N+1 queries
- [ ] Configure caching strategies
- [ ] Adjust auto-scaling policies
- [ ] Review CloudFront cache settings

### Security Review
- [ ] Review security logs
- [ ] Check for unauthorized access attempts
- [ ] Verify SSL certificate is valid
- [ ] Review CORS configurations
- [ ] Audit user permissions
- [ ] Check for exposed credentials (scan logs)

### Backup Verification
- [ ] Test database restore procedure
- [ ] Verify backups are encrypted
- [ ] Check backup retention policy
- [ ] Test S3 file recovery
- [ ] Document backup locations

### User Feedback
- [ ] Collect user feedback
- [ ] Address any issues reported
- [ ] Monitor support tickets
- [ ] Plan improvements based on feedback

---

## 📈 Ongoing Maintenance

### Weekly Tasks
- [ ] Review CloudWatch metrics
- [ ] Check error logs
- [ ] Monitor disk space usage
- [ ] Verify backups completed
- [ ] Check certificate expiration dates

### Monthly Tasks
- [ ] Performance review
- [ ] Security audit
- [ ] Dependency updates
- [ ] Database optimization
- [ ] Cost analysis

### Quarterly Tasks
- [ ] Disaster recovery drill
- [ ] Security penetration test
- [ ] Load testing
- [ ] Capacity planning review
- [ ] Architecture review

---

## 🆘 Rollback Plan

**If critical issues occur:**

1. **Immediate Actions:**
   - [ ] Stop traffic to new version
   - [ ] Revert DNS to previous load balancer (if applicable)
   - [ ] Restore previous database backup
   - [ ] Notify stakeholders

2. **Rollback Steps:**
   - [ ] Update ECS task definitions to previous version
   - [ ] Update services to use previous task definition
   - [ ] Wait for old containers to start
   - [ ] Verify services are healthy
   - [ ] Monitor for stability

3. **Post-Rollback:**
   - [ ] Document issues that led to rollback
   - [ ] Schedule post-mortem
   - [ ] Create issues for fixes needed
   - [ ] Plan re-deployment after fixes

---

## 📞 Emergency Contacts

- **AWS Support:** (if business/enterprise support enabled)
- **On-Call Engineer:** [Name/Contact]
- **DevOps Lead:** [Name/Contact]
- **Product Manager:** [Name/Contact]

---

## 📝 Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| DevOps Engineer | | | |
| Backend Lead | | | |
| Frontend Lead | | | |
| Product Manager | | | |
| QA Lead | | | |

---

**Notes:**

**Deployment Date:** _______________  
**Deployment Time:** _______________  
**Issues Encountered:** _______________  
**Resolution:** _______________  

---

**Version:** 1.0  
**Last Updated:** December 30, 2025  
**Next Review:** [Date]
