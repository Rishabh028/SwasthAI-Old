# 🚀 COMPREHENSIVE AI PROMPT: SwasthAI Advanced Healthcare Platform

## Complete Project Specification & Build Instructions

---

## 📌 EXECUTIVE PROJECT BRIEF

**Project Name:** SwasthAI - Advanced Digital Healthcare Platform  
**Current Status:** Frontend 95% complete (29 pages), Backend ready for implementation  
**Objective:** Build a world-class, feature-rich, fully-animated healthcare platform with advanced features  
**Timeline:** Production-ready in 12 weeks  
**Target Users:** 100M+ Indians seeking accessible healthcare  

---

## 🎯 PROJECT SCOPE & VISION

### What is SwasthAI?
A comprehensive digital health platform providing:
- AI-powered symptom checking and health coaching
- Doctor appointment booking and telemedicine
- Medicine ordering from partnered pharmacies
- Lab test booking and home collection
- Health records management and sharing
- Community health forum
- Personalized health insights and recommendations
- ABHA (Ayushman Bharat Health Account) integration

### Success Definition
- ✅ 50+ pages (desktop + mobile optimized)
- ✅ Advanced animations (smooth, professional, engaging)
- ✅ Production-grade backend with 50+ endpoints
- ✅ PostgreSQL database with complete schema
- ✅ Real-time notifications and updates
- ✅ Payment processing (Stripe/Razorpay)
- ✅ File storage and management
- ✅ Analytics and reporting
- ✅ Admin dashboard
- ✅ Mobile app ready (React Native)

---

## 🏗️ ARCHITECTURE OVERVIEW

### Technology Stack (Complete)

#### Frontend (React + Advanced Features)
```
Core Framework:
  - React 18.2.0 (latest with concurrent features)
  - Vite 5.0.0 (ultra-fast build)
  - TypeScript 5.3+ (for type safety)
  - Tailwind CSS 3.4.0 (utility-first styling)
  - shadcn/ui (component library)

State Management:
  - TanStack React Query 5.25+ (server state)
  - Zustand 4.4+ (client state)
  - React Context (local state)

Routing & Navigation:
  - React Router DOM 6.20+
  - TanStack Router (advanced routing)

Animations & Effects:
  - Framer Motion 10.16+ (advanced animations)
  - GSAP 3.12+ (high-performance animations)
  - React Spring 9.7+ (physics-based animations)
  - Lottie React (complex animations)
  - Three.js + React Three Fiber (3D graphics)

Forms & Validation:
  - React Hook Form 7.48+
  - Zod 3.22+ (runtime validation)
  - Headless UI (unstyled components)

Charts & Visualization:
  - Recharts 2.10+ (React charts)
  - Chart.js 4.4+ (advanced charts)
  - D3.js 7.8+ (data visualization)
  - Nivo Charts (beautiful charts)

Real-time Communication:
  - Socket.io Client 4.5+ (real-time updates)
  - Firebase Realtime DB (alternative)
  - GraphQL Subscriptions (alternative)

File Handling:
  - react-dropzone (drag-drop uploads)
  - FileSaver.js (file downloads)
  - pdfjs-dist (PDF viewing)

Authentication:
  - jose (JWT handling)
  - js-cookie (cookie management)
  - OAuth2 libraries (Google, GitHub)

APIs & HTTP:
  - Axios 1.6+ (HTTP client)
  - SWR (data fetching)

Performance & SEO:
  - react-helmet-async (SEO)
  - next-i18next (internationalization)
  - Bundle analyzer

Development:
  - Storybook 7.0+ (component development)
  - Vitest (unit testing)
  - Playwright (E2E testing)
  - ESLint + Prettier (code quality)

Utilities:
  - date-fns (date handling)
  - lodash-es (utility functions)
  - clsx (className management)
  - uuid (unique IDs)
```

#### Backend (Node.js + Advanced Features)
```
Core Framework:
  - Node.js 18+ (runtime)
  - Express.js 4.18+ (REST API)
  - TypeScript 5.3+ (type safety)
  - Fastify 4.24+ (high-performance alternative)

Database:
  - PostgreSQL 15+ (primary database)
  - Redis 7+ (caching & sessions)
  - Elasticsearch 8+ (advanced search)
  - MongoDB 6+ (optional - flexible schema)

ORMs & Query Builders:
  - Prisma 5.7+ (modern ORM)
  - TypeORM 0.3+ (traditional ORM)
  - Sequelize 6.35+ (alternative)

Authentication & Security:
  - jsonwebtoken (JWT)
  - bcryptjs (password hashing)
  - passport.js (OAuth)
  - helmet.js (security headers)
  - express-validator (input validation)
  - joi (schema validation)

File Storage & Processing:
  - aws-sdk (AWS S3)
  - multer (file uploads)
  - sharp (image processing)
  - pdf-parse (PDF processing)
  - uuid (unique file IDs)

Real-time Features:
  - socket.io (WebSockets)
  - bull (job queues)
  - node-cron (scheduled tasks)

Notifications:
  - nodemailer (email)
  - twilio (SMS)
  - firebase-admin (push notifications)
  - web-push (web notifications)

Payment Processing:
  - stripe (payment gateway)
  - razorpay (Indian payments)

Monitoring & Logging:
  - winston (logging)
  - morgan (HTTP logging)
  - sentry (error tracking)
  - datadog (monitoring)
  - prometheus (metrics)

Testing:
  - jest (unit testing)
  - supertest (API testing)
  - testcontainers (integration tests)

Development:
  - nodemon (hot reload)
  - ts-node (TypeScript execution)
  - dotenv (environment variables)

APIs & Integrations:
  - axios (HTTP client)
  - graphql (alternative to REST)
  - apollo-server (GraphQL server)
```

