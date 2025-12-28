import React from 'react';
import BottomNav from './Components/common/BottomNav.jsx';

/**
 * Main Layout Wrapper - Automatically wraps all pages
 * Provides navigation, header, and footer
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation - Like Base44 */}
      <BottomNav />
    </div>
  );
}