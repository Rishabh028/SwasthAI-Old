import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/Components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Video, 
  MapPin,
  Home,
  ChevronRight,
  Stethoscope,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

const severityConfig = {
  mild: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    title: 'Low Risk',
    description: 'Your symptoms appear mild'
  },
  moderate: {
    icon: AlertCircle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    title: 'Moderate Risk',
    description: 'Consider consulting a doctor'
  },
  severe: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    title: 'High Risk',
    description: 'Seek medical attention soon'
  }
};

export default function AssessmentResult({ assessment }) {
  const severity = severityConfig[assessment.severity] || severityConfig.mild;
  const SeverityIcon = severity.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Severity Card */}
      <div className={`${severity.bgColor} ${severity.borderColor} border rounded-2xl p-5`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${severity.bgColor}`}>
            <SeverityIcon className={severity.color} size={28} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${severity.color}`}>{severity.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{severity.description}</p>
          </div>
        </div>
      </div>

      {/* AI Assessment */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Heart className="text-white" size={16} />
          </div>
          <h4 className="font-semibold text-gray-900">AI Assessment</h4>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{assessment.ai_assessment}</p>
      </div>

      {/* Recommended Specialty */}
      {assessment.recommended_specialty && (
        <div className="bg-blue-50 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Stethoscope className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">Recommended Specialist</p>
              <p className="font-semibold text-blue-800">{assessment.recommended_specialty}</p>
            </div>
          </div>
        </div>
      )}

      {/* Home Care Tips */}
      {assessment.home_care_tips && assessment.home_care_tips.length > 0 && (
        <div className="bg-green-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Home className="text-green-600" size={20} />
            <h4 className="font-semibold text-green-800">Home Care Tips</h4>
          </div>
          <ul className="space-y-2">
            {assessment.home_care_tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Red Flags */}
      {assessment.red_flags && assessment.red_flags.length > 0 && (
        <div className="bg-red-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-red-600" size={20} />
            <h4 className="font-semibold text-red-800">Watch for these warning signs</h4>
          </div>
          <ul className="space-y-2">
            {assessment.red_flags.map((flag, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {assessment.recommended_action !== 'home_care' && (
          <>
            <Link to={createPageUrl(`FindDoctor?specialty=${encodeURIComponent(assessment.recommended_specialty || '')}`)}>
              <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30">
                <Video className="mr-2" size={20} />
                Consult a Doctor
                <ChevronRight className="ml-auto" size={18} />
              </Button>
            </Link>
            <Link to={createPageUrl('FindDoctor?type=offline')}>
              <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200">
                <MapPin className="mr-2" size={20} />
                Find Nearby Clinic
                <ChevronRight className="ml-auto" size={18} />
              </Button>
            </Link>
          </>
        )}
        
        {assessment.recommended_action === 'emergency' && (
          <Button className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold">
            <Phone className="mr-2" size={20} />
            Emergency: Call 108
          </Button>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-xl p-4 mt-4">
        <p className="text-xs text-gray-500 text-center">
          <span className="font-medium">Disclaimer:</span> This is AI-powered health guidance, 
          not a medical diagnosis. Always consult a qualified doctor for proper medical advice.
        </p>
      </div>
    </motion.div>
  );
}