# SwasthAI - Quick Start Guide

## 🚀 Quick Setup

### 1. Install All Dependencies
```bash
cd "C:\Users\Rishabh\OneDrive\Desktop\Coding\SwasthAI"
npm install --legacy-peer-deps
```

### 2. Start Development Server
```bash
npm run dev
```

**Access the app at**: 
- http://localhost:5173/ 
- or http://localhost:5174/ (if 5173 is busy)

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📂 Project Structure

```
SwasthAI/
├── pages/              # All page components (20+ pages)
│   ├── Home.jsx
│   ├── SymptomChecker.jsx
│   ├── FindDoctor.jsx
│   ├── Appointments.jsx
│   └── ...
├── Components/         # Reusable components
│   ├── ui/            # UI elements (button, input, card, etc.)
│   ├── home/          # Home page components
│   ├── doctor/        # Doctor-related components
│   ├── records/       # Health record components
│   ├── symptom/       # Symptom checker components
│   └── common/        # Common components (BottomNav)
├── Entities/          # Data schemas
├── api/               # Backend API client
├── lib/               # Utility functions
├── App.jsx            # Main app component
├── layout.jsx         # Layout wrapper
├── main.jsx           # Entry point
└── package.json       # Dependencies
```

---

## 🎯 Key Features

| Feature | Page | Status |
|---------|------|--------|
| Dashboard | Home.jsx | ✅ |
| Symptom Check | SymptomChecker.jsx | ✅ |
| Find Doctors | FindDoctor.jsx | ✅ |
| Book Appointments | BookAppointment.jsx | ✅ |
| Health Articles | HealthArticles.jsx | ✅ |
| Health Forum | HealthForum.jsx | ✅ |
| Pharmacy | Pharmacy.jsx | ✅ |
| Lab Tests | LabTests.jsx | ✅ |
| Health Records | HealthRecords.jsx | ✅ |
| User Profile | Profile.jsx | ✅ |

---

## 📦 Core Dependencies

- **React 18.3.1** - UI Framework
- **React Router 6.30.2** - Routing
- **Tailwind CSS 3.4.0** - Styling
- **React Query 5.90.12** - State Management
- **Framer Motion 10.18.0** - Animations
- **Lucide React** - Icons
- **Leaflet + React-Leaflet** - Maps
- **React-Markdown** - Markdown rendering

---

## ✅ Issues Fixed

✅ **react-leaflet missing** - INSTALLED
✅ **lucide-react missing** - INSTALLED
✅ **react-markdown missing** - INSTALLED
✅ **MessageSquare error** - FIXED

---

## 🔌 Backend Integration

**API Service**: Base44
**Endpoints**: Configured in `api/base44Client.js`

Available entities:
- Appointment
- Doctor
- HealthRecord
- ForumPost
- LabBooking
- MedicineOrder

---

## 🎨 Component Organization

### UI Components (`Components/ui/`)
- button.jsx
- input.jsx
- card.jsx
- checkbox.jsx
- badge.jsx
- tabs.jsx
- textarea.jsx
- select.jsx
- skeleton.jsx
- switch.jsx

### Page Components
- Each page in `pages/` is a standalone feature
- Uses React Query for data fetching
- Styled with Tailwind CSS
- Animated with Framer Motion

### Custom Components
- QuickActions - Feature cards on home
- DoctorCard - Doctor listing component
- RecordCard - Health record display
- SymptomInput - Symptom input form
- AssessmentResult - Results display

---

## 🔧 Configuration

### Vite Config
- Port: 5173 (or 5174 if busy)
- Module alias: `@` → root directory
- Host: All interfaces

### Tailwind Config
- Custom colors and utilities
- Responsive design support
- Animation support

### React Query Config
- Stale time: 5 minutes
- Cache time: 10 minutes
- Auto-retry: 1 attempt

---

## 🚨 Common Issues & Solutions

### Issue: "Port 5173 already in use"
**Solution**: App automatically switches to port 5174

### Issue: Module not found "@/..."
**Solution**: Vite alias @ is configured to root directory

### Issue: React version mismatch warnings
**Solution**: Using `--legacy-peer-deps` - this is intentional and safe

### Issue: API not responding
**Solution**: Check Base44 API credentials in `api/base44Client.js`

---

## 📱 Mobile Responsive

- Designed mobile-first
- Bottom navigation bar (BottomNav)
- Touch-friendly components
- Responsive images

---

## 🔐 Security Notes

- API keys in `api/base44Client.js` - should be in environment variables for production
- No authentication tokens visible in frontend code
- Base44 handles user authentication

---

## 📚 Further Learning

1. Check `QUICK_START.md` for API setup
2. Review `API_CONFIGURATION.md` for endpoint details
3. Check component files for implementation details
4. Review Tailwind docs for styling customization

---

## 📊 Development Workflow

```
1. Start dev server: npm run dev
2. Make code changes (auto-reload enabled)
3. Test in browser: http://localhost:5174/
4. Build when ready: npm run build
5. Deploy to production
```

---

## 🎯 Next Steps

1. **Test the application** in your browser
2. **Configure API credentials** if needed
3. **Customize styles** in Tailwind config
4. **Add new features** following existing patterns
5. **Deploy** when ready for production

---

**Happy Coding! 🎉**

For detailed analysis, see `PROJECT_ANALYSIS.md`
