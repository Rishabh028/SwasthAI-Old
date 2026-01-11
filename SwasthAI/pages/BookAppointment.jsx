import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  Video,
  Building2,
  FileText,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { format, addDays } from 'date-fns';

export default function BookAppointment() {
  const [doctor, setDoctor] = useState(null);
  const [consultationType, setConsultationType] = useState('online');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const params = new URLSearchParams(window.location.search);
      const doctorId = params.get('doctorId');
      const type = params.get('type');
      
      if (doctorId) {
        const doctors = await base44.entities.Doctor.filter({ id: doctorId });
        if (doctors.length > 0) {
          setDoctor(doctors[0]);
          setConsultationType(type || 'online');
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking() {
    if (!selectedDate || !selectedTime || !doctor) return;

    setBooking(true);
    try {
      const appointment = await base44.entities.Appointment.create({
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        doctor_specialty: doctor.specialty,
        doctor_photo: doctor.photo_url,
        appointment_type: consultationType,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        symptoms: symptoms,
        status: 'scheduled',
        fee: doctor.consultation_fee || 500,
        payment_status: 'paid',
        clinic_address: consultationType === 'offline' ? doctor.clinic_address : null
      });

      navigate(createPageUrl('AppointmentConfirmation') + `?id=${appointment.id}`);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setBooking(false);
    }
  }

  // Generate next 7 days
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Generate time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <p className="text-gray-500 mb-4">Doctor not found</p>
        <Button onClick={() => navigate(createPageUrl('DoctorSearch'))}>
          Back to Search
        </Button>
      </div>
    );
  }

  const canProceed = selectedDate && selectedTime;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(createPageUrl('DoctorProfile') + `?id=${doctor.id}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Book Appointment</h1>
            <p className="text-xs text-gray-500">Dr. {doctor.name}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Consultation Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {consultationType === 'online' ? <Video className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
              {consultationType === 'online' ? 'Online Video Consultation' : 'Clinic Visit'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {consultationType === 'online' 
                ? 'Connect with the doctor via secure video call from anywhere'
                : `Visit the doctor at ${doctor.clinic_name || 'clinic'}`
              }
            </p>
          </CardContent>
        </Card>

        {/* Select Date */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {availableDates.map((date, index) => {
                const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                const isToday = index === 0;
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xs font-medium mb-1">
                      {format(date, 'EEE')}
                    </span>
                    <span className="text-lg font-bold">
                      {format(date, 'd')}
                    </span>
                    {isToday && (
                      <span className={`text-[10px] mt-1 ${isSelected ? 'text-blue-100' : 'text-blue-600'}`}>
                        Today
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Select Time */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Select Time Slot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Symptoms/Reason */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Reason for Visit (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Briefly describe your symptoms or reason for consultation..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-24"
            />
            <p className="text-xs text-gray-500 mt-2">
              This helps the doctor prepare for your consultation
            </p>
          </CardContent>
        </Card>

        {/* Summary */}
        {canProceed && (
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Doctor</span>
                <span className="font-semibold text-gray-900">Dr. {doctor.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Specialty</span>
                <span className="font-semibold text-gray-900">{doctor.specialty}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-semibold text-gray-900">
                  {format(selectedDate, 'MMM dd, yyyy')} • {selectedTime}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type</span>
                <span className="font-semibold text-gray-900 capitalize">{consultationType}</span>
              </div>
              <div className="border-t border-blue-200 pt-3 flex justify-between">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="text-xl font-bold text-blue-600">₹{doctor.consultation_fee || '500'}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
          onClick={handleBooking}
          disabled={!canProceed || booking}
        >
          {booking ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirm & Pay ₹{doctor.consultation_fee || '500'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
