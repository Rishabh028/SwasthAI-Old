# SwasthAI - Complete Backend & Infrastructure Setup Guide

## 📋 Executive Summary

Transform SwasthAI from frontend-only to a production-ready, fully-functional healthcare platform with complete backend, database, authentication, and deployment infrastructure.

---

## 🏗️ Part 1: Architecture Overview

### Current State
- ✅ Frontend: React + Vite (29 pages, fully functional)
- ❌ Backend: Using mock API (base44.com) - NOT PRODUCTION READY
- ❌ Database: No persistent storage
- ❌ Authentication: Mock JWT
- ❌ File Storage: No file handling
- ❌ Deployment: Not set up

### Target State
- ✅ Production-grade Node.js/Express backend
- ✅ PostgreSQL database with proper schema
- ✅ JWT authentication + OAuth2 support
- ✅ AWS S3/Firebase file storage
- ✅ Docker containerization
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Cloud deployment (AWS/Heroku)
- ✅ Monitoring & logging
- ✅ API documentation (Swagger)

---

## 🗂️ Part 2: Project Structure (Backend)

### Recommended File Structure

```
SwasthAI/
├── frontend/                      # Current React app
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/                       # NEW: Backend
│   ├── src/
│   │   ├── config/               # Configuration
│   │   │   ├── database.js
│   │   │   ├── auth.js
│   │   │   └── env.js
│   │   │
│   │   ├── models/               # Database models
│   │   │   ├── User.js
│   │   │   ├── Doctor.js
│   │   │   ├── Appointment.js
│   │   │   ├── HealthRecord.js
│   │   │   ├── MedicineOrder.js
│   │   │   ├── LabBooking.js
│   │   │   ├── ForumPost.js
│   │   │   └── ...
│   │   │
│   │   ├── routes/               # API endpoints
│   │   │   ├── auth.routes.js
│   │   │   ├── users.routes.js
│   │   │   ├── doctors.routes.js
│   │   │   ├── appointments.routes.js
│   │   │   ├── health.routes.js
│   │   │   ├── pharmacy.routes.js
│   │   │   ├── forum.routes.js
│   │   │   └── ...
│   │   │
│   │   ├── controllers/          # Business logic
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── doctorController.js
│   │   │   ├── appointmentController.js
│   │   │   └── ...
│   │   │
│   │   ├── middleware/           # Custom middleware
│   │   │   ├── auth.js           # JWT verification
│   │   │   ├── errorHandler.js
│   │   │   ├── validation.js
│   │   │   ├── rateLimit.js
│   │   │   └── cors.js
│   │   │
│   │   ├── services/             # Business logic layer
│   │   │   ├── emailService.js
│   │   │   ├── smsService.js
│   │   │   ├── fileService.js
│   │   │   ├── appointmentService.js
│   │   │   └── ...
│   │   │
│   │   ├── utils/                # Utilities
│   │   │   ├── validators.js
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   │
│   │   ├── migrations/           # Database migrations
│   │   │   ├── 001_initial_schema.js
│   │   │   ├── 002_add_tables.js
│   │   │   └── ...
│   │   │
│   │   └── app.js               # Main app file
│   │
│   ├── .env.example             # Environment template
│   ├── .env.local               # Local environment
│   ├── .env.production          # Production environment
│   ├── package.json
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
│
├── .github/
│   └── workflows/               # CI/CD
│       ├── test.yml
│       ├── deploy.yml
│       └── ...
│
├── docs/                         # Documentation
│   ├── API.md                    # API documentation
│   ├── DATABASE.md               # Database design
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── ARCHITECTURE.md           # Architecture overview
│   └── ...
│
└── docker-compose.yml            # Root docker compose
```

---

## 💾 Part 3: Database Design

### Technology: PostgreSQL

### Core Tables & Schema

