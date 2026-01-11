import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import SwasthAILogo from '@/Components/ui/SwasthAILogo';
import QuickActions from '@/Components/home/QuickActions';
import UpcomingAppointments from '@/Components/home/UpcomingAppointments';
import HealthTips from '@/Components/home/HealthTips';
import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Home() {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('Hello');

  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.filter({ status: 'scheduled' }, '-date', 5),
    enabled: !!user
  });

  const { data: profile } = useQuery({
    queryKey: ['healthProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.HealthProfile.filter({ created_by: user?.email }, '-created_date', 1);
      return profiles[0];
    },
    enabled: !!user
  });

  useEffect(() => {
    // Check if onboarding is needed
    if (user && profile === undefined) return; // Still loading
    if (user && !profile) {
      // No profile exists, redirect to onboarding
      navigate(createPageUrl('Onboarding'));
    } else if (user && profile && !profile.onboarding_completed) {
      // Profile exists but onboarding not completed
      navigate(createPageUrl('Onboarding'));
    }
  }, [user, profile, navigate]);

  const userName = user?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-6 rounded-b-3xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <SwasthAILogo size="small" />
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-500 text-sm">{greeting}</p>
          <h1 className="text-2xl font-bold text-gray-900">{userName} 👋</h1>
          
          {!profile?.onboarding_completed && (
            <Link to={createPageUrl('Onboarding')}>
              <div className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 flex items-center justify-between">
                <div className="text-white">
                  <p className="font-medium text-sm">Complete your profile</p>
                  <p className="text-blue-100 text-xs">Get personalized health guidance</p>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
            </Link>
          )}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4"
        >
          <Link to={createPageUrl('FindDoctor')}>
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
              <Search size={20} className="text-gray-400" />
              <span className="text-gray-400 text-sm">Search doctors, symptoms, medicines...</span>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="pt-6 pb-4">
        <QuickActions />
        <UpcomingAppointments appointments={appointments} />
        <HealthTips />

        {/* ABHA Integration Banner */}
        {profile && !profile.abha_linked && (
          <div className="px-4 mt-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏥</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Link ABHA Health ID</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create your digital health record linked to government systems
                  </p>
                  <Link to={createPageUrl('Profile')}>
                    <button className="mt-3 text-sm font-medium text-green-600">
                      Link Now →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        <div className="px-4 mt-6 mb-4">
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">🚨</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Medical Emergency?</span> Call 108
                </p>
              </div>
              <a href="tel:108" className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}