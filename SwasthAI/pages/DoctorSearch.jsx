import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star,
  Video,
  Building2,
  Languages,
  IndianRupee,
  ArrowLeft,
  Stethoscope
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DoctorSearch() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [consultationType, setConsultationType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
    
    // Check if specialty passed from symptom checker
    const params = new URLSearchParams(window.location.search);
    const specialty = params.get('specialty');
    if (specialty) {
      setSelectedSpecialty(specialty);
    }
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchQuery, selectedSpecialty, consultationType]);

  async function loadDoctors() {
    try {
      const doctorsList = await base44.entities.Doctor.list('-rating', 50);
      setDoctors(doctorsList);
      setFilteredDoctors(doctorsList);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterDoctors() {
    let filtered = [...doctors];

    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(doc => 
        doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    if (consultationType === 'online') {
      filtered = filtered.filter(doc => doc.available_online);
    } else if (consultationType === 'offline') {
      filtered = filtered.filter(doc => doc.available_offline);
    }

    setFilteredDoctors(filtered);
  }

  const specialties = ['all', 'General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Gynecologist', 'Orthopedic', 'ENT', 'Psychiatrist'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Find Doctors</h1>
              <p className="text-xs text-gray-500">Online & Nearby Specialists</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search doctors, specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={consultationType} onValueChange={setConsultationType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Clinic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Doctor List */}
      <div className="px-4 py-4 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3 animate-pulse" />
            <p className="text-gray-500">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No doctors found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
                setConsultationType('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <Link key={doctor.id} to={createPageUrl('DoctorProfile') + `?id=${doctor.id}`}>
              <Card className="hover:shadow-lg transition-all border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Doctor Image */}
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {doctor.photo_url ? (
                        <img src={doctor.photo_url} alt={doctor.name} className="w-full h-full object-cover" />
                      ) : (
                        <Stethoscope className="w-8 h-8 text-blue-600" />
                      )}
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1">Dr. {doctor.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-gray-900">{doctor.rating || '4.5'}</span>
                          <span className="text-xs text-gray-500">({doctor.reviews_count || '50'})</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-gray-600">
                          <Stethoscope className="w-3 h-3" />
                          <span className="text-xs">{doctor.experience_years}+ yrs</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {doctor.available_online && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                            <Video className="w-3 h-3 mr-1" />
                            Online
                          </Badge>
                        )}
                        {doctor.available_offline && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            <Building2 className="w-3 h-3 mr-1" />
                            Clinic
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gray-600">
                          <IndianRupee className="w-4 h-4" />
                          <span className="text-sm font-semibold text-gray-900">₹{doctor.consultation_fee || '500'}</span>
                          <span className="text-xs text-gray-500">/consult</span>
                        </div>
                        
                        {doctor.next_available && (
                          <span className="text-xs text-green-600 font-medium">
                            Available {doctor.next_available}
                          </span>
                        )}
                      </div>

                      {doctor.city && (
                        <div className="flex items-center gap-1 text-gray-500 mt-2">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">{doctor.city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
