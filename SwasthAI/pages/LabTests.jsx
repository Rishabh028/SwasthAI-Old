import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, TestTube, Search, Home, Building2, Clock, 
  MapPin, Calendar, ChevronRight, Check, Plus, Minus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, addDays } from 'date-fns';

const popularTests = [
  { name: 'Complete Blood Count (CBC)', price: 350, includes: ['RBC', 'WBC', 'Platelets', 'Hemoglobin'] },
  { name: 'Thyroid Profile (T3, T4, TSH)', price: 600, includes: ['T3', 'T4', 'TSH'] },
  { name: 'Lipid Profile', price: 450, includes: ['Cholesterol', 'Triglycerides', 'HDL', 'LDL'] },
  { name: 'Liver Function Test (LFT)', price: 550, includes: ['SGOT', 'SGPT', 'Bilirubin'] },
  { name: 'Kidney Function Test (KFT)', price: 650, includes: ['Creatinine', 'Urea', 'Uric Acid'] },
  { name: 'Blood Sugar Fasting', price: 80, includes: ['Glucose'] },
  { name: 'HbA1c (Diabetes)', price: 450, includes: ['Glycated Hemoglobin'] },
  { name: 'Vitamin D', price: 900, includes: ['25-OH Vitamin D'] }
];

const healthPackages = [
  { 
    name: 'Basic Health Checkup', 
    price: 999, 
    originalPrice: 1500,
    tests: ['CBC', 'Blood Sugar', 'Lipid Profile', 'Liver Function', 'Kidney Function'],
    popular: true
  },
  { 
    name: 'Diabetes Care Package', 
    price: 1299, 
    originalPrice: 2000,
    tests: ['HbA1c', 'Fasting Sugar', 'Post-Prandial Sugar', 'Lipid Profile', 'KFT']
  },
  { 
    name: 'Full Body Checkup', 
    price: 2499, 
    originalPrice: 4000,
    tests: ['75+ Tests', 'All Vital Organs', 'Thyroid', 'Vitamins', 'Diabetes']
  }
];

