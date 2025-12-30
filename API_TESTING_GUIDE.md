# API Testing Guide - SwasthAI Backend

## Quick Start Testing

### 1. Verify Backend is Running
```bash
curl http://localhost:5000/health
```

Expected Response:
```json
{
  "status": "OK",
  "timestamp": "2024-12-30T10:30:00.000Z",
  "uptime": 245.123
}
```

---

## 📋 Test Workflows

### Workflow 1: Patient Registration & Login

#### Step 1: Register New User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newpatient@example.com",
    "password": "SecurePass@123",
    "fullName": "New Patient",
    "phone": "9876543214",
    "gender": "female",
    "city": "Delhi",
    "state": "Delhi"
  }'
```

Expected Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "newpatient@example.com",
    "fullName": "New Patient",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Step 2: Login with Credentials
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "Password@123"
  }'
```

Expected Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "patient@example.com",
    "fullName": "John Doe",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Step 3: Get Current User Profile
```bash
# Save token from login response as TOKEN
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

### Workflow 2: Doctor Search & Review

#### Step 1: List All Doctors
```bash
curl http://localhost:5000/api/v1/doctors
```

Expected Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "fullName": "Dr. Rajesh Kumar",
      "specialty": "General Physician",
      "qualifications": "MBBS, MD",
      "experienceYears": 8,
      "consultationFee": 500,
      "averageRating": 4.5,
      "totalRatings": 45,
      "city": "Mumbai"
    },
    {
      "id": 3,
      "fullName": "Dr. Priya Sharma",
      "specialty": "Cardiologist",
      "qualifications": "MBBS, MD",
      "experienceYears": 12,
      "consultationFee": 800,
      "averageRating": 4.8,
      "totalRatings": 78
    }
  ],
  "count": 3
}
```

#### Step 2: Filter Doctors by Specialty
```bash
curl "http://localhost:5000/api/v1/doctors?specialty=Cardiologist"
```

#### Step 3: Get Doctor Details
```bash
curl http://localhost:5000/api/v1/doctors/2
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "fullName": "Dr. Rajesh Kumar",
    "email": "doctor1@example.com",
    "phone": "9876543211",
    "specialty": "General Physician",
    "qualifications": "MBBS, MD",
    "experienceYears": 8,
    "licenseNumber": "LIC12345",
    "clinicName": "Health Care Clinic",
    "clinicAddress": "Mumbai Central",
    "consultationFee": 500,
    "averageRating": 4.5,
    "totalRatings": 45,
    "isVerified": true
  }
}
```

#### Step 4: Find Nearby Doctors
```bash
# Get doctors within 10km radius of your location
curl "http://localhost:5000/api/v1/doctors/nearby?latitude=19.0176&longitude=72.8479&radius=10"
```

#### Step 5: Add Review to Doctor
```bash
curl -X POST http://localhost:5000/api/v1/doctors/2/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Dr. Rajesh is very helpful and attentive. Highly recommended!",
    "visitDate": "2024-12-29"
  }'
```

#### Step 6: Get Doctor Reviews
```bash
curl http://localhost:5000/api/v1/doctors/2/reviews
```

---

### Workflow 3: Book & Manage Appointments

#### Step 1: Book Appointment
```bash
curl -X POST http://localhost:5000/api/v1/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": 2,
    "appointmentDate": "2025-01-15T10:00:00Z",
    "consultationType": "online",
    "symptoms": "Chest pain and shortness of breath",
    "notes": "Had these symptoms for 2 days"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "id": 1,
    "doctorId": 2,
    "appointmentDate": "2025-01-15T10:00:00Z",
    "consultationType": "online",
    "status": "scheduled",
    "symptoms": "Chest pain and shortness of breath",
    "amount": 500
  }
}
```

#### Step 2: Get My Appointments
```bash
curl -X GET http://localhost:5000/api/v1/appointments \
  -H "Authorization: Bearer $TOKEN"
```

#### Step 3: Get Appointment Details
```bash
curl -X GET http://localhost:5000/api/v1/appointments/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Step 4: Reschedule Appointment
```bash
curl -X PATCH http://localhost:5000/api/v1/appointments/1/reschedule \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newDate": "2025-01-16T14:00:00Z"
  }'
