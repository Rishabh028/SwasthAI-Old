# SwasthAI - Technical Checklist & Debugging Guide

## Pre-Testing Checklist

- [x] Node.js installed (check: `node --version`)
- [x] npm installed (check: `npm --version`)
- [x] Dependencies installed with `npm install --legacy-peer-deps`
- [x] Vite path aliases configured in vite.config.js
- [x] All missing entities added to base44Client.js
- [x] Import paths standardized to use `@/` alias
- [x] React Router setup with all page routes
- [x] React Query configured with default options
- [x] Tailwind CSS properly configured
- [x] UI components properly exported

## Component Hierarchy

```
App.jsx (Main Router)
├── AppRoutes (Route handler with location tracking)
│   ├── Layout (Page wrapper)
│   │   ├── BottomNav (Navigation)
│   │   └── {Page Component}
│   │       ├── Page-specific components
│   │       └── UI Components
│   └── All 29 pages mounted
```

## Page Route Mapping

| Page Name | Route | Component File | Status |
|-----------|-------|-----------------|--------|
| Home | / | pages/Home.jsx | ✓ Working |
| SymptomChecker | /symptom-checker | pages/SymptomChecker.jsx | ✓ Working |
| Appointments | /appointments | pages/Appointments.jsx | ✓ Working |
| AppointmentConfirmation | /appointment-confirmation | pages/AppointmentConfirmation.jsx | ✓ Working |
| BookAppointment | /book-appointment | pages/BookAppointment.jsx | ✓ Working |
| DoctorProfile | /doctor-profile/:id? | pages/DoctorProfile.jsx | ✓ Working |
| DoctorSearch | /doctor-search | pages/DoctorSearch.jsx | ✓ Working |
| FindDoctor | /find-doctor | pages/FindDoctor.jsx | ✓ Working |
| HealthRecords | /health-records | pages/HealthRecords.jsx | ✓ Working |
| LabBooking | /lab-booking | pages/LabBooking.jsx | ✓ Fixed |
| LabTests | /lab-tests | pages/LabTests.jsx | ✓ Fixed |
| LabBookingHistory | /lab-booking-history | pages/LabBookingHistory.jsx | ✓ Working |
| Onboarding | /onboarding | pages/Onboarding.jsx | ✓ Working |
| Pharmacy | /pharmacy | pages/Pharmacy.jsx | ✓ Working |
| Profile | /profile | pages/Profile.jsx | ✓ Working |
| ABHALink | /abha-link | pages/ABHALink.jsx | ✓ Working |
| ArticleDetail | /article-detail/:id? | pages/ArticleDetail.jsx | ✓ Working |
| CreatePost | /create-post | pages/CreatePost.jsx | ✓ Fixed |
| DoctorMap | /doctor-map | pages/DoctorMap.jsx | ✓ Working |
| ForumPost | /forum-post/:id? | pages/ForumPost.jsx | ✓ Fixed |
| HealthArticles | /health-articles | pages/HealthArticles.jsx | ✓ Fixed |
| HealthCoach | /health-coach | pages/HealthCoach.jsx | ✓ Working |
| HealthForum | /health-forum | pages/HealthForum.jsx | ✓ Fixed |
| HelpSupport | /help-support | pages/HelpSupport.jsx | ✓ Working |
| LanguageSettings | /language-settings | pages/LanguageSettings.jsx | ✓ Working |
| MedicalHistory | /medical-history | pages/MedicalHistory.jsx | ✓ Working |
| MedicalOrders | /medical-orders | pages/MedicalOrders.jsx | ✓ Fixed |
| Notifications | /notifications | pages/Notifications.jsx | ✓ Working |
| SavedArticles | /saved-articles | pages/SavedArticles.jsx | ✓ Fixed |

## API Entity Definitions

