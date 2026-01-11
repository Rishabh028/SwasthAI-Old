import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Star, Clock, Video, MapPin, Languages, 
  Calendar, GraduationCap, Award, CheckCircle, ChevronRight, Building
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { format, addDays } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function DoctorProfile() {
  const [doctorId, setDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [consultationType, setConsultationType] = useState('online');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDoctorId(params.get('id'));
  }, []);

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: async () => {
      const doctors = await base44.entities.Doctor.filter({ id: doctorId });
      return doctors[0];
    },
    enabled: !!doctorId
  });

  // Generate available dates and slots
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      day: format(date, 'EEE'),
      dayNum: format(date, 'd'),
      month: format(date, 'MMM'),
      isToday: i === 0
    };
  });

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM'
  ];

  const createAppointment = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Appointment.create({
        doctor_id: doctorId,
        doctor_name: doctor.name,
        doctor_specialty: doctor.specialty,
        doctor_photo: doctor.photo_url,
        appointment_type: consultationType,
        date: selectedDate,
        time: selectedSlot,
        clinic_address: doctor.clinic_address,
        fee: doctor.consultation_fee,
        status: 'scheduled',
        payment_status: 'pending'
      });
    },
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      navigate(createPageUrl(`Appointments?new=${appointment.id}`));
    }
  });

  if (isLoading || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700">
        <Link to={createPageUrl('FindDoctor')}>
          <button className="absolute top-4 left-4 p-2 rounded-xl bg-white/20 backdrop-blur-sm">
            <ArrowLeft size={20} className="text-white" />
          </button>
        </Link>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-lg"
        >
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden flex-shrink-0">
              {doctor.photo_url ? (
                <img src={doctor.photo_url} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">{doctor.name?.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Dr. {doctor.name}</h1>
              <p className="text-blue-600 font-medium">{doctor.specialty}</p>
              <p className="text-sm text-gray-500 mt-1">{doctor.qualification}</p>
              
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{doctor.rating || '4.5'}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>{doctor.experience_years}+ years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-purple-700">
                <Video size={16} />
                <span className="text-sm font-medium">Online Consult</span>
              </div>
              <p className="text-lg font-bold text-purple-800 mt-1">₹{doctor.consultation_fee || 500}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-green-700">
                <MapPin size={16} />
                <span className="text-sm font-medium">Clinic Visit</span>
              </div>
              <p className="text-lg font-bold text-green-800 mt-1">₹{(doctor.consultation_fee || 500) + 100}</p>
            </div>
          </div>
        </motion.div>

        {/* Clinic Location Map */}
        {doctor.clinic_address && (
          <div className="bg-white rounded-2xl p-5 mt-4">
            <h2 className="font-bold text-gray-900 mb-3">Clinic Location</h2>
            <div className="h-48 rounded-xl overflow-hidden mb-3">
              <MapContainer 
                center={[26.1445 + (Math.random() - 0.5) * 0.05, 91.7362 + (Math.random() - 0.5) * 0.05]} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[26.1445 + (Math.random() - 0.5) * 0.05, 91.7362 + (Math.random() - 0.5) * 0.05]}>
                  <Popup>{doctor.clinic_name || 'Clinic Location'}</Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="flex items-start gap-2">
              <Building size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">{doctor.clinic_name}</p>
                <p className="text-sm text-gray-600">{doctor.clinic_address}</p>
              </div>
            </div>
          </div>
        )}

        {/* About */}
        <div className="bg-white rounded-2xl p-5 mt-4">
          <h2 className="font-bold text-gray-900 mb-3">About Doctor</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Qualification</p>
                <p className="text-sm text-gray-500">{doctor.qualification}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <Award size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Experience</p>
                <p className="text-sm text-gray-500">{doctor.experience_years}+ years of practice</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Languages size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Languages</p>
                <p className="text-sm text-gray-500">{doctor.languages?.join(', ') || 'English, Hindi'}</p>
              </div>
            </div>
            {doctor.clinic_address && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Clinic</p>
                  <p className="text-sm text-gray-500">{doctor.clinic_name}</p>
                  <p className="text-xs text-gray-400">{doctor.clinic_address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Consultation Type */}
        <div className="bg-white rounded-2xl p-5 mt-4">
          <h2 className="font-bold text-gray-900 mb-3">Consultation Type</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setConsultationType('online')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                consultationType === 'online'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200'
              }`}
            >
              <Video size={24} className={consultationType === 'online' ? 'text-purple-600' : 'text-gray-400'} />
              <p className={`font-medium mt-2 ${consultationType === 'online' ? 'text-purple-700' : 'text-gray-700'}`}>
                Video Call
              </p>
              <p className="text-sm text-gray-500 mt-1">₹{doctor.consultation_fee || 500}</p>
            </button>
            <button
              onClick={() => setConsultationType('offline')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                consultationType === 'offline'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              <MapPin size={24} className={consultationType === 'offline' ? 'text-green-600' : 'text-gray-400'} />
              <p className={`font-medium mt-2 ${consultationType === 'offline' ? 'text-green-700' : 'text-gray-700'}`}>
                Clinic Visit
              </p>
              <p className="text-sm text-gray-500 mt-1">₹{(doctor.consultation_fee || 500) + 100}</p>
            </button>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-2xl p-5 mt-4">
          <h2 className="font-bold text-gray-900 mb-3">Select Date</h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {availableDates.map((d) => (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`flex-shrink-0 w-16 p-3 rounded-xl text-center transition-all ${
                  selectedDate === d.date
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <p className="text-xs font-medium">{d.day}</p>
                <p className="text-xl font-bold">{d.dayNum}</p>
                <p className="text-xs">{d.month}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 mt-4"
          >
            <h2 className="font-bold text-gray-900 mb-3">Select Time</h2>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedSlot === slot
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40">
        <Button
          onClick={() => createAppointment.mutate()}
          disabled={!selectedDate || !selectedSlot || createAppointment.isPending}
          className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-lg shadow-lg shadow-blue-500/30 disabled:opacity-50"
        >
          {createAppointment.isPending ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Booking...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle size={20} />
              Confirm Booking • ₹{consultationType === 'online' ? doctor.consultation_fee || 500 : (doctor.consultation_fee || 500) + 100}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}