```

#### Step 5: Update Appointment Status (Doctor Only)
```bash
curl -X PATCH http://localhost:5000/api/v1/appointments/1/status \
  -H "Authorization: Bearer $DOCTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

Valid statuses: `scheduled`, `in_progress`, `completed`, `cancelled`

#### Step 6: Cancel Appointment
```bash
curl -X DELETE http://localhost:5000/api/v1/appointments/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### Workflow 4: Purchase Medicines

#### Step 1: List All Medicines
```bash
curl http://localhost:5000/api/v1/medicines
```

#### Step 2: Filter Medicines
```bash
# By name
curl "http://localhost:5000/api/v1/medicines?name=Paracetamol"

# By category
curl "http://localhost:5000/api/v1/medicines?category=Pain%20Relief"

# By price
curl "http://localhost:5000/api/v1/medicines?minPrice=20&maxPrice=100"
```

#### Step 3: Get Medicine Details
```bash
curl http://localhost:5000/api/v1/medicines/1
```

#### Step 4: Order Medicines
```bash
curl -X POST http://localhost:5000/api/v1/medicines/order \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "medicineId": 1,
        "quantity": 2,
        "prescriptionUrl": "https://example.com/prescription.pdf"
      },
      {
        "medicineId": 2,
        "quantity": 1,
        "prescriptionUrl": null
      }
    ],
    "deliveryAddress": "123 Main St, Mumbai",
    "deliveryDate": "2025-01-05"
  }'
```

#### Step 5: Get My Orders
```bash
curl -X GET http://localhost:5000/api/v1/medicines/orders/my \
  -H "Authorization: Bearer $TOKEN"
```

#### Step 6: Track Order
```bash
curl -X GET http://localhost:5000/api/v1/medicines/orders/1 \
  -H "Authorization: Bearer $TOKEN"
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "pending",
    "totalAmount": 100,
    "items": [
      {
        "medicineId": 1,
        "medicineName": "Paracetamol 500mg",
        "quantity": 2,
        "price": 25,
        "subtotal": 50
      }
    ],
    "deliveryAddress": "123 Main St, Mumbai",
    "deliveryDate": "2025-01-05",
    "createdAt": "2024-12-30T10:00:00Z"
  }
}
```

---

### Workflow 5: Book Lab Tests

#### Step 1: List Lab Tests
```bash
curl http://localhost:5000/api/v1/lab/tests
```

#### Step 2: Get Test Details
```bash
curl http://localhost:5000/api/v1/lab/tests/1
```

#### Step 3: Book Lab Test
```bash
curl -X POST http://localhost:5000/api/v1/lab/book \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testIds": [1, 3],
    "preferredDate": "2025-01-05",
    "preferredTime": "09:00",
    "homeCollection": true,
    "collectionAddress": "123 Main St, Mumbai",
    "notes": "Please come after 8 AM"
  }'
```

#### Step 4: Get My Bookings
```bash
curl -X GET http://localhost:5000/api/v1/lab/bookings \
  -H "Authorization: Bearer $TOKEN"
```

#### Step 5: Upload Lab Report
```bash
curl -X POST http://localhost:5000/api/v1/lab/bookings/1/report \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reportUrl": "https://example.com/report.pdf",
    "reportData": {
      "RBC": "4.5 million",
      "WBC": "7000",
      "Platelets": "250000"
    }
  }'
```

---

### Workflow 6: Manage Health Records

#### Step 1: Upload Health Record
```bash
curl -X POST http://localhost:5000/api/v1/health/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "prescription",
    "title": "Heart Medication Prescription",
    "fileUrl": "https://example.com/prescription.pdf",
    "recordDate": "2024-12-29",
    "metadata": {
      "doctor": "Dr. Rajesh Kumar",
      "clinicName": "Health Care Clinic"
    }
  }'
```

#### Step 2: Get My Health Records
```bash
curl -X GET http://localhost:5000/api/v1/health/records \
  -H "Authorization: Bearer $TOKEN"
```

#### Step 3: Share Record with Doctor
```bash
curl -X POST http://localhost:5000/api/v1/health/records/1/share \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": 2,
    "expiryDays": 30
  }'
