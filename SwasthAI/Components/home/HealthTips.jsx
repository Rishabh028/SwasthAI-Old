import React from 'react';
import { Card } from '../ui/card.jsx';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HealthTips() {
  const tips = [
    {
      id: 1,
      title: 'Stay Hydrated',
      description: 'Drink 8-10 glasses of water daily for better health',
      icon: '💧',
    },
    {
      id: 2,
      title: 'Regular Exercise',
      description: '30 minutes of physical activity every day',
      icon: '🏃',
    },
    {
      id: 3,
      title: 'Healthy Diet',
      description: 'Include fruits and vegetables in your meals',
      icon: '🥗',
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Health Tips</h2>
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tip.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}