import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, MapPin, Navigation, Star } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/Components/ui/button';

// Fix leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function DoctorMap() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => base44.entities.Doctor.list('-rating', 50)
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // Default to Guwahati if location denied
          setUserLocation([26.1445, 91.7362]);
        }
      );
    } else {
      setUserLocation([26.1445, 91.7362]);
    }
  }, []);

  // Mock coordinates for doctors (in production, these would be geocoded from addresses)
  const doctorsWithCoords = doctors.map((doctor, index) => ({
    ...doctor,
    lat: 26.1445 + (Math.random() - 0.5) * 0.1,
    lng: 91.7362 + (Math.random() - 0.5) * 0.1
  }));

  if (!userLocation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm z-50 relative">
        <button 
          onClick={() => navigate(createPageUrl('FindDoctor'))}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Nearby Doctors</h1>
          <p className="text-xs text-gray-500">{doctors.length} doctors found</p>
        </div>
      </div>

      {/* Map */}
      <div className="h-[calc(100vh-180px)]">
        <MapContainer 
          center={userLocation} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {/* User location marker */}
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* Doctor markers */}
          {doctorsWithCoords.map((doctor) => (
            <Marker 
              key={doctor.id} 
              position={[doctor.lat, doctor.lng]}
              eventHandlers={{
                click: () => setSelectedDoctor(doctor)
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold">Dr. {doctor.name}</h3>
                  <p className="text-xs text-gray-600">{doctor.specialty}</p>
                  <p className="text-xs flex items-center justify-center gap-1 mt-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    {doctor.rating || '4.5'}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Selected Doctor Card */}
      {selectedDoctor && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0">
              {selectedDoctor.photo_url ? (
                <img src={selectedDoctor.photo_url} alt={selectedDoctor.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">{selectedDoctor.name?.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Dr. {selectedDoctor.name}</h3>
              <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span>{selectedDoctor.rating || '4.5'}</span>
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-600">₹{selectedDoctor.consultation_fee}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => {
                const address = encodeURIComponent(selectedDoctor.clinic_address || 'hospital');
                window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
              }}
            >
              <Navigation size={16} className="mr-2" />
              Directions
            </Button>
            <Button
              className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate(createPageUrl(`DoctorProfile?id=${selectedDoctor.id}`))}
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}