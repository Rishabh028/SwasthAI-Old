import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Calendar, Clock, Video, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function UpcomingAppointments({ appointments }) {
  if (!appointments || appointments.length === 0) {
    return null;
  }

  const upcoming = appointments
    .filter(a => a.status === 'scheduled')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 2);

  if (upcoming.length === 0) return null;

  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">Upcoming</h2>
        <Link 
          to={createPageUrl('Appointments')} 
          className="text-blue-600 text-sm font-medium flex items-center gap-1"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <div className="space-y-3">
        {upcoming.map((apt, index) => (
          <motion.div
            key={apt.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                {apt.doctor_photo ? (
                  <img 
                    src={apt.doctor_photo} 
                    alt={apt.doctor_name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {apt.doctor_name?.charAt(0) || 'D'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  Dr. {apt.doctor_name}
                </h3>
                <p className="text-sm text-gray-500">{apt.doctor_specialty}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Calendar size={12} />
                    <span>{format(new Date(apt.date), 'MMM d')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock size={12} />
                    <span>{apt.time}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                    apt.appointment_type === 'online' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {apt.appointment_type === 'online' ? <Video size={10} /> : <MapPin size={10} />}
                    <span className="capitalize">{apt.appointment_type}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}