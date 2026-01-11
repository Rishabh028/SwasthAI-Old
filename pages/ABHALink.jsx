import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, Shield, Check, Loader2, AlertCircle, 
  Info, Phone, KeyRound, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

const steps = [
  { id: 'info', title: 'About ABHA' },
  { id: 'phone', title: 'Verify Phone' },
  { id: 'otp', title: 'Enter OTP' },
  { id: 'create', title: 'Create/Link ABHA' },
  { id: 'success', title: 'Success' }
];

export default function ABHALink() {
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [abhaNumber, setAbhaNumber] = useState('');
  const [hasExisting, setHasExisting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['healthProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const profiles = await base44.entities.HealthProfile.filter(
        { created_by: user.email }, 
        '-created_date', 
        1
      );
      return profiles[0];
    }
  });

  const linkABHA = useMutation({
    mutationFn: async (abhaId) => {
      if (profile?.id) {
        return base44.entities.HealthProfile.update(profile.id, {
          abha_id: abhaId,
          abha_linked: true
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthProfile'] });
      setCurrentStep(4);
    }
  });

  const handleSendOTP = () => {
    // In production, this would call ABDM API
    if (phoneNumber.length === 10) {
      // Simulate OTP sending
      alert(`OTP sent to +91 ${phoneNumber}\n\nFor demo, use any 6-digit code`);
      setCurrentStep(2);
    } else {
      alert('Please enter a valid 10-digit phone number');
    }
  };

  const handleVerifyOTP = () => {
    // In production, verify OTP with ABDM
    if (otp.length === 6) {
      // For demo, accept any 6-digit OTP
      alert('OTP verified successfully!');
      setCurrentStep(3);
    } else {
      alert('Please enter a valid 6-digit OTP');
    }
  };

  const handleLinkABHA = () => {
    if (hasExisting && abhaNumber.length === 14) {
      linkABHA.mutate(abhaNumber);
    } else if (!hasExisting) {
      // Generate ABHA number (in production, this comes from ABDM)
      const generatedABHA = `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`;
      linkABHA.mutate(generatedABHA);
    } else {
      alert('Please enter a valid 14-digit ABHA number');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(createPageUrl('Profile'))}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">ABHA Health ID</h1>
            <p className="text-xs text-gray-500">Ayushman Bharat Health Account</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      {currentStep < 4 && (
        <div className="px-4 py-4">
          <div className="flex gap-2">
            {steps.slice(0, 4).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i <= currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-6">
        {/* Step 0: Info */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Shield size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">What is ABHA?</h2>
              <p className="text-green-100">
                Your unique 14-digit health ID to access and share your health records digitally across India
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Check className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Universal Access</h3>
                  <p className="text-sm text-gray-600">Access your records from any hospital or clinic in India</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-xl">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Check className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Storage</h3>
                  <p className="text-sm text-gray-600">Government-backed secure storage of your health data</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-xl">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Check className="text-purple-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Easy Sharing</h3>
                  <p className="text-sm text-gray-600">Share records with doctors instantly</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
              <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                ABHA is part of the Ayushman Bharat Digital Mission (ABDM) by the Government of India
              </p>
            </div>

            <Button
              onClick={() => setCurrentStep(1)}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-lg font-semibold"
            >
              Get Started
            </Button>
          </motion.div>
        )}

        {/* Step 1: Phone */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Phone Number</h2>
              <p className="text-gray-600">We'll send an OTP to verify your number</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">+91</span>
                  <Input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit number"
                    className="pl-14 h-14 rounded-xl text-lg"
                  />
                </div>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={phoneNumber.length !== 10}
                className="w-full h-14 rounded-xl bg-green-600 hover:bg-green-700 text-lg font-semibold"
              >
                Send OTP
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: OTP */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <KeyRound className="text-blue-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h2>
              <p className="text-gray-600">
                OTP sent to +91 {phoneNumber}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  6-Digit OTP
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="h-14 rounded-xl text-center text-2xl tracking-widest"
                />
              </div>

              <button className="text-blue-600 text-sm font-medium">
                Didn't receive OTP? Resend
              </button>

              <Button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6}
                className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
              >
                Verify OTP
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Create/Link */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-purple-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">ABHA Setup</h2>
              <p className="text-gray-600">Do you have an existing ABHA number?</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setHasExisting(false)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  !hasExisting
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-center">
                  <p className="font-semibold text-gray-900 mb-1">Create New</p>
                  <p className="text-xs text-gray-600">Generate ABHA</p>
                </div>
              </button>

              <button
                onClick={() => setHasExisting(true)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  hasExisting
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-center">
                  <p className="font-semibold text-gray-900 mb-1">Link Existing</p>
                  <p className="text-xs text-gray-600">Already have ABHA</p>
                </div>
              </button>
            </div>

            {hasExisting && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Enter ABHA Number
                </label>
                <Input
                  type="text"
                  maxLength={14}
                  value={abhaNumber}
                  onChange={(e) => setAbhaNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="14-digit ABHA number"
                  className="h-14 rounded-xl text-lg"
                />
              </div>
            )}

            <Button
              onClick={handleLinkABHA}
              disabled={linkABHA.isPending || (hasExisting && abhaNumber.length !== 14)}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-lg font-semibold"
            >
              {linkABHA.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  {hasExisting ? 'Linking...' : 'Creating...'}
                </>
              ) : (
                <>
                  {hasExisting ? 'Link ABHA' : 'Create ABHA'}
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-green-600" size={48} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">ABHA Linked Successfully!</h2>
              <p className="text-gray-600">
                Your health ID is now active and ready to use
              </p>
            </div>

            {profile?.abha_id && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-green-700 mb-1">Your ABHA Number</p>
                <p className="text-2xl font-bold text-green-900 tracking-wide">
                  {profile.abha_id.replace(/(\d{4})/g, '$1 ').trim()}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => navigate(createPageUrl('Profile'))}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-lg font-semibold"
              >
                Go to Profile
              </Button>
              <Button
                onClick={() => navigate(createPageUrl('Home'))}
                variant="outline"
                className="w-full h-12 rounded-xl"
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}