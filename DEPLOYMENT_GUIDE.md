# SwasthAI - Deployment & DevOps Guide

Complete guide for deploying SwasthAI to production with CI/CD, monitoring, and scaling.

---

## 🚀 Part 1: GitHub Actions CI/CD Pipeline

### Test Workflow (`.github/workflows/test.yml`)

```yaml
name: Run Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: swasthai_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd backend
          npm ci

      - name: Run linter
        run: |
          cd backend
          npm run lint

      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/swasthai_test
          REDIS_URL: redis://localhost:6379
          NODE_ENV: test
        run: |
          cd backend
          npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info
```

### Deploy Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha
            type=semver,pattern={{version}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./backend/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to AWS
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          # Deploy commands here
          echo "Deploying to production..."
```

---

## 🌐 Part 2: AWS Deployment Architecture

### Recommended AWS Stack

```
┌─────────────────────────────────────────────────────┐
│                 CloudFront (CDN)                     │
│              (Static Assets, API Cache)              │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              Application Load Balancer               │
│               (HTTPS, Route53 DNS)                   │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│         EC2 Auto Scaling Group                       │
│    (Backend API Instances - Min: 2, Max: 10)        │
│          (Runs Docker Containers)                   │
└─────────────────────────────────────────────────────┘
         ↓                          ↓
┌────────────────────┐    ┌────────────────────┐
│  RDS PostgreSQL    │    │  ElastiCache       │
│   (Multi-AZ)       │    │     (Redis)        │
└────────────────────┘    └────────────────────┘
         ↓
┌────────────────────┐
│   S3 (File Store)  │
│                    │
└────────────────────┘
```

### AWS Setup Steps

#### 1. Create VPC & Network
```bash
# 1. Create VPC
# 2. Create public subnets (2+ AZs)
# 3. Create private subnets (2+ AZs)
# 4. Setup NAT Gateway
# 5. Create Internet Gateway
```

#### 2. Create RDS PostgreSQL
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier swasthai-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password your_secure_password \
  --allocated-storage 20 \
  --multi-az \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00"
```

#### 3. Create ElastiCache Redis
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id swasthai-cache \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --auto-failover-enabled
```

#### 4. Create S3 Bucket for File Storage
```bash
aws s3 mb s3://swasthai-uploads-prod \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket swasthai-uploads-prod \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket swasthai-uploads-prod \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

#### 5. Create ECR Repository
```bash
aws ecr create-repository \
  --repository-name swasthai-api \
  --region us-east-1
```

#### 6. Create IAM Role for EC2
```bash
# Create role
aws iam create-role \
  --role-name SwasthAIEC2Role \
  --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name SwasthAIEC2Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly

aws iam attach-role-policy \
  --role-name SwasthAIEC2Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
```

#### 7. Create EC2 Launch Template
```bash
# Create launch template with Docker pre-installed
aws ec2 create-launch-template \
  --launch-template-name swasthai-api-template \
  --version-description "SwasthAI API Server" \
  --launch-template-data file://launch-template.json
```

#### 8. Create Application Load Balancer
```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name swasthai-alb \
  --subnets subnet-1234 subnet-5678 \
  --security-groups sg-1234567 \
  --scheme internet-facing \
  --type application

# Create target group
aws elbv2 create-target-group \
  --name swasthai-api-targets \
  --protocol HTTP \
  --port 5000 \
  --vpc-id vpc-1234567

# Register health check
aws elbv2 modify-target-group \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --health-check-protocol HTTP \
  --health-check-path /health \
  --health-check-interval-seconds 30
```

#### 9. Create Auto Scaling Group
```bash
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name swasthai-api-asg \
  --launch-template LaunchTemplateName=swasthai-api-template,Version=\$Latest \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --default-cooldown 300 \
  --health-check-type ELB \
  --health-check-grace-period 300 \
  --vpc-zone-identifier "subnet-1234,subnet-5678"
```

---

## 🐳 Part 3: Docker & Container Management

### Build Docker Image
```bash
# Build image
docker build -t swasthai-api:1.0.0 -f backend/Dockerfile .

# Tag for ECR
docker tag swasthai-api:1.0.0 123456789.dkr.ecr.us-east-1.amazonaws.com/swasthai-api:1.0.0

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Push to ECR
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/swasthai-api:1.0.0
```

### Docker Compose for Local Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```

---

## 📊 Part 4: Monitoring & Logging

### CloudWatch Configuration

**Setup Logs**
```yaml
# /etc/awslogs/config/swasthai.conf
[swasthai-api]
log_group_name = /aws/ec2/swasthai-api
log_stream_name = {instance_id}
file = /app/logs/combined.log
datetime_format = %Y-%m-%d %H:%M:%S
multi_line_start_pattern = {datetime_format}
initial_file_pos = start_of_file
log_region = us-east-1
```

**Metrics to Monitor**
```
- CPU Utilization (> 70% = Scale Up)
- Memory Usage (> 80% = Alert)
- Disk Space (< 10% free = Alert)
- Network In/Out
- Request Count
- Response Time (p99)
- Error Rate (> 1% = Alert)
- Database Connections
- Redis Memory Usage
```

### Set up CloudWatch Alarms

```bash
# CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name SwasthAI-High-CPU \
  --alarm-description "Alert when CPU > 70%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 70 \
  --comparison-operator GreaterThanThreshold

# Error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name SwasthAI-High-Errors \
  --alarm-description "Alert when error rate > 1%" \
  --metric-name ErrorRate \
  --namespace SwasthAI \
  --statistic Average \
  --period 60 \
  --threshold 1 \
  --comparison-operator GreaterThanThreshold
```

### Application Performance Monitoring (APM)

**Using DataDog**
```bash
# Install DataDog agent on EC2
DD_AGENT_MAJOR_VERSION=7 \
DD_API_KEY=your_api_key \
DD_SITE=datadoghq.com \
bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_agent.sh)"
```

**Using Sentry for Error Tracking**
```javascript
// Already configured in app.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## 🔐 Part 5: Security Hardening

### SSL/TLS with AWS Certificate Manager

```bash
# Create certificate
aws acm request-certificate \
  --domain-name swasthai.com \
  --subject-alternative-names www.swasthai.com api.swasthai.com \
  --validation-method DNS

# Attach to ALB
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=...
```

### WAF (Web Application Firewall)

```bash
# Create WAF Web ACL
aws wafv2 create-web-acl \
  --name swasthai-waf \
  --scope REGIONAL \
  --default-action Block={} \
  --rules file://waf-rules.json \
  --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=swasthai-waf
```

### Security Group Configuration

```bash
# Create security group
aws ec2 create-security-group \
  --group-name swasthai-api-sg \
  --description "SwasthAI API Security Group"

# Allow HTTPS from ALB
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxx \
  --protocol tcp \
  --port 443 \
  --source-group sg-alb

# Allow database access from EC2
aws ec2 authorize-security-group-ingress \
  --group-id sg-db \
  --protocol tcp \
  --port 5432 \
  --source-group sg-xxx
```

---

## 🔄 Part 6: Database Backups & Disaster Recovery

### Automated RDS Backups

```bash
# Enable automatic backups (already set in create command)
aws rds modify-db-instance \
  --db-instance-identifier swasthai-db \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00" \
  --apply-immediately
```

### Manual Snapshot

```bash
aws rds create-db-snapshot \
  --db-instance-identifier swasthai-db \
  --db-snapshot-identifier swasthai-db-snapshot-$(date +%Y%m%d)
```

### Point-in-Time Restore

```bash
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier swasthai-db-restored \
  --db-snapshot-identifier swasthai-db-snapshot-20240101
```

---

## 📈 Part 7: Scaling Strategy

### Horizontal Scaling (Add More Servers)

```bash
# Update Auto Scaling Group
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name swasthai-api-asg \
  --desired-capacity 5

# Create scale-up policy
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name swasthai-api-asg \
  --policy-name scale-up \
  --scaling-adjustment 2 \
  --adjustment-type ChangeInCapacity \
  --cooldown 300
```

### Vertical Scaling (Bigger Servers)

```bash
# Update EC2 instance type
aws ec2 stop-instances --instance-ids i-1234567890abcdef0
aws ec2 modify-instance-attribute \
  --instance-id i-1234567890abcdef0 \
  --instance-type "{\"Value\": \"t3.medium\"}"
aws ec2 start-instances --instance-ids i-1234567890abcdef0
```

### Database Scaling

```bash
# Upgrade RDS instance
aws rds modify-db-instance \
  --db-instance-identifier swasthai-db \
  --db-instance-class db.t3.small \
  --apply-immediately

# Enable read replicas
aws rds create-db-instance-read-replica \
  --db-instance-identifier swasthai-db-read-replica \
  --source-db-instance-identifier swasthai-db
```

---

## 💰 Part 8: Cost Optimization

### Cost Monitoring

```bash
# Set up AWS Budgets alert
aws budgets create-budget \
  --account-id 123456789 \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

### Cost Reduction Tips

1. **Use Reserved Instances** (30-70% discount)
   ```bash
   aws ec2 purchase-reserved-instances-offering \
     --reserved-instances-offering-id xxxxx \
     --instance-count 2
   ```

2. **Enable Auto-Scaling** (pay only for what you use)
3. **Use S3 Intelligent-Tiering** (automatic cost optimization)
4. **Enable Data Transfer Optimization** (CloudFront, VPC endpoints)
5. **Rightsize instances** (monitor and downsize over-provisioned)
6. **Schedule non-production shutdowns** (development/staging)

---

## 📋 Deployment Checklist

- [ ] Database backups configured
- [ ] SSL/TLS certificates installed
- [ ] WAF rules deployed
- [ ] CloudWatch monitoring enabled
- [ ] Sentry error tracking active
- [ ] Auto-scaling policies configured
- [ ] Load balancer health checks working
- [ ] Security groups properly configured
- [ ] VPC network setup complete
- [ ] IAM roles and policies assigned
- [ ] Environment variables configured
- [ ] CloudFront CDN enabled
- [ ] DNS records updated (Route53)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] API documentation live
- [ ] Team access configured
- [ ] Incident response plan ready

---

## 🚨 Incident Response Plan

### If Backend is Down
1. Check CloudWatch metrics and logs
2. Review recent deployments
3. Check RDS/Redis status
4. Rollback if needed: `git revert <commit>`
5. Redeploy: `git push heroku main`
6. Notify users on status page

### If Database is Down
1. Check RDS dashboard
2. Check security groups (port 5432 open?)
3. Check connection pool limits
4. Kill long-running queries if needed
5. Restore from snapshot if corrupted

### If S3 Upload Failing
1. Check IAM permissions
2. Check bucket exists and is accessible
3. Check CORS configuration
4. Check file size limits

---

## 📞 Support

- Documentation: `/docs/DEPLOYMENT.md`
- Issues: GitHub Issues
- Slack: #deployment channel
- Email: devops@swasthai.com

---

**Deployment ready! 🚀**
