# SwasthAI API Configuration Guide

## Base44 API Setup

### Authentication Credentials
```javascript
APP_ID: 694fd8b61fb0c471c15b8341
API_KEY: 3f3fa91f326742bb8bb2eb444baac1f3
BASE_URL: https://app.base44.com/api/apps/{APP_ID}
```

### API Endpoints

#### Entity CRUD Operations
All entities follow this pattern:

```
GET    /entities/{EntityName}              - List all
POST   /entities/{EntityName}              - Create
GET    /entities/{EntityName}/{id}         - Get one
PUT    /entities/{EntityName}/{id}         - Update
DELETE /entities/{EntityName}/{id}         - Delete
```

#### Query Parameters
- `sort`: Sort by field (use `-` prefix for descending, e.g., `-rating`)
- `limit`: Number of results (default: 10, max: 100)
- `skip`: Pagination offset
- Custom filters: Pass as query params (e.g., `?specialty=Cardiologist`)

### Available Entities

#### 1. HealthProfile
**Purpose**: Store user health information
```javascript
{
  phone: string,           // User phone number
  language: string,        // english, hindi, assamese, bengali
  age: number,
  gender: string,          // male, female, other
  city: string,
  blood_group: string,     // A+, A-, B+, B-, AB+, AB-, O+, O-, unknown
  existing_conditions: [],
  allergies: [],
  abha_id: string,         // ABHA health ID
  abha_linked: boolean,
  emergency_contact: string,
  onboarding_completed: boolean
}
```

#### 2. SymptomCheck
**Purpose**: Track AI symptom analysis results
```javascript
{
  symptoms: string[],
  symptoms_text: string,
  duration: string,
  severity: string,        // mild, moderate, severe
  risk_level: string,      // low, medium, high, emergency
  recommended_action: string,
  recommended_specialty: string,
  ai_assessment: string,
  home_care_tips: [],
  red_flags: [],
  conversation_history: []
}
```

#### 3. Doctor
**Purpose**: Manage doctor profiles
```javascript
{
  name: string,
  specialty: string,
  qualification: string,
  experience_years: number,
  rating: number,
  reviews_count: number,
  consultation_fee: number,
  languages: string[],
  available_online: boolean,
  available_offline: boolean,
  clinic_name: string,
  clinic_address: string,
  city: string,
  photo_url: string
}
```

#### 4. Appointment
**Purpose**: Book and manage appointments
```javascript
{
  doctor_id: string,
  doctor_name: string,
  doctor_specialty: string,
  doctor_photo: string,
  appointment_type: string,  // online, offline
  date: string,             // YYYY-MM-DD format
  time: string,             // HH:MM format
  status: string,           // scheduled, completed, cancelled, in_progress
  symptoms: string,
  symptom_check_id: string,
  consultation_notes: string,
  clinic_address: string,
  fee: number,
  payment_status: string    // pending, paid, refunded
}
```

#### 5. HealthRecord
**Purpose**: Store medical documents
```javascript
{
  record_type: string,      // prescription, lab_report, doctor_note, vaccination, discharge_summary, other
  title: string,
  description: string,
  doctor_name: string,
  hospital_name: string,
  record_date: string,      // YYYY-MM-DD
  file_url: string,
  file_type: string,
  appointment_id: string,
  tags: string[],
  is_abha_synced: boolean
}
```

#### 6. MedicineOrder
**Purpose**: Track medicine orders
```javascript
{
  prescription_id: string,
  pharmacy_name: string,
  medicines: [
    {
      name: string,
      quantity: number,
      price: number,
      dosage: string
    }
  ],
  total_amount: number,
  delivery_address: string,
  status: string,           // pending, confirmed, dispatched, delivered, cancelled
  order_date: string,
  expected_delivery: string
}
```

#### 7. LabBooking
**Purpose**: Book lab tests
```javascript
{
  lab_name: string,
  tests: [
    {
      name: string,
      price: number
    }
  ],
  total_amount: number,
  booking_type: string,     // home_collection, lab_visit
  address: string,
  date: string,             // YYYY-MM-DD
  time_slot: string,
  status: string,           // booked, sample_collected, processing, report_ready, cancelled
  report_url: string
}
```

### Integration Methods

