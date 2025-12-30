# SwasthAI Backend API

Complete Node.js/Express backend for the SwasthAI healthcare platform.

## 📋 Overview

The SwasthAI backend provides:

- ✅ RESTful API for healthcare services
- ✅ JWT-based authentication with refresh tokens
- ✅ PostgreSQL database with 11 core entities
- ✅ Redis caching for performance
- ✅ File upload to AWS S3
- ✅ Email notifications via SMTP
- ✅ SMS notifications via Twilio
- ✅ Payment processing integration (Stripe/Razorpay)
- ✅ Doctor & patient management
- ✅ Appointment booking system
- ✅ Health records management
- ✅ Medicine ordering
- ✅ Lab booking & results
- ✅ Health forum with posts & comments
- ✅ Rate limiting & security
- ✅ Comprehensive error handling
- ✅ Logging & monitoring

---

## 🚀 Quick Start (Using Docker)

### Prerequisites
- Docker & Docker Compose installed
- Windows, macOS, or Linux

### Setup

1. **Clone/Extract the repository**
   ```bash
   cd SwasthAI/backend
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Update .env with your values**
   ```bash
   # Essential variables to update:
   DB_PASSWORD=your_secure_password
   ACCESS_TOKEN_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   ```

4. **Start services**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database on port 5432
   - Redis cache on port 6379
   - Backend API on port 5000
   - Frontend on port 3000 (optional)
   - PgAdmin on port 5050 (optional)

5. **Verify services are running**
   ```bash
   # Check backend health
   curl http://localhost:5000/health
   
   # Expected response:
   # {"status":"OK","timestamp":"...","uptime":...}
   ```

6. **Access API**
   ```
   http://localhost:5000/api/v1
   ```

---

## 🔧 Local Setup (Without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Update database connection in .env**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=swasthai_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

4. **Create PostgreSQL database**
   ```bash
   createdb swasthai_db
   ```

5. **Run migrations**
   ```bash
   npm run migrate
   ```

6. **Seed sample data (optional)**
   ```bash
   npm run seed
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

   Server will be available at `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                 # Main Express app
│   ├── config/                # Configuration files
│   │   ├── database.js
│   │   └── auth.js
│   ├── models/                # Database models/schemas
│   ├── routes/                # API endpoints
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── doctors.routes.js
│   │   ├── appointments.routes.js
│   │   ├── health.routes.js
│   │   ├── medicines.routes.js
│   │   ├── lab.routes.js
│   │   └── forum.routes.js
│   ├── controllers/           # Business logic
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # JWT verification
│   │   ├── errorHandler.js   # Error handling
│   │   └── logger.js         # Logging
│   ├── services/             # Business services
│   ├── utils/                # Utility functions
│   ├── migrations/           # Database migrations
│   └── seeds/                # Sample data
├── logs/                      # Log files
├── .env.example              # Environment template
├── .env                      # Local environment (git-ignored)
├── package.json
├── Dockerfile
└── README.md
```

---

## 📚 API Endpoints

### Authentication (`/api/v1/auth`)
```
POST   /register                 # Register new user
POST   /login                    # Login user
POST   /logout                   # Logout
POST   /refresh                  # Refresh access token
POST   /forgot-password          # Request password reset
POST   /reset-password           # Reset password
POST   /verify-email             # Verify email
```

### Users (`/api/v1/users`)
```
GET    /:id                      # Get user profile
PUT    /:id                      # Update profile
DELETE /:id                      # Delete account
POST   /:id/photo                # Upload profile photo
GET    /:id/health-profile       # Get health profile
PUT    /:id/health-profile       # Update health profile
```

### Doctors (`/api/v1/doctors`)
```
GET    /                         # List all doctors
POST   /                         # Register as doctor
GET    /:id                      # Get doctor profile
PUT    /:id                      # Update doctor profile
GET    /:id/ratings              # Get doctor ratings
GET    /:id/availability         # Get availability slots
```

### Appointments (`/api/v1/appointments`)
```
GET    /                         # List user appointments
POST   /                         # Book appointment
GET    /:id                      # Get appointment details
PUT    /:id                      # Update appointment
DELETE /:id                      # Cancel appointment
POST   /:id/reschedule           # Reschedule appointment
```

### Health Records (`/api/v1/health`)
```
GET    /records                  # List health records
POST   /records                  # Upload record
GET    /records/:id              # Get record details
DELETE /records/:id              # Delete record
GET    /symptom-check            # Symptom checker
POST   /symptom-check            # Start symptom check
```

### Medicines (`/api/v1/medicines`)
```
GET    /orders                   # List medicine orders
POST   /orders                   # Place new order
GET    /orders/:id               # Get order details
PUT    /orders/:id               # Update order
DELETE /orders/:id               # Cancel order
GET    /list                     # Available medicines
```

### Lab (`/api/v1/lab`)
```
GET    /tests                    # List available tests
POST   /bookings                 # Book lab test
GET    /bookings                 # List user bookings
GET    /bookings/:id             # Get booking details
GET    /bookings/:id/report      # Get lab report
```

### Forum (`/api/v1/forum`)
```
GET    /posts                    # List forum posts
POST   /posts                    # Create post
GET    /posts/:id                # Get post details
PUT    /posts/:id                # Update post
DELETE /posts/:id                # Delete post
POST   /posts/:id/replies        # Reply to post
GET    /posts/:id/replies        # Get post replies
```

---

## 🔐 Authentication

### JWT Token Flow

1. **Register/Login**: Get `accessToken` and `refreshToken`
   ```javascript
   // Response:
   {
     "accessToken": "eyJhbGc...",
     "refreshToken": "eyJhbGc...",
     "user": { "id": 1, "email": "user@example.com" }
   }
   ```

