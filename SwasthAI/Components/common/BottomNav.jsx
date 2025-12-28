import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Calendar, FileText, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/', name: 'home' },
    { icon: Search, label: 'Find Doctor', path: '/find-doctor', name: 'find-doctor' },
    { icon: Calendar, label: 'Appointments', path: '/appointments', name: 'appointments' },
    { icon: FileText, label: 'Records', path: '/health-records', name: 'records' },
    { icon: User, label: 'Profile', path: '/profile', name: 'profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 max-w-2xl mx-auto w-full">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
              isActive(item.path)
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}