export default function LabTests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
  const [bookingType, setBookingType] = useState('home'); // home or lab
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const queryClient = useQueryClient();

  const { data: bookings = [] } = useQuery({
    queryKey: ['labBookings'],
    queryFn: () => base44.entities.LabBooking.list('-created_date', 5)
  });

  const toggleTest = (test) => {
    const exists = selectedTests.find(t => t.name === test.name);
    if (exists) {
      setSelectedTests(selectedTests.filter(t => t.name !== test.name));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const selectPackage = (pkg) => {
    setSelectedTests([{ name: pkg.name, price: pkg.price, isPackage: true }]);
    setShowBookingModal(true);
  };

  const totalAmount = selectedTests.reduce((sum, test) => sum + test.price, 0);

  const availableDates = Array.from({ length: 5 }, (_, i) => {
    const date = addDays(new Date(), i + 1);
    return {
      date: format(date, 'yyyy-MM-dd'),
      day: format(date, 'EEE'),
      dayNum: format(date, 'd'),
      month: format(date, 'MMM')
    };
  });

  const timeSlots = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'];

  const createBooking = useMutation({
    mutationFn: () => base44.entities.LabBooking.create({
      lab_name: 'SwasthAI Diagnostics',
      tests: selectedTests.map(t => ({ name: t.name, price: t.price })),
      total_amount: totalAmount,
      booking_type: bookingType,
      date: selectedDate,
      time_slot: selectedSlot,
      status: 'booked'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labBookings'] });
      setShowBookingModal(false);
      setSelectedTests([]);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Link to={createPageUrl('Home')}>
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Book Lab Tests</h1>
            <p className="text-xs text-gray-500">Home collection available</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tests..."
            className="pl-10 rounded-xl border-gray-200"
          />
        </div>

        {/* Collection Type */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setBookingType('home')}
            className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
              bookingType === 'home' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
            }`}
          >
            <Home size={20} className={bookingType === 'home' ? 'text-pink-600' : 'text-gray-400'} />
            <div className="text-left">
              <p className={`font-medium text-sm ${bookingType === 'home' ? 'text-pink-700' : 'text-gray-700'}`}>
                Home Collection
              </p>
              <p className="text-xs text-gray-500">Sample pickup at home</p>
            </div>
          </button>
          <button
            onClick={() => setBookingType('lab')}
            className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
              bookingType === 'lab' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <Building2 size={20} className={bookingType === 'lab' ? 'text-blue-600' : 'text-gray-400'} />
            <div className="text-left">
              <p className={`font-medium text-sm ${bookingType === 'lab' ? 'text-blue-700' : 'text-gray-700'}`}>
                Visit Lab
              </p>
              <p className="text-xs text-gray-500">Walk-in to lab center</p>
            </div>
          </button>
        </div>
      </div>

      {/* Health Packages */}
      <div className="px-4 py-4">
        <h2 className="font-bold text-gray-900 mb-3">Health Packages</h2>
        <div className="space-y-3">
          {healthPackages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-4 border ${
                pkg.popular ? 'border-pink-200 ring-1 ring-pink-100' : 'border-gray-100'
              }`}
            >
              {pkg.popular && (
                <span className="text-xs font-medium px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="flex items-start justify-between mt-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{pkg.tests.join(' • ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">₹{pkg.price}</p>
                  <p className="text-xs text-gray-400 line-through">₹{pkg.originalPrice}</p>
                </div>
              </div>
              <Button
                onClick={() => selectPackage(pkg)}
                className="w-full mt-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              >
                Book Now
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Individual Tests */}
      <div className="px-4">
        <h2 className="font-bold text-gray-900 mb-3">Popular Tests</h2>
        <div className="space-y-2">
          {popularTests.map((test, index) => {
            const isSelected = selectedTests.some(t => t.name === test.name);
            return (
              <motion.button
                key={test.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => toggleTest(test)}
                className={`w-full bg-white rounded-xl p-4 border transition-all text-left ${
                  isSelected ? 'border-pink-500 bg-pink-50' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-pink-500' : 'bg-purple-50'
                    }`}>
                      {isSelected ? (
                        <Check size={18} className="text-white" />
                      ) : (
                        <TestTube size={18} className="text-purple-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{test.name}</h3>
                      <p className="text-xs text-gray-500">Includes: {test.includes.join(', ')}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">₹{test.price}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Cart Footer */}
      <AnimatePresence>
        {selectedTests.length > 0 && !showBookingModal && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{selectedTests.length} tests selected</p>
                <p className="text-xl font-bold text-gray-900">₹{totalAmount}</p>
              </div>
              <Button 
                onClick={() => setShowBookingModal(true)}
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              >
                Continue
                <ChevronRight size={18} className="ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white rounded-t-3xl p-6 w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Date & Time</h2>
              
              {/* Date Selection */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Choose date</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {availableDates.map((d) => (
                    <button
                      key={d.date}
                      onClick={() => setSelectedDate(d.date)}
                      className={`flex-shrink-0 w-16 p-3 rounded-xl text-center transition-all ${
                        selectedDate === d.date
                          ? 'bg-pink-600 text-white'
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
                  className="mb-6"
                >
                  <p className="text-sm text-gray-600 mb-3">Choose time slot</p>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                          selectedSlot === slot
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Tests</span>
                  <span className="font-medium">{selectedTests.length} selected</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Collection</span>
                  <span className="font-medium capitalize">{bookingType}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-pink-600">₹{totalAmount}</span>
                </div>
              </div>

              <Button
                onClick={() => createBooking.mutate()}
                disabled={!selectedDate || !selectedSlot || createBooking.isPending}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-lg font-semibold"
              >
                {createBooking.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}