2. **Use accessToken in headers**
   ```bash
   curl -H "Authorization: Bearer <accessToken>" \
        http://localhost:5000/api/v1/users/1
   ```

3. **Refresh token when expired**
   ```bash
   curl -X POST \
        -H "Content-Type: application/json" \
        -d '{"refreshToken": "<refreshToken>"}' \
        http://localhost:5000/api/v1/auth/refresh
   ```

### Token Expiry
- **Access Token**: 15 minutes (configurable)
- **Refresh Token**: 7 days (configurable)

---

## 🗄️ Database Schema

### Core Tables

**Users**
- id, uuid, email, password_hash, full_name
- age, gender, blood_group, date_of_birth
- address, city, state, country
- phone, abha_id, is_verified, is_active
- created_at, updated_at, last_login

**Doctors**
- id, uuid, user_id (FK)
- specialty, qualifications, experience_years
- license_number, clinic_name, clinic_address
- consultation_fee, supports_online_consultation
- average_rating, total_ratings

**Appointments**
- id, uuid, user_id (FK), doctor_id (FK)
- appointment_date, appointment_time
- consultation_type (online/offline)
- status, symptoms, chief_complaint
- meeting_link, cancellation_reason

**Health Records**
- id, uuid, user_id (FK), doctor_id (FK)
- record_type, title, description
- file_url, file_name, document_date
- is_verified, verified_by

**Medicine Orders**
- id, uuid, user_id (FK)
- total_amount, status
- medicines (JSONB), delivery_address
- prescription_file_url, payment_status

**Lab Bookings**
- id, uuid, user_id (FK)
- lab_name, booking_type
- tests (JSONB), total_amount
- appointment_date, collection_address
- report_url

**Forum Posts**
- id, uuid, user_id (FK)
- title, content, category
- upvotes, views, reply_count

**Forum Replies**
- id, uuid, post_id (FK), user_id (FK)
- content, upvotes, is_helpful

---

## 📧 Email Configuration

### Using Gmail
1. Enable 2-factor authentication
2. Generate app password: https://myaccount.google.com/apppasswords
3. Update `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

### Using SendGrid
1. Create SendGrid account
2. Generate API key
3. Update `.env`:
   ```env
   SENDGRID_API_KEY=SG.xxxx
   ```

---

## 📱 SMS Configuration (Twilio)

1. Create Twilio account: https://www.twilio.com
2. Get Account SID and Auth Token
3. Get a phone number
4. Update `.env`:
   ```env
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

---

## 💳 Payment Integration

### Stripe Setup
1. Create Stripe account
2. Get keys from dashboard
3. Update `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_xxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
   ```

### Razorpay Setup (India)
1. Create Razorpay account
2. Get Key ID and Secret
3. Update `.env`:
   ```env
   RAZORPAY_KEY_ID=xxxx
   RAZORPAY_KEY_SECRET=xxxx
   ```

---

## 📁 File Upload (AWS S3)

1. Create AWS account and S3 bucket
2. Create IAM user with S3 permissions
3. Update `.env`:
   ```env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_S3_BUCKET=swasthai-uploads
   ```

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

---

## 🐛 Debugging

### Enable Debug Logging
```bash
DEBUG=swasthai-* npm run dev
```

### Check Server Health
```bash
curl http://localhost:5000/health
```

### View Logs
```bash
# Real-time logs
docker-compose logs -f backend

# Or access log files
tail -f logs/combined.log
```

---

## 📊 Performance Monitoring

### Sentry Integration (Error Tracking)
1. Create Sentry account
2. Create project
3. Update `.env`:
   ```env
   SENTRY_DSN=https://key@sentry.io/project-id
   ```

### Redis Monitoring
```bash
# Connect to Redis
redis-cli

# Check memory usage
INFO memory

# Monitor commands
MONITOR
```

---

## 🚢 Deployment

### Deploy to Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create swasthai-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set ACCESS_TOKEN_SECRET=your_secret

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy to AWS
See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed AWS setup

### Deploy with Docker
```bash
# Build image
docker build -t swasthai-api:latest .

# Push to registry
docker tag swasthai-api:latest your-registry/swasthai-api:latest
docker push your-registry/swasthai-api:latest

# Deploy to container service
# AWS ECS, Google Cloud Run, or similar
```

---

## 🔒 Security Best Practices

✅ Use environment variables for secrets
✅ Enable HTTPS in production
✅ Implement rate limiting
✅ Validate all input
✅ Use parameterized queries
✅ Enable CORS selectively
✅ Hash passwords with bcrypt
✅ Use short-lived access tokens
✅ Rotate secrets regularly
✅ Monitor suspicious activity

---

## 📝 API Documentation

### Swagger/OpenAPI (Optional)
```bash
npm install swagger-jsdoc swagger-ui-express

# Then configure in app.js to see docs at:
# http://localhost:5000/api-docs
```

### Postman Collection
- Import `postman_collection.json` into Postman
- Pre-configured endpoints and environment

---

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Submit pull request

---

## 📄 License

MIT License - See LICENSE file

---

## 📞 Support

- Issues: Create GitHub issue
- Email: support@swasthai.com
- Documentation: See `/docs` folder

---

## 🎯 Next Steps

1. ✅ Backend API deployed
2. ⏭️ Connect frontend to backend endpoints
3. ⏭️ Set up database backups
4. ⏭️ Configure monitoring & alerts
5. ⏭️ Set up CI/CD pipeline
6. ⏭️ Deploy to production

---

**Happy coding! 🚀**
