import React from 'react';
import BottomNav from '@/Components/common/BottomNav';

const pagesWithNav = ['Home', 'SymptomChecker', 'Appointments', 'HealthRecords', 'Profile', 'FindDoctor', 'Pharmacy', 'LabTests'];
const pagesWithoutPadding = ['Onboarding', 'Welcome'];

export default function Layout({ children, currentPageName }) {
  const showNav = pagesWithNav.includes(currentPageName);
  const noPadding = pagesWithoutPadding.includes(currentPageName);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        :root {
          --swasth-blue: #2563eb;
          --swasth-blue-light: #3b82f6;
          --swasth-blue-dark: #1d4ed8;
        }
        
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
      `}</style>
      
      <main className={`${showNav ? 'pb-24' : ''} ${noPadding ? '' : ''}`}>
        {children}
      </main>
      
      {showNav && <BottomNav currentPage={currentPageName} />}
    </div>
  );
}