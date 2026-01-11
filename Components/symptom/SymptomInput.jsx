import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Send, Mic, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Cold', 'Body Pain',
  'Stomach Pain', 'Nausea', 'Fatigue', 'Sore Throat', 'Dizziness'
];

export default function SymptomInput({ onSubmit, isLoading, symptomInput, setSymptomInput, isListening, toggleVoiceInput }) {
  const [input, setInput] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  // Sync with parent if provided
  React.useEffect(() => {
    if (symptomInput !== undefined) {
      setInput(symptomInput);
    }
  }, [symptomInput]);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    const combined = [...selectedSymptoms];
    if (input.trim()) {
      combined.push(input.trim());
    }
    if (combined.length > 0) {
      onSubmit(combined.join(', '));
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (setSymptomInput) {
      setSymptomInput(e.target.value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Text Input */}
      <div className="relative">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Describe how you're feeling... (e.g., 'I have had a headache for 2 days with mild fever')"
          className="min-h-[100px] pr-12 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none text-base"
        />
        {toggleVoiceInput && (
          <button 
            onClick={toggleVoiceInput}
            type="button"
            className={`absolute right-3 bottom-3 p-2 transition-colors ${
              isListening 
                ? 'text-red-600 animate-pulse' 
                : 'text-gray-400 hover:text-blue-600'
            }`}
          >
            <Mic size={20} />
          </button>
        )}
      </div>

      {/* Common Symptoms */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Or select common symptoms:</p>
        <div className="flex flex-wrap gap-2">
          {commonSymptoms.map((symptom) => (
            <motion.button
              key={symptom}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSymptom(symptom)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedSymptoms.includes(symptom)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {symptom}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected symptoms display */}
      {selectedSymptoms.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Selected: </span>
            {selectedSymptoms.join(', ')}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading || (input.trim() === '' && selectedSymptoms.length === 0)}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" size={20} />
            Analyzing...
          </>
        ) : (
          <>
            <Send className="mr-2" size={20} />
            Check Symptoms
          </>
        )}
      </Button>
    </div>
  );
}