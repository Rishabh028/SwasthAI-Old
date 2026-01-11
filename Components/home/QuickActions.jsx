import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Stethoscope, 
  Video, 
  MapPin, 
  Pill, 
  TestTube, 
  FileText,
  Calendar,
  Phone,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const actions = [
  {
    icon: Stethoscope,
    label: 'Check Symptoms',
    description: 'AI Health Guide',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    page: 'SymptomChecker',
    featured: true
  },
  {
    icon: Video,
    label: 'Consult Online',
    description: 'Video Call',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    page: 'FindDoctor?type=online'
  },
  {
    icon: MapPin,
    label: 'Find Nearby',
    description: 'Clinics & Hospitals',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    page: 'FindDoctor?type=offline'
  },
  {
    icon: Pill,
    label: 'Order Medicines',
    description: 'From Prescription',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    page: 'Pharmacy'
  },
  {
    icon: TestTube,
    label: 'Book Lab Test',
    description: 'Home Collection',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    page: 'LabTests'
  },
  {
    icon: FileText,
    label: 'Health Records',
    description: 'All Documents',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    page: 'HealthRecords'
  },
  {
    icon: BookOpen,
    label: 'Health Articles',
    description: 'Tips & Insights',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    page: 'HealthArticles'
  }
];

export default function QuickActions() {
  return (
    <div className="px-4">
      {/* Featured Action */}
      <Link to={createPageUrl('SymptomChecker')}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 mb-4 shadow-lg shadow-blue-500/20"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-lg font-bold mb-1">Not feeling well?</h3>
              <p className="text-blue-100 text-sm">Check your symptoms with AI</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Stethoscope className="text-white" size={28} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-white/90 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>AI Health Guide Ready</span>
          </div>
        </motion.div>
      </Link>

      {/* Action Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {actions.filter(a => !a.featured).map((action, index) => (
          <Link key={action.label} to={createPageUrl(action.page)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${action.bgColor} rounded-2xl p-4 flex flex-col items-center text-center hover:scale-105 transition-transform`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 shadow-sm`}>
                <action.icon className="text-white" size={20} />
              </div>
              <span className="text-xs font-semibold text-gray-800 leading-tight">{action.label}</span>
              <span className="text-[10px] text-gray-500 mt-0.5">{action.description}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Community Forum Banner */}
      <Link to={createPageUrl('HealthForum')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
            <MessageSquare className="text-white" size={24} />
          </div>
          <div className="flex-1 text-white">
            <h3 className="font-bold text-sm">Join Community Forum</h3>
            <p className="text-green-100 text-xs">Share experiences & get support</p>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}