#### DevOps & Infrastructure
```
Containerization:
  - Docker (containerization)
  - Docker Compose (local dev)

Orchestration:
  - Kubernetes (scaling)
  - AWS ECS (container orchestration)

Cloud Platform:
  - AWS (primary)
    - EC2 (compute)
    - RDS (database)
    - ElastiCache (Redis)
    - S3 (file storage)
    - CloudFront (CDN)
    - Lambda (serverless)
    - SQS/SNS (messaging)
    - EventBridge (event bus)
    - CloudWatch (monitoring)
    - VPC & Security Groups
    - IAM (access control)
  
  - Alternative:
    - GCP (Google Cloud)
    - Azure (Microsoft)
    - Heroku (PaaS)
    - DigitalOcean (VPS)

CI/CD Pipeline:
  - GitHub Actions (CI/CD)
  - Jenkins (alternative)
  - GitLab CI (alternative)

Monitoring & Logging:
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - DataDog
  - New Relic
  - Grafana

CDN & Caching:
  - CloudFront (AWS CDN)
  - Cloudflare
  - Redis (application caching)

Reverse Proxy & Load Balancing:
  - Nginx
  - AWS ALB (Application Load Balancer)

API Gateway:
  - Kong
  - AWS API Gateway
  - Traefik
```

---

## 📱 COMPLETE FEATURE LIST

### Current Features (Implemented ✅)
1. **Home Dashboard** - Overview, quick actions, upcoming appointments
2. **Symptom Checker** - AI-powered symptom assessment with recommendations
3. **Find Doctors** - Search, filter, map view, availability
4. **Doctor Profile** - Detailed info, ratings, availability booking
5. **Appointments** - Booking, management, cancellation, rescheduling
6. **Health Records** - Upload, organize, download, share
7. **Pharmacy** - Medicine search, ordering, cart management
8. **Lab Booking** - Test selection, home/lab collection, reports
9. **Health Forum** - Posts, comments, discussions, upvotes
10. **Health Articles** - Browse, read, save, comments
11. **Health Coach** - AI chat, personalized recommendations
12. **Profile Management** - User info, health data, preferences
13. **Medical History** - Conditions, allergies, medications
14. **ABHA Integration** - Health ID linking
15. **Notifications** - Reminders, updates, alerts
16. **Settings** - Language, notifications, privacy

### Advanced Features To Add (New 🚀)

#### A. AI & Analytics
1. **Predictive Health Analytics**
   - Risk assessment based on health data
   - Preventive care recommendations
   - Health trend predictions
   - Personalized wellness plans

2. **Advanced AI Symptom Checker**
   - Multi-language support
   - Voice input with speech recognition
   - Image upload for skin conditions
   - Real-time severity assessment
   - Specialist recommendations

3. **Health Insights Dashboard**
   - Personalized health score
   - Activity tracking
   - Sleep analysis
   - Nutrition tracking
   - Fitness recommendations

4. **AI-Powered Health Coaching**
   - Daily wellness tips
   - Medication reminders
   - Exercise guidance
   - Diet recommendations
   - Stress management

#### B. Telemedicine & Video Consultation
1. **Video Consultation Platform**
   - Real-time video/audio with doctors
   - Screen sharing for medical records
   - Prescription generation
   - Recording (with consent)
   - Waiting room system

2. **Appointment Scheduling**
   - Calendar availability
   - Automated reminders
   - Rescheduling options
   - Cancellation policies
   - Follow-up scheduling

3. **Prescription Management**
   - Digital prescriptions
   - QR code scanning
   - Pharmacy integration
   - Refill reminders
   - Interaction warnings

#### C. Health Records & Data Management
1. **Comprehensive Health Records**
   - DICOM viewer (X-ray, CT, MRI)
   - Lab report organization
   - Doctor notes
   - Vaccination records
   - Allergy alerts

2. **ABHA Integration**
   - Health ID linking
   - Record sharing
   - Multi-provider access
   - Consent management
   - HIE (Health Information Exchange)

3. **Health Data Analytics**
   - Historical trends
   - Comparative analysis
   - Export reports
   - PDF generation
   - Custom dashboards

#### D. Community & Social
1. **Advanced Health Forum**
   - Moderation system
   - Expert verification badges
   - Topic trending
   - User reputation system
   - Direct messaging
   - Video discussions

2. **Health Challenges & Campaigns**
   - Weight loss challenges
   - Fitness challenges
   - Wellness campaigns
   - Leaderboards
   - Rewards & badges

3. **Doctor Reviews & Ratings**
   - Verified reviews only
   - Appointment-based reviews
   - Rating breakdowns
   - Photo uploads
   - Helpful voting

#### E. Pharmacy & Medicine Management
1. **Advanced Pharmacy Integration**
   - Real-time inventory
   - Price comparison
   - Substitute suggestions
   - OTC & prescription separation
   - Insurance coverage

2. **Prescription Management**
   - OCR-based prescription scanning
   - Automatic refills
   - Pharmacy network integration
   - Delivery tracking
   - Interaction checker

3. **Medicine Reminder System**
   - Scheduled alerts
   - Smart notifications
   - Dosage tracking
   - Side effect monitoring
   - Refill alerts

#### F. Lab & Diagnostic Services
1. **Lab Network Integration**
   - Real-time availability
   - Home collection scheduling
   - Result turnaround time
   - Report delivery
   - Doctor consultation

2. **Test Recommendations**
   - Age-based screening
   - Condition-based tests
   - Preventive packages
   - Wellness panels
   - Price optimization

3. **Result Analysis**
   - Doctor interpretation
   - Trend analysis
   - PDF reports
   - Share with doctors
   - Follow-up recommendations

