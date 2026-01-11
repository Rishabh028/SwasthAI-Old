import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './layout.jsx';

// Import all pages
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
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
import LabBookingHistory from './pages/LabBookingHistory.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Pharmacy from './pages/Pharmacy.jsx';
import Profile from './pages/Profile.jsx';
import ABHALink from './pages/ABHALink.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import CreatePost from './pages/CreatePost.jsx';
import DoctorMap from './pages/DoctorMap.jsx';
import ForumPost from './pages/ForumPost.jsx';
import HealthArticles from './pages/HealthArticles.jsx';
import HealthCoach from './pages/HealthCoach.jsx';
import HealthForum from './pages/HealthForum.jsx';
import HelpSupport from './pages/HelpSupport.jsx';
import LanguageSettings from './pages/LanguageSettings.jsx';
import MedicalHistory from './pages/MedicalHistory.jsx';
import MedicalOrders from './pages/MedicalOrders.jsx';
import MedicineOrderHistory from './pages/MedicineOrderHistory.jsx';
import Notifications from './pages/Notifications.jsx';
import SavedArticles from './pages/SavedArticles.jsx';

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

  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem('authToken');
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  useEffect(() => {
    // If not authenticated and not on auth page, redirect to login
    if (!isAuthenticated && !isAuthPage && location.pathname !== '/') {
      // Allow root path to redirect as needed
    }

    // Map routes to page names
    const pathToPageName = {
      '/': 'Home',
      '/home': 'Home',
      '/login': 'Login',
      '/signup': 'Signup',
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
      '/lab-booking-history': 'LabBookingHistory',
      '/onboarding': 'Onboarding',
      '/pharmacy': 'Pharmacy',
      '/profile': 'Profile',
      '/abha-link': 'ABHALink',
      '/article-detail': 'ArticleDetail',
      '/create-post': 'CreatePost',
      '/doctor-map': 'DoctorMap',
      '/forum-post': 'ForumPost',
      '/health-articles': 'HealthArticles',
      '/health-coach': 'HealthCoach',
      '/health-forum': 'HealthForum',
      '/help-support': 'HelpSupport',
      '/language-settings': 'LanguageSettings',
      '/medical-history': 'MedicalHistory',
      '/medical-orders': 'MedicalOrders',
      '/medicine-order-history': 'MedicineOrderHistory',
      '/notifications': 'Notifications',
      '/saved-articles': 'SavedArticles',
    };

    // Get the page name from current path
    const pageName = pathToPageName[location.pathname] || 'Home';
    setCurrentPageName(pageName);
  }, [location.pathname]);

  return (
    <>
      {/* Auth Routes - No Layout */}
      {isAuthPage && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      )}

      {/* Protected Routes - With Layout */}
      {!isAuthPage && (
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
            <Route path="/lab-booking-history" element={<LabBookingHistory />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/abha-link" element={<ABHALink />} />
            <Route path="/article-detail" element={<ArticleDetail />} />
            <Route path="/article-detail/:id" element={<ArticleDetail />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/doctor-map" element={<DoctorMap />} />
            <Route path="/forum-post" element={<ForumPost />} />
            <Route path="/forum-post/:id" element={<ForumPost />} />
            <Route path="/health-articles" element={<HealthArticles />} />
            <Route path="/health-coach" element={<HealthCoach />} />
            <Route path="/health-forum" element={<HealthForum />} />
            <Route path="/help-support" element={<HelpSupport />} />
            <Route path="/language-settings" element={<LanguageSettings />} />
            <Route path="/medical-history" element={<MedicalHistory />} />
            <Route path="/medical-orders" element={<MedicalOrders />} />
            <Route path="/medicine-order-history" element={<MedicineOrderHistory />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/saved-articles" element={<SavedArticles />} />
          </Routes>
        </Layout>
      )}
    </>
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