```

---

### Workflow 7: Read & Save Articles

#### Step 1: List Health Articles
```bash
curl http://localhost:5000/api/v1/health/articles
```

#### Step 2: Get Article Details
```bash
curl http://localhost:5000/api/v1/health/articles/1
```

#### Step 3: Save Article
```bash
curl -X POST http://localhost:5000/api/v1/health/articles/1/save \
  -H "Authorization: Bearer $TOKEN"
```

#### Step 4: Get Saved Articles
```bash
curl -X GET http://localhost:5000/api/v1/health/articles/saved \
  -H "Authorization: Bearer $TOKEN"
```

#### Step 5: Remove Saved Article
```bash
curl -X DELETE http://localhost:5000/api/v1/health/articles/1/save \
  -H "Authorization: Bearer $TOKEN"
```

---

### Workflow 8: Community Forum

#### Step 1: List Forum Posts
```bash
curl http://localhost:5000/api/v1/forum/posts
```

#### Step 2: Get Post Details
```bash
curl http://localhost:5000/api/v1/forum/posts/1
```

#### Step 3: Create Forum Post
```bash
curl -X POST http://localhost:5000/api/v1/forum/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Has anyone dealt with anxiety during appointments?",
    "content": "I get really anxious before doctor appointments. Any tips?",
    "category": "mental-health",
    "tags": ["anxiety", "doctor-visit", "mental-health"]
  }'
```

#### Step 4: Add Comment to Post
```bash
curl -X POST http://localhost:5000/api/v1/forum/posts/1/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I usually do breathing exercises before my appointment. Helps me stay calm!"
  }'
```

#### Step 5: Upvote Post
```bash
curl -X POST http://localhost:5000/api/v1/forum/posts/1/upvote \
  -H "Authorization: Bearer $TOKEN"
```

---

### Workflow 9: Notifications

#### Step 1: Get Notifications
```bash
curl -X GET http://localhost:5000/api/v1/health/notifications \
  -H "Authorization: Bearer $TOKEN"
```

#### Step 2: Get Unread Count
```bash
curl -X GET http://localhost:5000/api/v1/health/notifications/unread-count \
  -H "Authorization: Bearer $TOKEN"
```

#### Step 3: Mark Notification as Read
```bash
curl -X PATCH http://localhost:5000/api/v1/health/notifications/1/read \
  -H "Authorization: Bearer $TOKEN"
```

#### Step 4: Mark All as Read
```bash
curl -X PATCH http://localhost:5000/api/v1/health/notifications/read-all \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔐 Authentication Flows

### Get Access Token
```bash
# Login
RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "Password@123"
  }')

# Extract token using jq
TOKEN=$(echo $RESPONSE | jq -r '.accessToken')
echo "Token: $TOKEN"
```

### Refresh Access Token
```bash
REFRESH_TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }"
```

### Forgot Password
```bash
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com"
  }'
```

### Reset Password
```bash
curl -X POST http://localhost:5000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token-from-email",
    "newPassword": "NewPassword@123"
  }'
```

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Actual data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "error_code",
  "statusCode": 400
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

## 🧪 Testing Commands Summary

```bash
# Setup Token
TOKEN="your_token_here"

# Authentication
curl -X GET http://localhost:5000/api/v1/auth/me -H "Authorization: Bearer $TOKEN"

# Doctors
curl http://localhost:5000/api/v1/doctors
curl http://localhost:5000/api/v1/doctors/2
curl "http://localhost:5000/api/v1/doctors?specialty=Cardiologist"

# Appointments
curl -X GET http://localhost:5000/api/v1/appointments -H "Authorization: Bearer $TOKEN"

# Medicines
curl http://localhost:5000/api/v1/medicines
curl "http://localhost:5000/api/v1/medicines?category=Pain%20Relief"

# Lab Tests
curl http://localhost:5000/api/v1/lab/tests

# Articles
curl http://localhost:5000/api/v1/health/articles

# Forum
curl http://localhost:5000/api/v1/forum/posts
```

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Health check returning OK
- [ ] Can register new user
- [ ] Can login and get token
- [ ] Can view doctor list
- [ ] Can book appointment
- [ ] Can order medicine
- [ ] Can book lab test
- [ ] Can upload health record
- [ ] Can save article
- [ ] Can create forum post
- [ ] Can get notifications

---

## 📞 Support

For API issues:
1. Check the response status code
2. Read error message
3. Verify Authorization header for protected routes
4. Check backend logs: `docker-compose logs -f backend`