#### G. Payments & Transactions
1. **Multiple Payment Methods**
   - Credit/Debit cards
   - Net Banking
   - UPI
   - Wallets (Paytm, PhonePe)
   - Insurance
   - EMI options

2. **Subscription Plans**
   - Monthly memberships
   - Annual plans
   - Family accounts
   - Premium features
   - Discounts & offers

3. **Transaction Management**
   - Payment history
   - Invoice generation
   - Tax documents
   - Refund tracking
   - Receipt storage

#### H. User Engagement & Gamification
1. **Points & Rewards System**
   - Activity-based points
   - Redemption options
   - Tier-based benefits
   - Referral bonuses
   - Partner discounts

2. **Wellness Gamification**
   - Daily challenges
   - Achievement badges
   - Leaderboards
   - Streak tracking
   - Social sharing

3. **Notifications & Push**
   - Smart notifications
   - In-app messaging
   - Email campaigns
   - SMS alerts
   - Web push

#### I. Admin & Analytics Dashboard
1. **Admin Panel**
   - User management
   - Doctor verification
   - Pharmacy management
   - Lab management
   - Content management
   - Report generation
   - System monitoring

2. **Analytics Dashboard**
   - User metrics
   - Appointment analytics
   - Revenue tracking
   - Doctor performance
   - Medicine sales
   - Lab test trends
   - User behavior
   - Retention metrics

3. **Content Management**
   - Article publishing
   - Media library
   - Health tips
   - Notifications
   - Announcements

#### J. Accessibility & Localization
1. **Multi-Language Support**
   - Hindi, English, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Bengali, Punjabi
   - Automatic translation
   - RTL support (Hindi)
   - Language-specific content

2. **Accessibility Features**
   - Screen reader support
   - Keyboard navigation
   - High contrast mode
   - Font size adjustment
   - Voice commands

3. **Localization**
   - Local payment methods
   - Regional doctors
   - Local pharmacies
   - Local labs
   - Currency conversion

#### K. Advanced Security & Privacy
1. **Data Security**
   - End-to-end encryption
   - Data anonymization
   - Secure backups
   - Breach detection
   - Compliance (HIPAA, GDPR)

2. **Privacy Controls**
   - Granular permissions
   - Data sharing consent
   - Right to deletion
   - Access logs
   - Privacy dashboard

3. **Authentication**
   - Biometric login (fingerprint, face)
   - Two-factor authentication
   - Session management
   - Device verification
   - Login history

#### L. Performance & Optimization
1. **Frontend Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies
   - Web vitals optimization
   - PWA (Progressive Web App)

2. **Backend Optimization**
   - Database indexing
   - Query optimization
   - Caching layers
   - Load balancing
   - CDN delivery

3. **Mobile App**
   - React Native app
   - Offline capabilities
   - Native features (camera, location)
   - App store optimization
   - Push notifications

---

## 🎨 UI/UX DESIGN SPECIFICATIONS

### Design System
```
Color Palette:
  Primary:
    - Light Blue: #0EA5E9 (appointments, actions)
    - Dark Blue: #1E40AF (headers, important)
    - Emerald Green: #10B981 (success, complete)
    - Orange: #F97316 (warnings, alerts)
    - Rose: #E11D48 (errors, critical)
  
  Neutral:
    - White: #FFFFFF
    - Off-white: #F9FAFB
    - Light gray: #E5E7EB
    - Medium gray: #9CA3AF
    - Dark gray: #374151
    - Almost black: #1F2937

Gradients:
  - Health gradient: Linear from #0EA5E9 to #10B981
  - Warning gradient: Linear from #F97316 to #E11D48
  - Premium gradient: Linear from #8B5CF6 to #EC4899

Typography:
  Fonts:
    - Primary: Inter (system font)
    - Heading: Poppins
    - Mono: JetBrains Mono
  
  Sizes:
    - H1: 2.5rem (bold)
    - H2: 2rem (bold)
    - H3: 1.5rem (semibold)
    - H4: 1.25rem (semibold)
    - Body: 1rem (regular)
    - Small: 0.875rem (regular)
    - Tiny: 0.75rem (regular)

Spacing:
  - Base unit: 4px (0.25rem)
  - Scale: 4, 8, 12, 16, 24, 32, 48, 64px
  - Page padding: 16px (mobile), 24px (tablet), 32px (desktop)

Shadows:
  - Small: 0 1px 2px rgba(0,0,0,0.05)
  - Medium: 0 4px 6px rgba(0,0,0,0.1)
  - Large: 0 10px 15px rgba(0,0,0,0.1)
  - Extra Large: 0 20px 25px rgba(0,0,0,0.1)

Border Radius:
  - Small: 4px
  - Medium: 8px
  - Large: 12px
  - Extra Large: 16px
  - Round: 9999px (pills, circles)

Animations:
  - Transition speed: 150ms (fast), 200ms (standard), 300ms (slow)
  - Easing: ease-in-out for standard, cubic-bezier for custom
  - Spring: stiffness 100, damping 10
```

### Page Layout Specifications

#### A. Desktop Layout (1440px+)
- Header: Fixed, sticky
- Sidebar: Collapsible
- Main content: Full width with padding
- Footer: Sticky bottom
- Modals: Centered, backdrop blur

#### B. Tablet Layout (768px - 1439px)
- Header: Sticky
- Sidebar: Hidden, hamburger menu
- Main content: Full width
- Bottom navigation: None
- Modals: Full screen

#### C. Mobile Layout (320px - 767px)
- Header: Compact
- Sidebar: Hidden drawer
- Main content: Full width
- Bottom navigation: Fixed (5 items)
- Modals: Full screen with snap points

### Animation Specifications

