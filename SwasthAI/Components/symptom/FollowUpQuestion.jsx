import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FollowUpQuestion({ question, options, onAnswer, isLoading }) {
  const [customAnswer, setCustomAnswer] = useState('');

  const handleOptionClick = (option) => {
    onAnswer(option);
  };

  const handleCustomSubmit = () => {
    if (customAnswer.trim()) {
      onAnswer(customAnswer.trim());
      setCustomAnswer('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="bg-blue-50 rounded-2xl p-4">
        <p className="text-gray-800 font-medium">{question}</p>
      </div>

      {options && options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleOptionClick(option)}
              disabled={isLoading}
              className="rounded-xl border-gray-200 hover:border-blue-500 hover:bg-blue-50"
            >
              {option}
            </Button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={customAnswer}
          onChange={(e) => setCustomAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="rounded-xl"
          onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
        />
        <Button
          onClick={handleCustomSubmit}
          disabled={isLoading || !customAnswer.trim()}
          className="rounded-xl bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </Button>
      </div>
    </motion.div>
  );
}