#### 1. Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255),
  profile_photo_url TEXT,
  
  -- Profile info
  age INT,
  gender VARCHAR(20),
  blood_group VARCHAR(10),
  date_of_birth DATE,
  
  -- Contact
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  address TEXT,
  
  -- ABHA Health ID (India)
  abha_id VARCHAR(20) UNIQUE,
  abha_linked_at TIMESTAMP,
  
  -- Account status
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  verification_token VARCHAR(255),
  verification_token_expires TIMESTAMP,
  
  -- Password reset
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  
  -- Preferences
  language VARCHAR(20) DEFAULT 'english',
  notification_preferences JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  
  CONSTRAINT age_positive CHECK (age > 0 AND age < 150)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_uuid ON users(uuid);
```

#### 2. Doctors Table
```sql
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Professional info
  specialty VARCHAR(100) NOT NULL,
  qualifications TEXT,
  experience_years INT,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  registration_number VARCHAR(100),
  
  -- Clinic info
  clinic_name VARCHAR(255),
  clinic_address TEXT,
  clinic_phone VARCHAR(20),
  
  -- Consultation
  consultation_fee DECIMAL(10, 2),
  availability JSONB DEFAULT '{}', -- {mon: [{start: "09:00", end: "17:00"}]}
  
  -- Ratings
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_ratings INT DEFAULT 0,
  patient_count INT DEFAULT 0,
  
  -- Online consultation
  supports_online_consultation BOOLEAN DEFAULT TRUE,
  video_consultation_platform VARCHAR(50),
  
  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT experience_non_negative CHECK (experience_years >= 0),
  CONSTRAINT fee_positive CHECK (consultation_fee > 0)
);

CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_doctors_user_id ON doctors(user_id);
```

#### 3. Appointments Table
```sql
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id INT NOT NULL REFERENCES doctors(id) ON DELETE SET NULL,
  
  -- Appointment details
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INT DEFAULT 30,
  
  -- Type
  consultation_type VARCHAR(20) NOT NULL, -- 'online', 'offline'
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, rescheduled
  
  -- Patient info
  symptoms TEXT,
  chief_complaint VARCHAR(255),
  
  -- Meeting details (for online)
  meeting_link TEXT,
  meeting_id VARCHAR(100),
  
  -- Location (for offline)
  appointment_location TEXT,
  
  -- Cancellation
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scheduled_at TIMESTAMP,
  
  CONSTRAINT duration_positive CHECK (duration_minutes > 0)
);

CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
```

#### 4. Health Records Table
```sql
CREATE TABLE health_records (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Record type
  record_type VARCHAR(50), -- prescription, lab_report, doctor_note, discharge_summary, vaccination
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- File storage
  file_url TEXT,
  file_name VARCHAR(255),
  file_size INT,
  file_type VARCHAR(50),
  
  -- Related entities
  doctor_id INT REFERENCES doctors(id) ON DELETE SET NULL,
  appointment_id INT REFERENCES appointments(id) ON DELETE SET NULL,
  
  -- Metadata
  document_date DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by INT REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT file_size_positive CHECK (file_size > 0)
);

CREATE INDEX idx_health_records_user_id ON health_records(user_id);
CREATE INDEX idx_health_records_type ON health_records(record_type);
```

#### 5. Medicine Orders Table
```sql
CREATE TABLE medicine_orders (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Order details
  pharmacy_name VARCHAR(255),
  total_amount DECIMAL(10, 2) NOT NULL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, dispatched, delivered, cancelled
  
  -- Medicines (stored as JSONB)
  medicines JSONB NOT NULL, -- [{name, quantity, price, dosage}]
  
  -- Delivery
  delivery_address TEXT NOT NULL,
  expected_delivery_date DATE,
  delivery_notes TEXT,
  
  -- Prescription
  prescription_file_url TEXT,
  
  -- Payment
  payment_method VARCHAR(50),
  payment_status VARCHAR(50),
  payment_id VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  order_date DATE DEFAULT CURRENT_DATE,
  delivered_at TIMESTAMP
);