#### A. Micro-interactions
```
Button Hover:
  - Scale: 1.02x
  - Duration: 150ms
  - Easing: ease-out
  - Box shadow enhancement

Input Focus:
  - Ring animation (pulse)
  - Border color change
  - Duration: 200ms
  - Shadow expansion

Card Hover:
  - Lift effect (translateY -4px)
  - Shadow expansion
  - Duration: 200ms
  - Slight scale (1.01x)

Icon Hover:
  - Rotation (if appropriate)
  - Color change
  - Duration: 150ms
  - Scale (1.1x)
```

#### B. Page Transitions
```
Page Load:
  - Fade in (opacity 0 → 1)
  - Duration: 300ms
  - Stagger children 50ms
  - From bottom (translateY 20px → 0)

Route Transition:
  - Slide out old page (left)
  - Slide in new page (right)
  - Duration: 300ms
  - Parallel animation

Modal Entry:
  - Scale from 0.95 to 1
  - Fade in (0 → 1)
  - Duration: 250ms
  - Backdrop fade in

List Items:
  - Stagger: 50ms between items
  - Fade in from left
  - Slight scale (0.9 → 1)
  - Duration: 300ms
```

#### C. Complex Animations
```
Appointment Booking Flow:
  - Doctor card expansion (500ms)
  - Calendar animation (400ms)
  - Time slot selection (300ms)
  - Confirmation pop (250ms)

Health Score Animation:
  - Circular progress animation (1000ms)
  - Number counting (800ms)
  - Color transition (smooth)
  - Radial gradient animation

Chart Animations:
  - Bars growing from bottom (800ms)
  - Lines drawing from left (1000ms)
  - Data points appearing (staggered 100ms)
  - Legend fade in (300ms)

Skeleton Loading:
  - Shimmer animation (800ms loop)
  - Left to right sweep
  - Gradient effect
  - Opacity pulse
```

### Component Specifications

#### 1. Navigation Components
- **Header**: Logo, search, notifications, user menu
- **Bottom Navigation**: 5 main sections (home, check, coach, bookings, profile)
- **Sidebar**: Hidden on mobile, collapsible on desktop
- **Breadcrumbs**: Navigation path
- **Tabs**: Segmented options
- **Pills**: Category filters

#### 2. Doctor Discovery Components
- **Doctor Card**: Image, name, specialty, rating, price, quick book
- **Filter Panel**: Specialty, rating, price, availability
- **Map View**: Doctor locations with clustering
- **Search Bar**: Real-time suggestions
- **Doctor Profile**: Full details, reviews, availability

#### 3. Appointment Components
- **Calendar**: Month/week/day view
- **Time Slots**: Available times with duration
- **Booking Form**: Patient details, preferences
- **Confirmation Card**: Appointment details
- **Video Join**: Meeting link, loading screen
- **Cancel/Reschedule**: Dialog with reasons

#### 4. Health Record Components
- **Record List**: Organized by type, sortable
- **Upload Area**: Drag-drop with preview
- **Medical Viewer**: Image/PDF viewer with zoom
- **Share Modal**: Doctor/family sharing
- **Timeline**: Chronological view

#### 5. Pharmacy Components
- **Medicine Search**: Auto-complete with suggestions
- **Product Card**: Image, price, rating, stock
- **Prescription Upload**: Camera or gallery
- **Cart**: Items, quantities, checkout
- **Order Tracking**: Real-time status

#### 6. Lab Components
- **Test Selector**: Searchable, categorized
- **Test Details**: What to expect, preparation
- **Booking Calendar**: Available slots
- **Package Options**: Single, combo, wellness
- **Report Viewer**: PDF with interpretation

#### 7. Forum Components
- **Post Card**: Title, excerpt, author, engagement
- **Post Detail**: Full content, comments, reactions
- **Comment Section**: Nested replies, voting
- **Post Creator**: Rich text editor, category select
- **User Profiles**: Avatar, reputation, posts

#### 8. Health Coaching Components
- **Chat Interface**: Message bubbles, timestamps
- **Quick Questions**: Suggested queries
- **Health Tips**: Card-based display
- **Assessment Results**: Visual severity indicator
- **Recommendation Cards**: Action items with links

#### 9. Profile Components
- **User Header**: Avatar, name, health score
- **Menu Items**: Settings, medical history, etc.
- **Edit Forms**: Inline editing with validation
- **Health Data**: Visual cards with metrics
- **Account Security**: Password, 2FA, devices

#### 10. Utility Components
- **Loading States**: Skeleton screens, spinners
- **Empty States**: Illustrations, CTAs
- **Error States**: Error messages with solutions
- **Success States**: Confirmation, celebration
- **Modals**: Various sizes and types
- **Tooltips**: Hover explanations
- **Alerts**: Info, success, warning, error
- **Badges**: Status, tags, pills
- **Ratings**: Star ratings, numeric

---

## 🗄️ DATABASE SCHEMA (Complete)

### User Management
```sql
-- Core Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  phone VARCHAR UNIQUE,
  full_name VARCHAR,
  profile_photo_url TEXT,
  date_of_birth DATE,
  gender VARCHAR,
  blood_group VARCHAR,
  city VARCHAR,
  state VARCHAR,
  country VARCHAR,
  address TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  role VARCHAR DEFAULT 'user', -- user, doctor, pharmacy, lab, admin
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Health Profile
CREATE TABLE health_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id),
  height_cm DECIMAL,
  weight_kg DECIMAL,
  bmi DECIMAL,
  blood_pressure_systolic INT,
  blood_pressure_diastolic INT,
  heart_rate INT,
  conditions JSONB DEFAULT '[]',
  allergies JSONB DEFAULT '[]',
  medications JSONB DEFAULT '[]',
  vaccination_records JSONB DEFAULT '[]',
  health_score INT DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ABHA Health ID
CREATE TABLE abha_accounts (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id),
  abha_number VARCHAR UNIQUE,
  abha_name VARCHAR,
  linked_at TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  consent_status VARCHAR
);
```

