import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, TestTube, Calendar, Clock, CheckCircle, FileText, MapPin, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Skeleton } from '@/Components/ui/skeleton';
import { Button } from '@/Components/ui/button';

const statusConfig = {
  booked: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Booked' },
  sample_collected: { icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Sample Collected' },
  processing: { icon: TestTube, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Processing' },
  report_ready: { icon: FileText, color: 'text-green-600', bg: 'bg-green-50', label: 'Report Ready' },
  cancelled: { icon: CheckCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelled' }
};

export default function LabBookingHistory() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['labBookings'],
    queryFn: () => base44.entities.LabBooking.list('-created_date', 50),
    enabled: !!user
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('LabTests')}>
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Lab Bookings</h1>
            <p className="text-xs text-gray-500">View your test bookings</p>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="px-4 py-4 space-y-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TestTube size={32} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No bookings yet</h3>
            <p className="text-sm text-gray-500 mb-4">Your lab test bookings will appear here</p>
            <Link to={createPageUrl('LabTests')}>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                Book Lab Tests
              </button>
            </Link>
          </div>
        ) : (
          bookings.map((booking, index) => {
            const config = statusConfig[booking.status] || statusConfig.booked;
            const Icon = config.icon;
            
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.lab_name}</h3>
                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${config.bg} ${config.color} font-medium mt-1`}>
                      {config.label}
                    </span>
                  </div>
                  <Icon size={20} className={config.color} />
                </div>

                {/* Tests */}
                <div className="space-y-2 mb-3">
                  {booking.tests?.map((test, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{test.name}</span>
                      <span className="text-gray-900 font-medium">₹{test.price}</span>
                    </div>
                  ))}
                </div>

                {/* Booking Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{booking.date ? format(new Date(booking.date), 'MMM d, yyyy') : '-'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{booking.time_slot || '-'}</span>
                  </div>
                </div>

                {/* Type Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    booking.booking_type === 'home_collection' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {booking.booking_type === 'home_collection' ? <Home size={12} /> : <MapPin size={12} />}
                    <span className="capitalize">{booking.booking_type?.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Total & Address */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Total Amount</span>
                    <span className="text-lg font-bold text-gray-900">₹{booking.total_amount}</span>
                  </div>
                  {booking.address && (
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                      <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{booking.address}</span>
                    </div>
                  )}
                </div>

                {/* Status Tracker */}
                {booking.status !== 'cancelled' && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <div className={`flex flex-col items-center gap-1 ${booking.status === 'booked' || booking.status === 'sample_collected' || booking.status === 'processing' || booking.status === 'report_ready' ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${booking.status === 'booked' || booking.status === 'sample_collected' || booking.status === 'processing' || booking.status === 'report_ready' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                        <span className="font-medium">Booked</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-1 ${booking.status === 'sample_collected' || booking.status === 'processing' || booking.status === 'report_ready' ? 'bg-blue-600' : 'bg-gray-200'}`} />
                      <div className={`flex flex-col items-center gap-1 ${booking.status === 'sample_collected' || booking.status === 'processing' || booking.status === 'report_ready' ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${booking.status === 'sample_collected' || booking.status === 'processing' || booking.status === 'report_ready' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                        <span className="font-medium">Collected</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-1 ${booking.status === 'processing' || booking.status === 'report_ready' ? 'bg-blue-600' : 'bg-gray-200'}`} />
                      <div className={`flex flex-col items-center gap-1 ${booking.status === 'processing' || booking.status === 'report_ready' ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${booking.status === 'processing' || booking.status === 'report_ready' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                        <span className="font-medium">Processing</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-1 ${booking.status === 'report_ready' ? 'bg-blue-600' : 'bg-gray-200'}`} />
                      <div className={`flex flex-col items-center gap-1 ${booking.status === 'report_ready' ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${booking.status === 'report_ready' ? 'bg-green-600' : 'bg-gray-300'}`} />
                        <span className="font-medium">Ready</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Report Download */}
                {booking.report_url && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl"
                      onClick={() => window.open(booking.report_url, '_blank')}
                    >
                      <FileText size={16} className="mr-2" />
                      View Report
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}