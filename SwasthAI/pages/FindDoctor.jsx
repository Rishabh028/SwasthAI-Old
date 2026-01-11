import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Search, Filter, Video, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import DoctorCard from '@/Components/doctor/DoctorCard';
import { Skeleton } from '@/Components/ui/skeleton';

const specialties = [
  'All', 'General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician',
  'Orthopedic', 'Gynecologist', 'ENT', 'Neurologist', 'Gastroenterologist'
];

export default function FindDoctor() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, online, offline
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Parse URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const specialty = params.get('specialty');
    if (type) setSelectedType(type);
    if (specialty) setSelectedSpecialty(specialty);
  }, []);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ['doctors', selectedSpecialty, selectedType],
    queryFn: async () => {
      let filter = {};
      if (selectedSpecialty !== 'All') {
        filter.specialty = selectedSpecialty;
      }
      if (selectedType === 'online') {
        filter.available_online = true;
      } else if (selectedType === 'offline') {
        filter.available_offline = true;
      }
      return base44.entities.Doctor.filter(filter, '-rating', 20);
    }
  });

  const filteredDoctors = doctors.filter(doc => 
    doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
        <div className="flex items-center gap-4 mb-4">
          <Link to={createPageUrl('Home')}>
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Find Doctors</h1>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or specialty..."
              className="pl-10 rounded-xl border-gray-200"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
            className="rounded-xl border-gray-200"
          >
            <Filter size={18} />
          </Button>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-2 mt-4">
          {[
            { key: 'all', label: 'All' },
            { key: 'online', label: 'Online', icon: Video },
            { key: 'offline', label: 'Nearby', icon: MapPin }
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedType === type.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.icon && <type.icon size={14} />}
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Specialty Pills */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedSpecialty === specialty
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-500">
          {isLoading ? 'Loading...' : `${filteredDoctors.length} doctors found`}
        </p>
      </div>

      {/* Doctor List */}
      <div className="px-4 pb-24 space-y-3">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
              <div className="flex gap-4">
                <Skeleton className="w-20 h-20 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          ))
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No doctors found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredDoctors.map((doctor, index) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={index} />
          ))
        )}
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Specialty</h3>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedSpecialty === specialty
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setShowFilters(false)}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
