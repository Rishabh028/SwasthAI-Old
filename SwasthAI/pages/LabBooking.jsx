import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft,
  Activity,
  Home as HomeIcon,
  Building2,
  Calendar,
  Clock,
  IndianRupee,
  CheckCircle,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, addDays } from 'date-fns';

export default function LabBooking() {
  const [selectedTests, setSelectedTests] = useState([]);
  const [bookingType, setBookingType] = useState('home_collection');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const popularTests = [
    { name: 'Complete Blood Count (CBC)', price: 300, description: 'Basic blood test' },
    { name: 'Lipid Profile', price: 500, description: 'Cholesterol levels' },
    { name: 'Blood Sugar (Fasting)', price: 150, description: 'Diabetes screening' },
    { name: 'Thyroid Profile (T3, T4, TSH)', price: 600, description: 'Thyroid function' },
    { name: 'Liver Function Test (LFT)', price: 450, description: 'Liver health' },
    { name: 'Kidney Function Test (KFT)', price: 400, description: 'Kidney health' },
    { name: 'Vitamin D Test', price: 800, description: 'Vitamin D levels' },
    { name: 'HbA1c', price: 350, description: 'Long-term sugar control' }
  ];

  const filteredTests = popularTests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableDates = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));
  const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  function toggleTest(test) {
    if (selectedTests.find(t => t.name === test.name)) {
      setSelectedTests(selectedTests.filter(t => t.name !== test.name));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  }

  function getTotalAmount() {
    return selectedTests.reduce((sum, test) => sum + test.price, 0);
  }

  async function handleBooking() {
    if (selectedTests.length === 0 || !selectedDate || !selectedTime) {
      alert('Please select tests, date and time');
      return;
    }

    try {
      await base44.entities.LabBooking.create({
        lab_name: 'SwasthAI Partner Lab',
        tests: selectedTests,
        total_amount: getTotalAmount(),
        booking_type: bookingType,
        address: bookingType === 'home_collection' ? address : null,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time_slot: selectedTime,
        status: 'booked'
      });

      alert('Lab test booked successfully!');
      navigate(createPageUrl('Home'));
    } catch (error) {
      console.error('Error booking test:', error);
      alert('Failed to book test');
    }
  }

  const canProceed = selectedTests.length > 0 && selectedDate && selectedTime && 
    (bookingType === 'lab_visit' || address);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(createPageUrl('Home'))}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Book Lab Test</h1>
            <p className="text-orange-100 text-sm">At home or lab visit</p>
          </div>
        </div>

        {/* Type Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setBookingType('home_collection')}
            className={`p-4 rounded-xl transition-all ${
              bookingType === 'home_collection'
                ? 'bg-white text-orange-600'
                : 'bg-white/20 text-white border border-white/30'
            }`}
          >
            <HomeIcon className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-semibold">Home Collection</p>
          </button>

          <button
            onClick={() => setBookingType('lab_visit')}
            className={`p-4 rounded-xl transition-all ${
              bookingType === 'lab_visit'
                ? 'bg-white text-orange-600'
                : 'bg-white/20 text-white border border-white/30'
            }`}
          >
            <Building2 className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-semibold">Lab Visit</p>
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Search Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              Select Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2">
              {filteredTests.map((test) => {
                const isSelected = selectedTests.find(t => t.name === test.name);
                
                return (
                  <button
                    key={test.name}
                    onClick={() => toggleTest(test)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                        isSelected
                          ? 'border-orange-600 bg-orange-600'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{test.name}</p>
                        <p className="text-xs text-gray-600 mb-2">{test.description}</p>
                        <p className="text-sm font-bold text-orange-600">₹{test.price}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Tests Summary */}
        {selectedTests.length > 0 && (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Selected Tests ({selectedTests.length})
              </h3>
              <div className="space-y-1 mb-3">
                {selectedTests.map((test, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">{test.name}</span>
                    <span className="font-medium">₹{test.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-orange-300 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-orange-600">₹{getTotalAmount()}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Date Selection */}
        {selectedTests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {availableDates.map((date, index) => {
                  const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xs font-medium mb-1">
                        {format(date, 'EEE')}
                      </span>
                      <span className="text-lg font-bold">
                        {format(date, 'd')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Selection */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Select Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-md'
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

        {/* Address (for home collection) */}
        {bookingType === 'home_collection' && selectedTime && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <HomeIcon className="w-5 h-5 text-orange-600" />
                Collection Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter your complete address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">
                Our phlebotomist will visit you at this address
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      {selectedTests.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <Button 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-base font-semibold"
            onClick={handleBooking}
            disabled={!canProceed}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Book Now • ₹{getTotalAmount()}
          </Button>
        </div>
      )}
    </div>
  );
}
