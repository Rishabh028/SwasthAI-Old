import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, Bell, Calendar, Pill, Activity, Shield, 
  Clock, TrendingUp, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/Components/ui/switch';

const notificationSettings = [
  {
    category: 'Appointments',
    icon: Calendar,
    color: 'text-blue-500 bg-blue-50',
    items: [
      { id: 'apt_reminder', label: 'Appointment Reminders', description: '1 day before appointment' },
      { id: 'apt_confirm', label: 'Booking Confirmations', description: 'When appointment is confirmed' },
      { id: 'apt_reschedule', label: 'Reschedule Alerts', description: 'Doctor reschedules appointment' }
    ]
  },
  {
    category: 'Medications',
    icon: Pill,
    color: 'text-orange-500 bg-orange-50',
    items: [
      { id: 'med_reminder', label: 'Medicine Reminders', description: 'Daily medication schedule' },
      { id: 'med_refill', label: 'Refill Reminders', description: 'When running low on medicines' },
      { id: 'med_interaction', label: 'Drug Interactions', description: 'Potential medication conflicts' }
    ]
  },
  {
    category: 'Health Tips',
    icon: TrendingUp,
    color: 'text-green-500 bg-green-50',
    items: [
      { id: 'health_tips', label: 'Daily Health Tips', description: 'Personalized wellness advice' },
      { id: 'health_goals', label: 'Goal Reminders', description: 'Track your health goals' },
      { id: 'health_trends', label: 'Health Trends', description: 'Weekly health insights' }
    ]
  },
  {
    category: 'Activity',
    icon: Activity,
    color: 'text-purple-500 bg-purple-50',
    items: [
      { id: 'lab_results', label: 'Lab Results Ready', description: 'When test results are available' },
      { id: 'record_updates', label: 'Record Updates', description: 'New health records added' },
      { id: 'coach_messages', label: 'AI Coach Messages', description: 'Health coach recommendations' }
    ]
  }
];

export default function Notifications() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    apt_reminder: true,
    apt_confirm: true,
    apt_reschedule: true,
    med_reminder: true,
    med_refill: true,
    med_interaction: true,
    health_tips: false,
    health_goals: true,
    health_trends: false,
    lab_results: true,
    record_updates: false,
    coach_messages: true
  });

  const toggleSetting = (id) => {
    setSettings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 pt-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate(createPageUrl('Profile'))}
            className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Notifications</h1>
            <p className="text-blue-100 text-sm">Manage your notification preferences</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {notificationSettings.map((category, index) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center`}>
                <category.icon size={20} />
              </div>
              <h2 className="font-bold text-gray-900">{category.category}</h2>
            </div>

            <div className="space-y-4">
              {category.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <Switch
                    checked={settings[item.id]}
                    onCheckedChange={() => toggleSetting(item.id)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Notification Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <MessageSquare size={20} className="text-gray-600" />
            </div>
            <h2 className="font-bold text-gray-900">Notification Channels</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">Push Notifications</p>
                <p className="text-xs text-gray-500">Alerts on your device</p>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">SMS Notifications</p>
                <p className="text-xs text-gray-500">Text messages to your phone</p>
              </div>
              <Switch checked={false} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">Email Notifications</p>
                <p className="text-xs text-gray-500">Updates via email</p>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}