#### QueryAI
```javascript
await base44.integrations.Core.QueryAI({
  prompt: string,
  json_schema: object
});
```

#### InvokeLLM
```javascript
await base44.integrations.Core.InvokeLLM({
  prompt: string,
  response_json_schema: object
});
```

#### UploadFile
```javascript
await base44.integrations.Core.UploadFile({
  file: File object
});
// Returns: { file_url, file_name, file_size, success }
```

#### ExtractDataFromUploadedFile
```javascript
await base44.integrations.Core.ExtractDataFromUploadedFile({
  file_url: string,
  json_schema: object
});
```

### Usage Examples

#### Fetch All Doctors by Specialty
```javascript
const cardiologists = await base44.entities.Doctor.filter(
  { specialty: 'Cardiologist' },
  '-rating',  // Sort by rating descending
  10          // Limit to 10 results
);
```

#### Create an Appointment
```javascript
const appointment = await base44.entities.Appointment.create({
  doctor_id: 'doc_1',
  doctor_name: 'Dr. Rajesh Kumar',
  doctor_specialty: 'General Physician',
  appointment_type: 'online',
  date: '2024-01-15',
  time: '10:00 AM',
  status: 'scheduled',
  fee: 500,
  payment_status: 'paid'
});
```

#### Upload Health Record
```javascript
const result = await base44.integrations.Core.UploadFile({
  file: fileInput.files[0]
});

const record = await base44.entities.HealthRecord.create({
  title: 'Prescription from Dr. Kumar',
  record_type: 'prescription',
  doctor_name: 'Dr. Rajesh Kumar',
  file_url: result.file_url,
  record_date: '2024-01-10'
});
```

### Error Handling

The API client includes built-in error handling:

```javascript
// Automatic retry on 500 errors (2 retries)
// 401 errors log "Unauthorized - Check API key"
// 404 errors return null
// Network errors return null

// Check for errors:
const doctors = await base44.entities.Doctor.filter({ ... });
if (!doctors || doctors.length === 0) {
  console.log('No doctors found or API error');
}
```

### Sample Doctor Data (Fallback)

When API returns no results, the app uses 12 sample doctors:

```javascript
{
  id: 'doc_1',
  name: 'Rajesh Kumar',
  specialty: 'General Physician',
  experience_years: 12,
  rating: 4.8,
  consultation_fee: 500,
  available_online: true,
  available_offline: true,
  languages: ['English', 'Hindi']
  // ... and 11 more doctors
}
```

### Rate Limiting

- Default: 1000 requests per hour per API key
- Recommended: Implement caching with React Query
- Current cache time: 5 minutes (Stale Time)
- Garbage collection: 10 minutes

### Best Practices

1. **Always use React Query** for data fetching
```javascript
const { data: doctors } = useQuery({
  queryKey: ['doctors', specialty],
  queryFn: () => base44.entities.Doctor.filter({ specialty })
});
```

2. **Handle loading and error states**
```javascript
if (isLoading) return <Skeleton />;
if (error) return <ErrorComponent />;
if (!data || data.length === 0) return <EmptyState />;
```

3. **Use proper sort parameters**
```javascript
// Ascending (oldest first)
await base44.entities.Appointment.list('date', 10);

// Descending (newest first)
await base44.entities.Appointment.list('-date', 10);

// By rating (highest first)
await base44.entities.Doctor.filter({}, '-rating', 20);
```

4. **Validate date formats**
```javascript
// Always use YYYY-MM-DD format
const date = new Date().toISOString().split('T')[0]; // '2024-01-15'
```

5. **Handle file uploads securely**
```javascript
// Validate file type and size before upload
const validateFile = (file) => {
  if (file.size > 5 * 1024 * 1024) return false; // Max 5MB
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  return allowed.includes(file.type);
};
```

### Troubleshooting

**Q: Doctors not showing?**
A: Check API credentials and network tab. Fallback to sample data if API fails.

**Q: API key keeps failing?**
A: Verify `API_KEY` and `APP_ID` in `api/base44Client.js`. Don't commit to git!

**Q: File upload not working?**
A: Ensure file size < 5MB and type is image or PDF.

**Q: Appointment time slots not available?**
A: Check doctor's availability window and ensure selected date is in future.

---

**Last Updated**: December 28, 2025
