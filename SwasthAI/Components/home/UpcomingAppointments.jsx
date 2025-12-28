import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../../api/base44Client.js';
import { Card } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UpcomingAppointments() {
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      try {
        return await base44.entities.Appointment?.filter(
          { status: 'scheduled' },
          'appointment_date',
          5
        ) || [];
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 size={24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
        <a href="/appointments" className="text-blue-600 text-sm font-medium hover:underline">
          View All
        </a>
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.slice(0, 3).map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{apt.doctor_name || 'Dr. Smith'}</h3>
                    <p className="text-sm text-gray-600">{apt.specialization || 'General Physician'}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {new Date(apt.appointment_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {apt.appointment_time || '10:00 AM'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-gray-50">
          <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-600">No upcoming appointments</p>
        </Card>
      )}
    </div>
  );
}