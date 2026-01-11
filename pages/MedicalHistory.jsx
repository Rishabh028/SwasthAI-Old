import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, Heart, Plus, X, AlertCircle, Pill, Edit2, Trash2, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';

const commonConditions = [
  'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Thyroid',
  'Arthritis', 'Kidney Disease', 'COPD', 'Anxiety', 'Depression'
];

const commonAllergies = [
  'Penicillin', 'Peanuts', 'Shellfish', 'Latex', 'Pollen',
  'Dust Mites', 'Pet Dander', 'Sulfa Drugs', 'Aspirin', 'Eggs'
];

export default function MedicalHistory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showConditions, setShowConditions] = useState(false);
  const [showAllergies, setShowAllergies] = useState(false);
  const [customCondition, setCustomCondition] = useState('');
  const [customAllergy, setCustomAllergy] = useState('');

  const { data: profile, isLoading } = useQuery({
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

  const updateHistory = useMutation({
    mutationFn: async (data) => {
      if (profile?.id) {
        return base44.entities.HealthProfile.update(profile.id, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthProfile'] });
    }
  });

  const addCondition = (condition) => {
    const conditions = profile?.existing_conditions || [];
    if (!conditions.includes(condition)) {
      updateHistory.mutate({
        existing_conditions: [...conditions, condition]
      });
    }
    setCustomCondition('');
  };

  const removeCondition = (condition) => {
    const conditions = profile?.existing_conditions || [];
    updateHistory.mutate({
      existing_conditions: conditions.filter(c => c !== condition)
    });
  };

  const addAllergy = (allergy) => {
    const allergies = profile?.allergies || [];
    if (!allergies.includes(allergy)) {
      updateHistory.mutate({
        allergies: [...allergies, allergy]
      });
    }
    setCustomAllergy('');
  };

  const removeAllergy = (allergy) => {
    const allergies = profile?.allergies || [];
    updateHistory.mutate({
      allergies: allergies.filter(a => a !== allergy)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 pt-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate(createPageUrl('Profile'))}
            className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Medical History</h1>
            <p className="text-red-100 text-sm">Your health conditions & allergies</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Existing Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="text-red-500" size={20} />
              <h2 className="font-bold text-gray-900">Existing Conditions</h2>
            </div>
            <Button
              size="sm"
              onClick={() => setShowConditions(true)}
              className="rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>

          {profile?.existing_conditions?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.existing_conditions.map((condition, i) => (
                <Badge
                  key={i}
                  className="bg-red-100 text-red-700 border-red-200 px-3 py-1.5 flex items-center gap-2"
                >
                  {condition}
                  <button
                    onClick={() => removeCondition(condition)}
                    className="hover:bg-red-200 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No conditions recorded</p>
          )}
        </motion.div>

        {/* Allergies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-orange-500" size={20} />
              <h2 className="font-bold text-gray-900">Allergies</h2>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAllergies(true)}
              className="rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>

          {profile?.allergies?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy, i) => (
                <Badge
                  key={i}
                  className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1.5 flex items-center gap-2"
                >
                  {allergy}
                  <button
                    onClick={() => removeAllergy(allergy)}
                    className="hover:bg-orange-200 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No allergies recorded</p>
          )}
        </motion.div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            Keeping your medical history updated helps doctors provide better care and avoid medications you're allergic to.
          </p>
        </div>
      </div>

      {/* Add Condition Modal */}
      <AnimatePresence>
        {showConditions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowConditions(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white rounded-t-3xl p-6 w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add Condition</h2>
              
              <div className="mb-4">
                <Input
                  placeholder="Type custom condition..."
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && customCondition.trim()) {
                      addCondition(customCondition.trim());
                    }
                  }}
                  className="rounded-xl"
                />
              </div>

              <p className="text-sm text-gray-500 mb-3">Common conditions:</p>
              <div className="flex flex-wrap gap-2">
                {commonConditions.map((condition) => (
                  <button
                    key={condition}
                    onClick={() => {
                      addCondition(condition);
                      setShowConditions(false);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-red-100 hover:text-red-700 transition-all"
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Allergy Modal */}
      <AnimatePresence>
        {showAllergies && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowAllergies(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white rounded-t-3xl p-6 w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add Allergy</h2>
              
              <div className="mb-4">
                <Input
                  placeholder="Type custom allergy..."
                  value={customAllergy}
                  onChange={(e) => setCustomAllergy(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && customAllergy.trim()) {
                      addAllergy(customAllergy.trim());
                    }
                  }}
                  className="rounded-xl"
                />
              </div>

              <p className="text-sm text-gray-500 mb-3">Common allergies:</p>
              <div className="flex flex-wrap gap-2">
                {commonAllergies.map((allergy) => (
                  <button
                    key={allergy}
                    onClick={() => {
                      addAllergy(allergy);
                      setShowAllergies(false);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-orange-100 hover:text-orange-700 transition-all"
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}