import React from 'react';
import { Heart } from 'lucide-react';

export default function SwasthAILogo({ size = 'default', showText = true }) {
  const sizes = {
    small: { icon: 20, text: 'text-lg' },
    default: { icon: 28, text: 'text-2xl' },
    large: { icon: 40, text: 'text-4xl' }
  };

  const s = sizes[size] || sizes.default;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Heart className="text-white" size={s.icon} fill="white" />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
      </div>
      {showText && (
        <span className={`font-bold ${s.text} bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent`}>
          SwasthAI
        </span>
      )}
    </div>
  );
}