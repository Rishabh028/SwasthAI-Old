import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './layout.jsx';

// Import all pages
import Home from './pages/Home.jsx';
import SymptomChecker from './pages/SymptomChecker.jsx';
import Appointments from './pages/Appointments.jsx';
import AppointmentConfirmation from './pages/AppointmentConfirmation.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import DoctorProfile from './pages/DoctorProfile.jsx';
import DoctorSearch from './pages/DoctorSearch.jsx';
import FindDoctor from './pages/FindDoctor.jsx';
import HealthRecords from './pages/HealthRecords.jsx';
import LabBooking from './pages/LabBooking.jsx';
import LabTests from './pages/LabTests.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Pharmacy from './pages/Pharmacy.jsx';
import Profile from './pages/Profile.jsx';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      throwOnError: false,
    },
  },
});

// Router wrapper to get current page
function AppRoutes() {
  const location = useLocation();
  const [currentPageName, setCurrentPageName] = useState('Home');

  useEffect(() => {
    // Map routes to page names
    const pathToPageName = {
      '/': 'Home',
      '/home': 'Home',
      '/symptom-checker': 'SymptomChecker',
      '/appointments': 'Appointments',
      '/appointment-confirmation': 'AppointmentConfirmation',
      '/book-appointment': 'BookAppointment',
      '/doctor-profile': 'DoctorProfile',
      '/doctor-search': 'DoctorSearch',
      '/find-doctor': 'FindDoctor',
      '/health-records': 'HealthRecords',
      '/lab-booking': 'LabBooking',
      '/lab-tests': 'LabTests',
      '/onboarding': 'Onboarding',
      '/pharmacy': 'Pharmacy',
      '/profile': 'Profile',
    };

    // Get the page name from current path
    const pageName = pathToPageName[location.pathname] || 'Home';
    setCurrentPageName(pageName);
  }, [location.pathname]);

  return (
    <Layout currentPageName={currentPageName}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/appointment-confirmation" element={<AppointmentConfirmation />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
        <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
        <Route path="/doctor-search" element={<DoctorSearch />} />
        <Route path="/find-doctor" element={<FindDoctor />} />
        <Route path="/health-records" element={<HealthRecords />} />
        <Route path="/lab-booking" element={<LabBooking />} />
        <Route path="/lab-tests" element={<LabTests />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}