CREATE INDEX idx_medicine_orders_user_id ON medicine_orders(user_id);
CREATE INDEX idx_medicine_orders_status ON medicine_orders(status);
```

#### 6. Lab Bookings Table
```sql
CREATE TABLE lab_bookings (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Booking details
  lab_name VARCHAR(255),
  booking_type VARCHAR(50), -- 'home_collection', 'lab_visit'
  status VARCHAR(50) DEFAULT 'booked',
  
  -- Tests (stored as JSONB)
  tests JSONB NOT NULL, -- [{name, price, description}]
  total_amount DECIMAL(10, 2) NOT NULL,
  
  -- Schedule
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  
  -- Address/Location
  collection_address TEXT,
  
  -- Report
  report_url TEXT,
  report_ready_date TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_lab_bookings_user_id ON lab_bookings(user_id);
CREATE INDEX idx_lab_bookings_status ON lab_bookings(status);
```

#### 7. Forum Posts Table
```sql
CREATE TABLE forum_posts (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100), -- nutrition, fitness, mental-health, wellness, etc.
  
  -- Engagement
  upvotes INT DEFAULT 0,
  views INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  
  -- Moderation
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pinned_at TIMESTAMP
);

CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX idx_forum_posts_category ON forum_posts(category);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);
```

#### 8. Forum Replies Table
```sql
CREATE TABLE forum_replies (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
  post_id INT NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content
  content TEXT NOT NULL,
  
  -- Engagement
  upvotes INT DEFAULT 0,
  is_helpful BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX idx_forum_replies_user_id ON forum_replies(user_id);
```

#### 9. Health Profile Table
```sql
CREATE TABLE health_profiles (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Medical conditions
  conditions JSONB DEFAULT '[]', -- [diabetes, hypertension, ...]
  allergies JSONB DEFAULT '[]',  -- [penicillin, peanuts, ...]
  medications JSONB DEFAULT '[]', -- [{name, dosage, frequency}]
  
  -- Vital signs (latest)
  height_cm DECIMAL(5, 2),
  weight_kg DECIMAL(5, 2),
  blood_pressure_systolic INT,
  blood_pressure_diastolic INT,
  last_vital_signs_update TIMESTAMP,
  
  -- Medical notes
  medical_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_profiles_user_id ON health_profiles(user_id);
```

#### 10. Symptom Checks Table
```sql
CREATE TABLE symptom_checks (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Input
  symptoms JSONB NOT NULL, -- [symptom1, symptom2, ...]
  
  -- AI Assessment
  assessment_result JSONB, -- {severity, recommendations, conditions}
  severity VARCHAR(50), -- mild, moderate, severe
  
  -- Follow-up questions
  follow_up_answers JSONB DEFAULT '{}',
  
  -- Status
  completed BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_symptom_checks_user_id ON symptom_checks(user_id);
CREATE INDEX idx_symptom_checks_created_at ON symptom_checks(created_at DESC);
```

#### 11. Ratings Table
```sql
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id INT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id INT REFERENCES appointments(id) ON DELETE SET NULL,
  
  -- Rating
  rating INT NOT NULL,
  review TEXT,
  
  -- Verification
  is_verified BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT rating_valid CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT unique_user_doctor_rating UNIQUE(user_id, doctor_id)
);

CREATE INDEX idx_ratings_doctor_id ON ratings(doctor_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
```

---

## 🔐 Part 4: Authentication & Security

### JWT Authentication Flow

```javascript
// Backend: auth.middleware.js
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

### Environment Variables Template (.env)

```env
# Server
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=swasthai_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT
ACCESS_TOKEN_SECRET=your_jwt_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# OAuth (Google, GitHub, etc.)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=swasthai-uploads

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@swasthai.com

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Encryption
ENCRYPTION_KEY=your_encryption_key_here

# API Keys
PAYMENT_GATEWAY_KEY=your_payment_key
PAYMENT_GATEWAY_SECRET=your_payment_secret

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:3000,https://swasthai.com
```

---

## 📡 Part 5: API Endpoints Structure

### Authentication Endpoints
```
POST   /api/v1/auth/register           - Register new user
POST   /api/v1/auth/login              - Login user
POST   /api/v1/auth/logout             - Logout user
POST   /api/v1/auth/refresh            - Refresh access token
POST   /api/v1/auth/forgot-password    - Request password reset
POST   /api/v1/auth/reset-password     - Reset password
POST   /api/v1/auth/verify-email       - Verify email
GET    /api/v1/auth/me                 - Get current user
```

### User Endpoints
```
GET    /api/v1/users/:id               - Get user profile
PUT    /api/v1/users/:id               - Update user profile
DELETE /api/v1/users/:id               - Delete account
POST   /api/v1/users/:id/photo         - Upload profile photo
GET    /api/v1/users/:id/health-profile - Get health profile
PUT    /api/v1/users/:id/health-profile - Update health profile
```

### Doctor Endpoints
```
GET    /api/v1/doctors                 - List doctors (with filters)
GET    /api/v1/doctors/:id             - Get doctor details
POST   /api/v1/doctors                 - Register as doctor
PUT    /api/v1/doctors/:id             - Update doctor profile
GET    /api/v1/doctors/:id/ratings     - Get doctor ratings
GET    /api/v1/doctors/:id/availability - Get availability
```

### Appointment Endpoints
```
GET    /api/v1/appointments            - List user appointments
POST   /api/v1/appointments            - Book appointment
GET    /api/v1/appointments/:id        - Get appointment details
PUT    /api/v1/appointments/:id        - Update appointment
DELETE /api/v1/appointments/:id        - Cancel appointment
POST   /api/v1/appointments/:id/reschedule - Reschedule
GET    /api/v1/appointments/:id/meeting-link - Get meeting link
```

### Health Records Endpoints
```
GET    /api/v1/health-records          - List user records
POST   /api/v1/health-records          - Upload record
GET    /api/v1/health-records/:id      - Get record details
DELETE /api/v1/health-records/:id      - Delete record
GET    /api/v1/health-records/:id/download - Download file
```

### Medicine Endpoints
```
GET    /api/v1/medicines               - List medicines
POST   /api/v1/medicine-orders         - Place order
GET    /api/v1/medicine-orders         - List user orders
GET    /api/v1/medicine-orders/:id     - Get order details
PUT    /api/v1/medicine-orders/:id     - Update order
DELETE /api/v1/medicine-orders/:id     - Cancel order
```

### Lab Endpoints
```
GET    /api/v1/lab-tests               - List available tests
POST   /api/v1/lab-bookings            - Book lab test
GET    /api/v1/lab-bookings            - List user bookings
GET    /api/v1/lab-bookings/:id        - Get booking details
GET    /api/v1/lab-bookings/:id/report - Get lab report
```

### Forum Endpoints
```
GET    /api/v1/forum/posts             - List posts
POST   /api/v1/forum/posts             - Create post
GET    /api/v1/forum/posts/:id         - Get post details
PUT    /api/v1/forum/posts/:id         - Update post
DELETE /api/v1/forum/posts/:id         - Delete post
POST   /api/v1/forum/posts/:id/upvote  - Upvote post
POST   /api/v1/forum/posts/:id/replies - Reply to post
GET    /api/v1/forum/posts/:id/replies - Get replies
```

---

## 🐳 Part 6: Docker & Containerization

### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src
COPY .env.production .env

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start app
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: swasthai-db
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: swasthai-cache
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: swasthai-api
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_URL: redis://redis:6379
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend/src:/app/src
    command: npm run dev

  frontend:
    build: ./frontend
    container_name: swasthai-web
    ports:
      - "3000:5173"
    depends_on:
      - backend
    environment:
      VITE_API_BASE_URL: http://localhost:5000

volumes:
  postgres-data:
  redis-data:
```

---

## 🚀 Part 7: Deployment Options

### Option 1: AWS Deployment (Recommended)

**Architecture:**
- EC2 for backend
- RDS for PostgreSQL
- ElastiCache for Redis
- S3 for file storage
- CloudFront for CDN
- ALB for load balancing

**Steps:**
1. Create RDS PostgreSQL instance
2. Create EC2 instance (Ubuntu 20.04)
3. Install Node.js, Docker
4. Clone repository and set up environment
5. Create S3 bucket for uploads
6. Configure CloudFront CDN
7. Set up auto-scaling group

### Option 2: Heroku Deployment (Easiest)

**Steps:**
1. Create Heroku account
2. Add Heroku Postgres addon
3. Deploy backend: `git push heroku main`
4. Deploy frontend to Vercel

### Option 3: DigitalOcean Deployment (Best Value)

**Steps:**
1. Create Droplet (Ubuntu 20.04, 2GB RAM)
2. Install Docker & Docker Compose
3. Create PostgreSQL database
4. Clone and run docker-compose
5. Set up Nginx reverse proxy
6. Configure SSL with Let's Encrypt

---

## ✅ Part 8: Development Checklist

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up Node.js/Express project
- [ ] Configure PostgreSQL database
- [ ] Implement database schema
- [ ] Create authentication system
- [ ] Set up JWT tokens
- [ ] Implement basic error handling

### Phase 2: Core APIs (Weeks 3-4)
- [ ] User management APIs
- [ ] Doctor registration & listing
- [ ] Appointment booking system
- [ ] Health records upload
- [ ] Medicine ordering system
- [ ] Lab booking system

### Phase 3: Advanced Features (Weeks 5-6)
- [ ] Forum post/reply system
- [ ] Rating & reviews system
- [ ] File storage (S3)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Payment gateway integration

### Phase 4: DevOps & Deployment (Weeks 7-8)
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Database migrations
- [ ] Environment configuration
- [ ] Monitoring & logging
- [ ] Security hardening

### Phase 5: Testing & QA (Weeks 9-10)
- [ ] Unit testing
- [ ] Integration testing
- [ ] Load testing
- [ ] Security testing
- [ ] Performance optimization

### Phase 6: Deployment & Launch (Week 11+)
- [ ] Production deployment
- [ ] DNS configuration
- [ ] SSL certificates
- [ ] Monitoring setup
- [ ] Backup strategy

---

## 📚 Next Steps

1. **Choose backend stack**: Node.js/Express is recommended for quick development
2. **Set up database**: PostgreSQL with pgAdmin for management
3. **Implement authentication**: JWT with refresh tokens
4. **Create core APIs**: Start with user, doctor, appointment endpoints
5. **Add file storage**: AWS S3 or Firebase Storage
6. **Set up CI/CD**: GitHub Actions for automated testing/deployment
7. **Deploy to cloud**: Choose hosting provider (AWS/Heroku/DigitalOcean)
8. **Add monitoring**: Sentry for errors, DataDog for performance
9. **Scale as needed**: Add caching, load balancing, etc.

---

## 🔗 Recommended Tools & Services

| Category | Tool | Purpose |
|----------|------|---------|
| **Backend** | Node.js + Express | REST API |
| **Database** | PostgreSQL | Primary database |
| **Caching** | Redis | Session & caching |
| **File Storage** | AWS S3 | Document storage |
| **Email** | SendGrid | Email service |
| **SMS** | Twilio | SMS notifications |
| **Payment** | Stripe/Razorpay | Payment processing |
| **Auth** | Auth0 | OAuth management |
| **Monitoring** | Sentry | Error tracking |
| **Logging** | LogRocket | User session logs |
| **CDN** | CloudFront | Static asset delivery |
| **Hosting** | AWS/Heroku | Server hosting |

---

This comprehensive guide will help you build a production-ready SwasthAI backend. Start with Phase 1 and progress systematically through each phase for a stable, scalable platform.