### Core Entities (Fully Functional)
```javascript
base44.entities = {
  ✓ HealthProfile         // User health data
  ✓ SymptomCheck         // Symptom assessments
  ✓ Doctor               // Healthcare providers (with mock data)
  ✓ Appointment          // Appointment bookings
  ✓ HealthRecord         // Medical records
  ✓ MedicineOrder        // Medicine orders
  ✓ LabBooking           // Lab test bookings
  ✓ ForumPost            // Forum discussions [FIXED]
  ✓ ForumReply           // Forum replies [FIXED]
  ✓ ArticleComment       // Article comments [FIXED]
  ✓ PostUpvote           // Post upvotes [FIXED]
  ✓ SavedArticles        // Saved articles [FIXED]
  ✓ HealthArticles       // Health articles [FIXED]
  ✓ LabTests             // Lab test info [FIXED]
  ✓ LabBookingHistory    // Booking history [FIXED]
}
```

### Entity Methods (All Entities)
```javascript
entity.list(sort, limit)              // Get all items
entity.filter(query, sort, limit)     // Filter items
entity.get(id)                        // Get single item
entity.create(data)                   // Create new item
entity.update(id, data)               // Update item
entity.delete(id)                     // Delete item
```

## UI Components Verification

### Location: Components/ui/
- [x] badge.jsx - Status badges
- [x] button.jsx - Button component
- [x] card.jsx - Card container (CardHeader, CardTitle, CardContent)
- [x] checkbox.jsx - Checkbox input
- [x] input.jsx - Text input field
- [x] select.jsx - Select dropdown
- [x] skeleton.jsx - Loading skeleton
- [x] switch.jsx - Toggle switch
- [x] tabs.jsx - Tab component
- [x] textarea.jsx - Text area input
- [x] SwasthAILogo.jsx - App logo

## Common Features Across Pages

### Data Fetching Pattern
```javascript
const { data, isLoading, error } = useQuery({
  queryKey: ['entityName'],
  queryFn: () => base44.entities.EntityName.list(),
  enabled: !!user
});
```

### Error Handling Pattern
```javascript
try {
  const result = await base44.entities.Entity.method();
  if (!result) {
    // Handle null/undefined
  }
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly message
}
```

### Loading State Pattern
```javascript
{isLoading ? (
  <div className="space-y-3">
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
) : data.length === 0 ? (
  <EmptyState />
) : (
  <DataDisplay />
)}
```

## CSS/Styling Standards

### Tailwind Classname Patterns
- Colors: `text-blue-600`, `bg-blue-50`, `border-blue-100`
- Spacing: `px-4`, `py-6`, `gap-3`, `mb-4`
- Rounded: `rounded-xl`, `rounded-full`
- Shadows: `shadow-md`, `shadow-lg`
- Sizing: `min-h-screen`, `w-full`, `max-w-lg`
- States: `hover:`, `active:`, `disabled:`, `focus:`

