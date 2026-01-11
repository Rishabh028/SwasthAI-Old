import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  CheckCircle, 
  Calendar,
  Clock,
  Video,
  Building2,
  MapPin,
  Home,
  FileText
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { format } from 'date-fns';

export default function AppointmentConfirmation() {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointment();
  }, []);

  async function loadAppointment() {
    try {
      const params = new URLSearchParams(window.location.search);
      const appointmentId = params.get('id');
      
      if (appointmentId) {
        const appointments = await base44.entities.Appointment.filter({ id: appointmentId });
        if (appointments.length > 0) {
          setAppointment(appointments[0]);
        }
      }
    } catch (error) {
      console.error('Error loading appointment:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-green-500 animate-pulse" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <p className="text-gray-500 mb-4">Appointment not found</p>
        <Button onClick={() => navigate(createPageUrl('Home'))}>
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your appointment has been successfully scheduled</p>
        </div>

        {/* Appointment Details */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="text-lg">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Doctor</p>
              <p className="text-lg font-bold text-gray-900">Dr. {appointment.doctor_name}</p>
              <p className="text-sm text-gray-600">{appointment.doctor_specialty}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <p className="text-sm">Date</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {format(new Date(appointment.date), 'MMM dd, yyyy')}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm">Time</p>
                </div>
                <p className="font-semibold text-gray-900">{appointment.time}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                {appointment.appointment_type === 'online' ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <Building2 className="w-4 h-4" />
                )}
                <p className="text-sm">Consultation Type</p>
              </div>
              <p className="font-semibold text-gray-900 capitalize">
                {appointment.appointment_type}
              </p>
            </div>

            {appointment.clinic_address && appointment.appointment_type === 'offline' && (
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <p className="text-sm">Clinic Address</p>
                </div>
                <p className="text-sm text-gray-900">{appointment.clinic_address}</p>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-900 mb-1">Payment Confirmed</p>
              <p className="text-2xl font-bold text-green-700">₹{appointment.fee}</p>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">What happens next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Confirmation sent</p>
                <p className="text-sm text-gray-600">
                  You'll receive a confirmation message with appointment details
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Reminder notification</p>
                <p className="text-sm text-gray-600">
                  We'll remind you 30 minutes before your appointment
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {appointment.appointment_type === 'online' ? 'Join consultation' : 'Visit clinic'}
                </p>
                <p className="text-sm text-gray-600">
                  {appointment.appointment_type === 'online' 
                    ? 'Join the video call from the Appointments section'
                    : 'Visit the clinic at the scheduled time'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
            onClick={() => navigate(createPageUrl('Appointments'))}
          >
            <Calendar className="w-5 h-5 mr-2" />
            View My Appointments
          </Button>

          <Button 
            variant="outline"
            className="w-full h-12"
            onClick={() => navigate(createPageUrl('Home'))}
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact support at{' '}
            <a href="tel:+911234567890" className="text-blue-600 font-medium">
              +91 1234567890
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
