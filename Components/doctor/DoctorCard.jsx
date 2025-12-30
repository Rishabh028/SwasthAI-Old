import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Star, Clock, Video, MapPin, Languages, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DoctorCard({ doctor, index = 0 }) {
  return (
    <Link to={createPageUrl(`DoctorProfile?id=${doctor.id}`)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex gap-4">
          {/* Doctor Image */}
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0 overflow-hidden">
            {doctor.photo_url ? (
              <img 
                src={doctor.photo_url} 
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {doctor.name?.charAt(0) || 'D'}
                </span>
              </div>
            )}
          </div>

          {/* Doctor Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">Dr. {doctor.name}</h3>
                <p className="text-sm text-blue-600 font-medium">{doctor.specialty}</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
            </div>
            
            <p className="text-xs text-gray-500 mt-1">{doctor.qualification}</p>
            
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium">{doctor.rating || '4.5'}</span>
                <span className="text-xs text-gray-400">({doctor.reviews_count || 0})</span>
              </div>

              {/* Experience */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} />
                <span>{doctor.experience_years}+ yrs</span>
              </div>
            </div>

            {/* Availability Tags */}
            <div className="flex items-center gap-2 mt-2">
              {doctor.available_online && (
                <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  <Video size={10} />
                  <span>Online</span>
                </div>
              )}
              {doctor.available_offline && (
                <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  <MapPin size={10} />
                  <span>{doctor.city || 'Clinic'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Languages size={12} />
            <span>{doctor.languages?.join(', ') || 'English, Hindi'}</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Consultation Fee</p>
            <p className="text-lg font-bold text-gray-900">₹{doctor.consultation_fee || 500}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}