### Color Palette Used
- Primary: Blue (#2563eb)
- Success: Green (#10b981)
- Warning: Yellow/Amber (#f59e0b)
- Error: Red (#ef4444)
- Neutral: Gray (#6b7280)
- Background: Gray-50 (#f9fafb)

## Debugging Commands

### Check Build Status
```bash
npm run build  # Check for build errors
```

### Clear Cache & Reinstall
```bash
rm -r node_modules
rm package-lock.json
npm install --legacy-peer-deps
npm run dev
```

### Check Port Availability
```bash
# Windows - Find process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Validate JavaScript Syntax
```javascript
// In DevTools Console
import('./api/base44Client.js').then(m => console.log(m.base44.entities))
```

## Console Debugging Tips

### Check if API Client is Loaded
```javascript
// In browser DevTools console
console.log(window.base44 || 'Not found')
```

### Test Entity Calls
```javascript
// In browser DevTools console
import { base44 } from '@/api/base44Client'
base44.entities.Doctor.list().then(console.log)
```

### Check React Query State
```javascript
// Install React Query DevTools
npm install @tanstack/react-query-devtools
// Then add to App.jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
<ReactQueryDevtools initialIsOpen={false} />
```

## Performance Metrics

### Bundle Size Targets
- Main bundle: < 500KB
- Each vendor chunk: < 300KB
- Total with vendors: < 2MB

### Key Optimization Done
- Code splitting by route
- Async component imports
- Manual chunk configuration in vite.config.js
- Query caching (5 minute stale time)

## Security Considerations

### Current Setup (Development)
- Mock authentication via localStorage
- Mock API calls with simulated delays
- No real sensitive data transmission
- CORS enabled for development

### For Production
1. Implement real OAuth/JWT authentication
2. Use environment variables for API keys (not in code)
3. Add request signing/validation
4. Implement HTTPS only
5. Add CSRF protection
6. Validate all user inputs server-side
7. Implement rate limiting
8. Add security headers (CSP, X-Frame-Options, etc.)

## Known Limitations & Notes

1. **React Leaflet Version**: Using legacy-peer-deps due to React 18 compatibility issue
2. **Mock Data**: All API responses are mocked; no real backend connection
3. **Local Storage**: User auth stored in localStorage (not secure for production)
4. **File Upload**: Prescription upload is simulated; files not actually processed
5. **Real-time**: No WebSocket connection; all data is fetched on demand
6. **Offline Support**: No service worker; requires internet connection

## Testing Workflow

### Step 1: Start Dev Server
```bash
cd c:\Users\Rishabh\OneDrive\Desktop\Coding\SwasthAI
npm run dev
```

### Step 2: Open in Browser
Navigate to `http://localhost:5175/`

### Step 3: Test Each Page Category

**Category: Doctor Services**
1. Navigate to Home
2. Click "Find Doctor"
3. Search by specialty or location
4. View doctor details
5. Book an appointment

**Category: Lab Services**
1. Navigate to "Lab Tests" from home
2. Select tests from available list
3. Choose home collection or lab visit
4. Select date and time
5. Confirm booking
6. View in booking history

**Category: Pharmacy**
1. Go to Pharmacy page
2. Browse medicines or upload prescription
3. Add items to cart
4. Complete checkout
5. View order in Medical Orders page

**Category: Forum**
1. Navigate to Health Forum
2. Browse existing discussions
3. Create a new post
4. Write title and content
5. Select category and post
6. View new post in forum

### Step 4: Check Console
Press F12 to open DevTools and check:
- Network tab: API calls being made
- Console tab: Any error messages
- Application tab: localStorage data

## Frequently Asked Questions

### Q: Why does the app require `--legacy-peer-deps`?
A: Because react-leaflet@5.0.0 requires React 19, but the project uses React 18. This is just a warning and doesn't affect functionality.

### Q: Are the pages actually connected to a real backend?
A: No, all data is mocked with realistic sample data. The base44 API is simulated for development/demo purposes.

### Q: How do I test the app without internet?
A: All features work offline since they're using mock data. However, real map functionality (in DoctorMap) requires internet.

### Q: Where is user data stored?
A: Locally in browser localStorage. This is for development only; production should use a real database.

### Q: Why do some pages load slowly?
A: Some pages have intentional delays in the mock API to simulate real network conditions. This can be adjusted in base44Client.js.

## Commit History

```
commit: Fix missing entities and standardize import paths
- Added ForumPost, ForumReply, ArticleComment, PostUpvote, SavedArticles, HealthArticles, LabTests, LabBookingHistory entities
- Fixed import path in LabBooking.jsx from '../utils' to '@/utils'
- Verified all pages have correct imports and entity definitions
- All 29 pages now functional
```

## Final Status

✓ **All Critical Issues Resolved**
✓ **All 29 Pages Functional**
✓ **All Entity Definitions Complete**
✓ **Import Paths Standardized**
✓ **Ready for Development/Testing**

---

Last Updated: December 29, 2025
All Systems: ✓ GO
