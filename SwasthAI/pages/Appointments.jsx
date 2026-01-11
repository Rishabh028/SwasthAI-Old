import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar, Clock, Video, MapPin, Phone, MessageCircle, 
  ChevronRight, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const statusConfig = {
  scheduled: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Upcoming'
  },
  in_progress: {
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'In Progress'
  },
  completed: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    label: 'Completed'
  },
  cancelled: {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Cancelled'
  }
};

export default function Appointments() {
  const [filter, setFilter] = useState('upcoming');
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', filter],
    queryFn: async () => {
      let query = {};
      if (filter === 'upcoming') {
        query.status = 'scheduled';
      } else if (filter === 'past') {
        // We'll filter client-side for completed/cancelled
      }
      return base44.entities.Appointment.list('-date', 50);
    },
    enabled: !!user
  });

  const cancelAppointment = useMutation({
    mutationFn: (appointmentId) => 
      base44.entities.Appointment.update(appointmentId, { status: 'cancelled' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'upcoming') return apt.status === 'scheduled' || apt.status === 'in_progress';
    if (filter === 'past') return apt.status === 'completed' || apt.status === 'cancelled';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your consultations</p>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {[
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'Past' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="px-4 py-4 pb-24 space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
              <div className="flex gap-4">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </div>
          ))
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No appointments</h3>
            <p className="text-sm text-gray-500">
              {filter === 'upcoming' 
                ? "You don't have any upcoming appointments"
                : "No past appointments to show"
              }
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredAppointments.map((apt, index) => {
              const config = statusConfig[apt.status] || statusConfig.scheduled;
              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl p-4 border ${config.borderColor}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Doctor Image */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0 overflow-hidden">
                      {apt.doctor_photo ? (
                        <img src={apt.doctor_photo} alt={apt.doctor_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl font-bold text-blue-600">{apt.doctor_name?.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">Dr. {apt.doctor_name}</h3>
                          <p className="text-sm text-gray-500">{apt.doctor_specialty}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.bgColor} ${config.color}`}>
                          {config.label}
                        </span>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar size={14} />
                          <span>{format(new Date(apt.date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Clock size={14} />
                          <span>{apt.time}</span>
                        </div>
                      </div>

                      {/* Type Badge */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          apt.appointment_type === 'online' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {apt.appointment_type === 'online' ? <Video size={12} /> : <MapPin size={12} />}
                          <span className="capitalize">{apt.appointment_type}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">₹{apt.fee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for scheduled appointments */}
                  {apt.status === 'scheduled' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      {apt.appointment_type === 'online' ? (
                        <Button className="flex-1 h-10 rounded-xl bg-green-600 hover:bg-green-700">
                          <Video size={16} className="mr-2" />
                          Join Call
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex-1 h-10 rounded-xl">
                          <MapPin size={16} className="mr-2" />
                          Get Directions
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="h-10 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => cancelAppointment.mutate(apt.id)}
                      >
                        <XCircle size={16} />
                      </Button>
                    </div>
                  )}

                  {/* Clinic address for offline appointments */}
                  {apt.appointment_type === 'offline' && apt.clinic_address && apt.status === 'scheduled' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">📍 {apt.clinic_address}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
