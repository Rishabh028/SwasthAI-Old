import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowRight, ArrowLeft, Check, User, MapPin, Heart, 
  Shield, Loader2, Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import SwasthAILogo from '@/Components/ui/SwasthAILogo';

const steps = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'basic', title: 'Basic Info' },
  { id: 'health', title: 'Health Info' },
  { id: 'abha', title: 'ABHA' }
];

const conditions = [
  'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Thyroid',
  'Arthritis', 'Kidney Disease', 'None of these'
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    language: 'english',
    age: '',
    gender: '',
    city: '',
    blood_group: '',
    existing_conditions: [],
    allergies: '',
    emergency_contact: '',
    abha_id: ''
  });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const saveProfile = useMutation({
    mutationFn: async () => {
      const profileData = {
        phone: user?.email || '',
        language: formData.language,
        age: parseInt(formData.age) || null,
        gender: formData.gender,
        city: formData.city,
        blood_group: formData.blood_group,
        existing_conditions: formData.existing_conditions,
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
        emergency_contact: formData.emergency_contact,
        abha_id: formData.abha_id,
        abha_linked: !!formData.abha_id,
        onboarding_completed: true
      };
      return base44.entities.HealthProfile.create(profileData);
    },
    onSuccess: () => {
      navigate(createPageUrl('Home'));
    }
  });

  const nextStep = () => {
    if (step === steps.length - 1) {
      saveProfile.mutate();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleCondition = (condition) => {
    if (condition === 'None of these') {
      setFormData({ ...formData, existing_conditions: [] });
    } else {
      const exists = formData.existing_conditions.includes(condition);
      setFormData({
        ...formData,
        existing_conditions: exists
          ? formData.existing_conditions.filter(c => c !== condition)
          : [...formData.existing_conditions.filter(c => c !== 'None of these'), condition]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Progress Bar */}
      {step > 0 && (
        <div className="px-4 pt-4">
          <div className="flex gap-2">
            {steps.slice(1).map((s, i) => (
              <div
                key={s.id}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i < step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="px-6 py-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center pt-12"
            >
              <div className="flex justify-center mb-8">
                <SwasthAILogo size="large" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your Personal<br />Health Navigator
              </h1>
              <p className="text-gray-600 mb-8 max-w-xs mx-auto">
                Intelligent healthcare guidance for a billion Indians. 
                Let's set up your health profile.
              </p>

              {/* Language Selection */}
              <div className="space-y-3 mb-8">
                {[
                  { code: 'english', label: 'English' },
                  { code: 'hindi', label: 'हिंदी (Hindi)' },
                  { code: 'assamese', label: 'অসমীয়া (Assamese)' },
                  { code: 'bengali', label: 'বাংলা (Bengali)' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setFormData({ ...formData, language: lang.code })}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      formData.language === lang.code
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span className={`font-medium ${
                      formData.language === lang.code ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {lang.label}
                    </span>
                  </button>
                ))}
              </div>

              <Button
                onClick={nextStep}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-lg font-semibold"
              >
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <button onClick={prevStep} className="p-2 -ml-2 mb-4">
                <ArrowLeft size={24} className="text-gray-600" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                  <p className="text-sm text-gray-500">Tell us about yourself</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Age</label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Your age"
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Your city"
                      className="rounded-xl h-12 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Emergency Contact</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={formData.emergency_contact}
                      onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                      placeholder="Family member's phone"
                      className="rounded-xl h-12 pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={nextStep}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-lg font-semibold mt-8"
              >
                Continue
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="health"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <button onClick={prevStep} className="p-2 -ml-2 mb-4">
                <ArrowLeft size={24} className="text-gray-600" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Heart className="text-red-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Health Information</h2>
                  <p className="text-sm text-gray-500">Helps us personalize your care</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Blood Group</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <button
                        key={bg}
                        onClick={() => setFormData({ ...formData, blood_group: bg })}
                        className={`py-2 rounded-xl font-medium transition-all ${
                          formData.blood_group === bg
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Any existing conditions?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {conditions.map((condition) => (
                      <button
                        key={condition}
                        onClick={() => toggleCondition(condition)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          formData.existing_conditions.includes(condition)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {condition}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Any allergies? (optional)
                  </label>
                  <Input
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="e.g., Penicillin, Peanuts"
                    className="rounded-xl h-12"
                  />
                </div>
              </div>

              <Button
                onClick={nextStep}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-lg font-semibold mt-8"
              >
                Continue
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="abha"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <button onClick={prevStep} className="p-2 -ml-2 mb-4">
                <ArrowLeft size={24} className="text-gray-600" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="text-green-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">ABHA Health ID</h2>
                  <p className="text-sm text-gray-500">Link your national health ID</p>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-5 mb-6">
                <h3 className="font-semibold text-green-800 mb-2">What is ABHA?</h3>
                <p className="text-sm text-green-700">
                  Ayushman Bharat Health Account (ABHA) is a unique 14-digit health ID 
                  that helps you store and access your health records digitally.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-green-700">
                  <li className="flex items-center gap-2">
                    <Check size={14} /> Access records anywhere
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} /> Share with any doctor
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} /> Government verified
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    ABHA ID (optional)
                  </label>
                  <Input
                    value={formData.abha_id}
                    onChange={(e) => setFormData({ ...formData, abha_id: e.target.value })}
                    placeholder="14-digit ABHA number"
                    className="rounded-xl h-12"
                  />
                </div>

                <button className="text-blue-600 text-sm font-medium">
                  Don't have ABHA? Create one →
                </button>
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  onClick={nextStep}
                  disabled={saveProfile.isPending}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-lg font-semibold"
                >
                  {saveProfile.isPending ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Check className="ml-2" size={20} />
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setFormData({ ...formData, abha_id: '' });
                    saveProfile.mutate();
                  }}
                  disabled={saveProfile.isPending}
                  className="w-full h-12 text-gray-500"
                >
                  Skip for now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}