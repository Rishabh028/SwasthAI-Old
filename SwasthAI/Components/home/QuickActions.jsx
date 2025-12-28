import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Pill, Microscope, Heart, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Stethoscope,
      label: 'Find Doctor',
      path: '/find-doctor',
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      icon: Heart,
      label: 'Symptom Check',
      path: '/symptom-checker',
      color: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      icon: Pill,
      label: 'Pharmacy',
      path: '/pharmacy',
      color: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      icon: Microscope,
      label: 'Lab Tests',
      path: '/lab-tests',
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      icon: FileText,
      label: 'Records',
      path: '/health-records',
      color: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-5 gap-2">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center`}>
              <action.icon className={`w-6 h-6 ${action.textColor}`} />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}