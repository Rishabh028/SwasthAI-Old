import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Apple, Moon, Activity } from 'lucide-react';

const tips = [
  {
    icon: Droplets,
    title: 'Stay Hydrated',
    tip: 'Drink 8 glasses of water daily',
    color: 'from-cyan-400 to-cyan-500',
    bgColor: 'bg-cyan-50'
  },
  {
    icon: Apple,
    title: 'Eat Healthy',
    tip: 'Include fruits & vegetables',
    color: 'from-green-400 to-green-500',
    bgColor: 'bg-green-50'
  },
  {
    icon: Moon,
    title: 'Sleep Well',
    tip: '7-8 hours of quality sleep',
    color: 'from-indigo-400 to-indigo-500',
    bgColor: 'bg-indigo-50'
  },
  {
    icon: Activity,
    title: 'Stay Active',
    tip: '30 mins exercise daily',
    color: 'from-orange-400 to-orange-500',
    bgColor: 'bg-orange-50'
  }
];

export default function HealthTips() {
  return (
    <div className="px-4 mt-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Daily Health Tips</h2>
      
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {tips.map((tip, index) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex-shrink-0 w-36 ${tip.bgColor} rounded-2xl p-4`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center mb-3 shadow-sm`}>
              <tip.icon className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">{tip.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{tip.tip}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}