### Appointments & Consultations
```sql
-- Doctors Table
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id),
  specialty VARCHAR NOT NULL,
  qualifications TEXT,
  experience_years INT,
  license_number VARCHAR UNIQUE,
  clinic_name VARCHAR,
  clinic_address TEXT,
  consultation_fee DECIMAL,
  average_rating DECIMAL,
  total_ratings INT DEFAULT 0,
  availability JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  user_id INT REFERENCES users(id),
  doctor_id INT REFERENCES doctors(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INT DEFAULT 30,
  consultation_type VARCHAR, -- online, offline
  status VARCHAR DEFAULT 'scheduled',
  reason VARCHAR,
  notes TEXT,
  meeting_link TEXT,
  recording_url TEXT,
  prescription_id INT REFERENCES prescriptions(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Prescriptions
CREATE TABLE prescriptions (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  appointment_id INT REFERENCES appointments(id),
  doctor_id INT REFERENCES doctors(id),
  user_id INT REFERENCES users(id),
  medicines JSONB NOT NULL,
  instructions TEXT,
  validity_days INT DEFAULT 30,
  issued_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Doctor Reviews & Ratings
CREATE TABLE doctor_ratings (
  id SERIAL PRIMARY KEY,
  doctor_id INT REFERENCES doctors(id),
  user_id INT REFERENCES users(id),
  appointment_id INT REFERENCES appointments(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  verified BOOLEAN DEFAULT TRUE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Health Records & Tests
```sql
-- Health Records
CREATE TABLE health_records (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  user_id INT REFERENCES users(id),
  record_type VARCHAR, -- prescription, lab_report, doctor_note, image
  title VARCHAR NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name VARCHAR,
  file_type VARCHAR,
  file_size INT,
  doctor_id INT REFERENCES doctors(id),
  appointment_id INT REFERENCES appointments(id),
  document_date DATE,
  is_public BOOLEAN DEFAULT FALSE,
  shared_with JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lab Tests
CREATE TABLE lab_tests (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  name VARCHAR NOT NULL,
  category VARCHAR,
  price DECIMAL,
  description TEXT,
  preparation TEXT,
  parameters JSONB,
  turnaround_time VARCHAR,
  available BOOLEAN DEFAULT TRUE
);

-- Lab Bookings
CREATE TABLE lab_bookings (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  user_id INT REFERENCES users(id),
  lab_id INT REFERENCES labs(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  collection_type VARCHAR, -- home, lab
  address TEXT,
  status VARCHAR DEFAULT 'booked',
  selected_tests JSONB NOT NULL,
  total_amount DECIMAL,
  payment_status VARCHAR,
  report_url TEXT,
  report_ready_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lab Providers
CREATE TABLE labs (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  user_id INT REFERENCES users(id),
  lab_name VARCHAR NOT NULL,
  address TEXT,
  phone VARCHAR,
  email VARCHAR,
  available_tests JSONB,
  working_hours JSONB,
  rating DECIMAL DEFAULT 0,
  verification_status VARCHAR
);

-- Lab Reports
CREATE TABLE lab_reports (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  booking_id INT REFERENCES lab_bookings(id),
  report_url TEXT,
  results JSONB,
  status VARCHAR, -- pending, ready, reviewed
  reviewed_by INT REFERENCES doctors(id),
  interpretation TEXT,
  recommendations TEXT,
  ready_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Pharmacy & Orders
```sql
-- Medicines
CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  name VARCHAR NOT NULL,
  composition VARCHAR,
  category VARCHAR,
  price DECIMAL,
  manufacturer VARCHAR,
  stock_qty INT,
  description TEXT,
  side_effects TEXT,
  interactions TEXT,
  requires_prescription BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE
);

-- Medicine Orders
CREATE TABLE medicine_orders (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  user_id INT REFERENCES users(id),
  pharmacy_id INT REFERENCES pharmacies(id),
  order_date DATE DEFAULT NOW(),
  delivery_address TEXT NOT NULL,
  status VARCHAR DEFAULT 'pending',
  items JSONB NOT NULL,
  total_amount DECIMAL,
  payment_method VARCHAR,
  payment_status VARCHAR,
  prescription_url TEXT,
  delivery_date DATE,
  expected_delivery_date DATE,
  tracking_number VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pharmacies
CREATE TABLE pharmacies (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  user_id INT REFERENCES users(id),
  pharmacy_name VARCHAR NOT NULL,
  address TEXT,
  phone VARCHAR,
  email VARCHAR,
  license_number VARCHAR UNIQUE,
  working_hours JSONB,
  delivery_available BOOLEAN DEFAULT TRUE,
  rating DECIMAL DEFAULT 0,
  verification_status VARCHAR
);

-- Medicine Inventory
CREATE TABLE medicine_inventory (
  id SERIAL PRIMARY KEY,
  medicine_id INT REFERENCES medicines(id),
  pharmacy_id INT REFERENCES pharmacies(id),
  quantity INT,
  price DECIMAL,
  last_updated TIMESTAMP DEFAULT NOW()
);
```

### Forum & Community
```sql
-- Forum Posts
CREATE TABLE forum_posts (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  user_id INT REFERENCES users(id),
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR,
  status VARCHAR DEFAULT 'active',
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  views INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  pinned BOOLEAN DEFAULT FALSE,
  verified_doctor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Forum Comments/Replies
CREATE TABLE forum_comments (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  post_id INT REFERENCES forum_posts(id),
  user_id INT REFERENCES users(id),
  parent_comment_id INT REFERENCES forum_comments(id),
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  helpful_count INT DEFAULT 0,
  verified_doctor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Post Interactions
CREATE TABLE post_votes (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES forum_posts(id),
  user_id INT REFERENCES users(id),
  vote_type VARCHAR, -- upvote, downvote
  UNIQUE(post_id, user_id)
);

-- Comment Interactions
CREATE TABLE comment_votes (
  id SERIAL PRIMARY KEY,
  comment_id INT REFERENCES forum_comments(id),
  user_id INT REFERENCES users(id),
  vote_type VARCHAR,
  UNIQUE(comment_id, user_id)
);
```

### Articles & Content
```sql
-- Health Articles
CREATE TABLE health_articles (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE,
  content TEXT NOT NULL,
  category VARCHAR,
  author_id INT REFERENCES users(id),
  featured_image_url TEXT,
  status VARCHAR DEFAULT 'draft',
  views INT DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Article Comments
CREATE TABLE article_comments (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  article_id INT REFERENCES health_articles(id),
  user_id INT REFERENCES users(id),
  content TEXT,
  upvotes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saved Articles
CREATE TABLE saved_articles (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  article_id INT REFERENCES health_articles(id),
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);
```

### Gamification & Engagement
```sql
-- User Points & Rewards
CREATE TABLE user_points (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id),
  total_points INT DEFAULT 0,
  tier VARCHAR DEFAULT 'bronze', -- bronze, silver, gold, platinum
  lifetime_points INT DEFAULT 0,
  last_earned TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Points History
CREATE TABLE points_history (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  points INT,
  action VARCHAR,
  reference_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Achievements & Badges
CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  badge_name VARCHAR,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_name)
);

-- Challenges
CREATE TABLE health_challenges (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR,
  reward_points INT,
  duration_days INT,
  status VARCHAR DEFAULT 'active',
  start_date TIMESTAMP,
  end_date TIMESTAMP
);

-- Challenge Participation
CREATE TABLE challenge_participants (
  id SERIAL PRIMARY KEY,
  challenge_id INT REFERENCES health_challenges(id),
  user_id INT REFERENCES users(id),
  progress_data JSONB,
  completed BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

### Payments & Subscriptions
```sql
-- Transactions
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  user_id INT REFERENCES users(id),
  amount DECIMAL,
  currency VARCHAR DEFAULT 'INR',
  payment_method VARCHAR,
  status VARCHAR DEFAULT 'pending',
  reference_id VARCHAR,
  order_type VARCHAR, -- appointment, medicine, lab, subscription
  order_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  plan_name VARCHAR,
  plan_type VARCHAR, -- monthly, yearly
  price DECIMAL,
  status VARCHAR DEFAULT 'active',
  renewal_date DATE,
  features JSONB,
  started_at TIMESTAMP,
  ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Refunds
CREATE TABLE refunds (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  transaction_id INT REFERENCES transactions(id),
  amount DECIMAL,
  reason VARCHAR,
  status VARCHAR DEFAULT 'pending',
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Notifications & Messages
```sql
-- Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  user_id INT REFERENCES users(id),
  type VARCHAR,
  title VARCHAR,
  message TEXT,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages (DM)
CREATE TABLE direct_messages (
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id),
  recipient_id INT REFERENCES users(id),
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  attachment_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Analytics & Logs
```sql
-- User Activity
CREATE TABLE user_activity (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR,
  resource_type VARCHAR,
  resource_id VARCHAR,
  ip_address VARCHAR,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  user_id INT,
  event_name VARCHAR,
  event_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Error Logs
CREATE TABLE error_logs (
  id SERIAL PRIMARY KEY,
  error_message TEXT,
  error_stack TEXT,
  user_id INT,
  path VARCHAR,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 API ENDPOINTS (50+ Complete)

### Authentication (8 endpoints)
```
POST   /api/v1/auth/register          - User registration
POST   /api/v1/auth/login             - User login
POST   /api/v1/auth/logout            - User logout
POST   /api/v1/auth/refresh           - Refresh access token
POST   /api/v1/auth/forgot-password   - Request password reset
POST   /api/v1/auth/reset-password    - Reset password
POST   /api/v1/auth/verify-email      - Verify email
POST   /api/v1/auth/google            - Google OAuth login
```

### Users (10 endpoints)
```
GET    /api/v1/users/:id              - Get user profile
PUT    /api/v1/users/:id              - Update user profile
DELETE /api/v1/users/:id              - Delete account
POST   /api/v1/users/:id/photo        - Upload profile photo
GET    /api/v1/users/:id/health-profile - Get health profile
PUT    /api/v1/users/:id/health-profile - Update health profile
GET    /api/v1/users/:id/activity     - Get user activity
GET    /api/v1/users/search           - Search users
POST   /api/v1/users/:id/follow       - Follow user
DELETE /api/v1/users/:id/follow       - Unfollow user
```

### Doctors (12 endpoints)
```
GET    /api/v1/doctors                - List doctors
POST   /api/v1/doctors                - Register as doctor
GET    /api/v1/doctors/:id            - Get doctor profile
PUT    /api/v1/doctors/:id            - Update doctor profile
DELETE /api/v1/doctors/:id            - Delete doctor profile
GET    /api/v1/doctors/:id/availability - Get availability
PUT    /api/v1/doctors/:id/availability - Update availability
GET    /api/v1/doctors/:id/ratings    - Get doctor ratings
GET    /api/v1/doctors/:id/appointments - Get doctor appointments
GET    /api/v1/doctors/:id/patients   - Get doctor patients
POST   /api/v1/doctors/:id/verify     - Verify doctor
GET    /api/v1/doctors/search         - Search doctors
```

### Appointments (8 endpoints)
```
GET    /api/v1/appointments           - List user appointments
POST   /api/v1/appointments           - Book appointment
GET    /api/v1/appointments/:id       - Get appointment details
PUT    /api/v1/appointments/:id       - Update appointment
DELETE /api/v1/appointments/:id       - Cancel appointment
POST   /api/v1/appointments/:id/reschedule - Reschedule
GET    /api/v1/appointments/:id/meeting-link - Get video link
POST   /api/v1/appointments/:id/complete - Mark complete
```

### Health Records (8 endpoints)
```
GET    /api/v1/health/records         - List health records
POST   /api/v1/health/records         - Upload record
GET    /api/v1/health/records/:id     - Get record details
DELETE /api/v1/health/records/:id     - Delete record
GET    /api/v1/health/records/:id/download - Download file
POST   /api/v1/health/records/:id/share - Share record
GET    /api/v1/health/records/:id/sharing - Get sharing status
POST   /api/v1/health/symptom-check   - Start symptom check
```

### Medicine Orders (8 endpoints)
```
GET    /api/v1/medicines/list         - List medicines
GET    /api/v1/medicines/search       - Search medicines
GET    /api/v1/medicines/:id          - Get medicine details
GET    /api/v1/medicines/orders       - List user orders
POST   /api/v1/medicines/orders       - Place order
GET    /api/v1/medicines/orders/:id   - Get order details
PUT    /api/v1/medicines/orders/:id   - Update order status
DELETE /api/v1/medicines/orders/:id   - Cancel order
```

### Lab Services (8 endpoints)
```
GET    /api/v1/lab/tests              - List lab tests
GET    /api/v1/lab/tests/search       - Search tests
GET    /api/v1/lab/tests/:id          - Get test details
POST   /api/v1/lab/bookings           - Book lab test
GET    /api/v1/lab/bookings           - List user bookings
GET    /api/v1/lab/bookings/:id       - Get booking details
GET    /api/v1/lab/bookings/:id/report - Get lab report
PUT    /api/v1/lab/bookings/:id/status - Update booking status
```

### Forum (10 endpoints)
```
GET    /api/v1/forum/posts            - List forum posts
POST   /api/v1/forum/posts            - Create post
GET    /api/v1/forum/posts/:id        - Get post details
PUT    /api/v1/forum/posts/:id        - Update post
DELETE /api/v1/forum/posts/:id        - Delete post
POST   /api/v1/forum/posts/:id/comments - Add comment
GET    /api/v1/forum/posts/:id/comments - Get comments
POST   /api/v1/forum/posts/:id/upvote - Upvote post
DELETE /api/v1/forum/posts/:id/upvote - Remove upvote
GET    /api/v1/forum/trending         - Get trending posts
```

### Health Articles (6 endpoints)
```
GET    /api/v1/articles               - List articles
GET    /api/v1/articles/:id           - Get article details
POST   /api/v1/articles/:id/comments  - Add comment
GET    /api/v1/articles/:id/comments  - Get comments
POST   /api/v1/articles/:id/save      - Save article
GET    /api/v1/articles/user/saved    - Get saved articles
```

### Analytics & Admin (8 endpoints)
```
GET    /api/v1/admin/dashboard        - Dashboard metrics
GET    /api/v1/admin/users            - Manage users
GET    /api/v1/admin/doctors          - Manage doctors
GET    /api/v1/admin/analytics        - Analytics data
POST   /api/v1/admin/notifications    - Send notifications
GET    /api/v1/admin/reports          - Generate reports
POST   /api/v1/admin/content          - Manage content
GET    /api/v1/admin/system           - System status
```

---

## 🎬 ANIMATION & INTERACTION SPECIFICATIONS

### Entrance Animations
```javascript
// Page Load
- Fade in from opacity 0 to 1 (300ms)
- Stagger children elements (50ms delay)
- Slide up from translateY(20px)

// Card Display
- Scale from 0.95 to 1 (300ms)
- Fade in (300ms)
- Rotate slightly (2-3 degrees)

// List Items
- Stagger animation (50ms between items)
- Slide in from left (translateX(-20px))
- Fade in (300ms)
```

### Interactive Animations
```javascript
// Button Press
- Scale 0.98x on click
- Ripple effect from center
- Duration: 200ms
- Color shift

// Input Focus
- Ring animation (2-3px border)
- Color change
- Shadow expansion
- Duration: 200ms

// Hover States
- Lift effect (translateY -2px to -4px)
- Shadow enhancement
- Color lighten
- Duration: 150ms
```

### Complex Animations
```javascript
// Appointment Booking Flow
1. Doctor card expansion (500ms, ease-out)
2. Calendar slide in (400ms, ease-out)
3. Time slot popup (300ms, scale & fade)
4. Confirmation animation (250ms, bounce)

// Health Score Animation
1. Circular progress bar drawing (1000ms)
2. Number counter animation (800ms, easing-function)
3. Color gradient animation (smooth transition)
4. Icon entrance with rotation (300ms)

// Chart Animations
1. Bar chart growing from bottom (800ms, staggered)
2. Line chart drawing (1000ms, stroke animation)
3. Data points popping in (staggered 100ms)
4. Legend fade in (300ms)

// Notification Pop
1. Scale from 0 to 1 (250ms)
2. Slide in from top (300ms)
3. Auto-dismiss with fade out (5000ms delay + 300ms)
```

---

## 📊 PERFORMANCE TARGETS

### Frontend Performance
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s
- Page Load Size: < 2MB (gzipped)
- Lighthouse Score: > 90

### Backend Performance
- API Response Time (p95): < 200ms
- Database Query Time (p95): < 50ms
- Uptime: > 99.9%
- Error Rate: < 0.1%
- RPS (Requests Per Second): > 1000
- P99 Latency: < 500ms

### Mobile Performance
- First Input Delay (FID): < 100ms
- Interaction to Paint (INP): < 200ms
- Time to First Byte (TTFB): < 600ms
- Mobile Lighthouse: > 85

---

## 🔐 SECURITY REQUIREMENTS

### Authentication & Authorization
- JWT with 15-minute expiry
- Refresh tokens with 7-day expiry
- Role-based access control (RBAC)
- Two-factor authentication
- Biometric support
- Session management
- Device verification

### Data Security
- End-to-end encryption for sensitive data
- AES-256 for data at rest
- TLS 1.3+ for data in transit
- Regular security audits
- Penetration testing
- OWASP compliance
- HIPAA compliance (healthcare)
- GDPR compliance

### API Security
- Rate limiting (100 req/15min per IP)
- CORS configuration
- CSRF tokens
- SQL injection prevention
- XSS protection
- API key management
- Request validation
- Response sanitization

---

## 📱 RESPONSIVE DESIGN BREAKPOINTS

```
Mobile: 320px - 640px
  - Single column
  - Bottom navigation
  - Full-width modals
  - Large touch targets

Tablet: 641px - 1024px
  - Two columns (partial)
  - Side drawer navigation
  - Medium-sized modals
  - Optimized spacing

Desktop: 1025px - 1440px
  - Multi-column layouts
  - Sidebar navigation
  - Centered modals
  - Expanded content

Large Desktop: 1441px+
  - Wide layouts
  - Multi-panel interface
  - Floating windows
  - Maximum content width: 1400px
```

---

## 🚀 BUILD & DEPLOYMENT INSTRUCTIONS

### Frontend Build
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Analyze bundle
npm run analyze

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

### Backend Build
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Database migrations
npm run migrate

# Database seeding
npm run seed

# Run tests
npm run test

# Run linter
npm run lint
```

### Docker Deployment
```bash
# Build image
docker build -t swasthai-app:1.0.0 .

# Run container
docker run -p 3000:3000 swasthai-app:1.0.0

# Docker compose
docker-compose up -d

# Stop services
docker-compose down
```

### Cloud Deployment
```bash
# Deploy to Vercel (Frontend)
vercel deploy --prod

# Deploy to AWS (Backend)
aws deploy create-deployment ...

# Deploy to Docker Registry
docker tag swasthai-app gcr.io/project/swasthai-app
docker push gcr.io/project/swasthai-app
```

---

## 📈 DEVELOPMENT ROADMAP (12 Weeks)

### Week 1-2: Foundation
- Project setup and configuration
- Database schema implementation
- Basic authentication system
- Core API endpoints

### Week 3-4: User Management
- User registration and login
- Profile management
- Health profile
- ABHA integration

### Week 5-6: Doctor & Appointments
- Doctor discovery and search
- Appointment booking system
- Video consultation integration
- Prescription management

### Week 7-8: Health Services
- Medicine ordering system
- Lab booking and reports
- Health records management
- File upload and storage

### Week 9-10: Community & Content
- Forum system
- Health articles
- Comments and engagement
- Gamification features

### Week 11-12: Testing & Deployment
- Unit testing
- Integration testing
- E2E testing
- Production deployment

---

## 🎓 ADDITIONAL REQUIREMENTS

### Documentation
- API documentation (Swagger/OpenAPI)
- Component storybook
- Architecture documentation
- Database schema documentation
- Deployment guides
- User guides
- Developer guides

### Testing
- Unit test coverage > 80%
- Integration test coverage > 70%
- E2E test coverage for critical paths
- Performance testing
- Load testing
- Security testing

### Monitoring & Analytics
- Error tracking (Sentry)
- User analytics (Mixpanel/Amplitude)
- Performance monitoring (DataDog)
- Log aggregation (ELK/Splunk)
- Uptime monitoring
- RUM (Real User Monitoring)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast > 4.5:1
- Font size adjustability
- Voice command support

---

## ✨ EXECUTION NOTES

1. **Start with Core**: Build authentication and user management first
2. **Iterate Features**: Implement features in priority order based on user impact
3. **Test Continuously**: Write tests as you build, not after
4. **Optimize Early**: Performance should be built in, not added later
5. **Document Always**: Document as you code
6. **Deploy Often**: Use CI/CD to deploy multiple times per week
7. **Monitor Closely**: Set up monitoring and alerting from day 1
8. **Gather Feedback**: Get user feedback early and often
9. **Scale Gradually**: Build for scale from the beginning

---

## 📞 PROJECT COORDINATION

### Team Structure (Recommended)
- 1 Tech Lead / Architect
- 2-3 Frontend Developers
- 2-3 Backend Developers
- 1 DevOps/Infrastructure Engineer
- 1 QA/Testing Engineer
- 1 UI/UX Designer
- 1 Product Manager

### Communication
- Daily standups (15 min)
- Weekly planning (1 hour)
- Bi-weekly demos (1 hour)
- Monthly reviews (2 hours)

### Tools
- GitHub for version control
- Jira for project management
- Slack for communication
- Figma for design
- Postman for API testing
- DataDog for monitoring

---

**This is a complete blueprint for building SwasthAI as an advanced, production-grade healthcare platform. Use this prompt to guide AI, contractors, or your development team through building the entire system.**

**Total Estimated Effort: 1500-2000 hours**  
**Team Size: 7-10 people**  
**Timeline: 12 weeks with full team**  
**Launch Target: 3 months from start**

---

**Ready to build the future of Indian healthcare? Let's go! 🚀**
