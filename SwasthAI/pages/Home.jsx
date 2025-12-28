import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin, ChevronRight } from 'lucide-react';
import { base44 } from '../api/base44Client.js';
import QuickActions from '../Components/home/QuickActions.jsx';
import UpcomingAppointments from '../Components/home/UpcomingAppointments.jsx';
import HealthTips from '../Components/home/HealthTips.jsx';
import { Button } from '../Components/ui/button.jsx';
import { Card } from '../Components/ui/card.jsx';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    // Get greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Fetch user data from Base44
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Try to get current user from Base44
      const currentUser = await base44.auth.currentUser();
      setUser(currentUser || { name: 'John' });
    } catch (error) {
      setUser({ name: 'John' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="px-4 py-4 flex items-center justify-between max-w-2xl mx-auto w-full">
          <div>
            <p className="text-sm text-gray-600">{greeting}</p>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {user?.name || 'User'} 👋
            </h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell size={24} className="text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* Profile Prompt */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-4 max-w-2xl mx-auto w-full"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/profile')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Complete your profile</p>
                <p className="text-sm text-blue-100">Get personalized health guidance</p>
              </div>
              <ChevronRight size={24} />
            </div>
          </Card>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto w-full space-y-6">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors, symptoms, medicines..."
              className="w-full px-4 py-3 pl-10 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              onClick={() => navigate('/find-doctor')}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Emergency Alert */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-red-50 border border-red-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚨</span>
                <div>
                  <p className="font-semibold text-red-900">Medical Emergency?</p>
                  <p className="text-sm text-red-700">Call 108</p>
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white">Call Now</Button>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuickActions />
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <UpcomingAppointments />
        </motion.div>

        {/* Health Tips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <HealthTips />
        </motion.div>
      </main>
    </div>
  );
}