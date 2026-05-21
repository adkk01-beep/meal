/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 rounded-t-2xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md shadow-[0_-4px_16px_0px_rgba(79,111,0,0.08)] transition-all duration-300">
      <div className="flex justify-around items-center h-20 px-4 pb-safe max-w-md mx-auto md:max-w-2xl">
        
        {/* 홈 */}
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 w-16 h-12 rounded-2xl ${
            activeTab === 'home' 
              ? 'text-[#3c5500] font-bold' 
              : 'text-[#536500] opacity-70 hover:opacity-100'
          }`}
        >
          <span 
            className="material-symbols-outlined text-[24px] mb-0.5" 
            style={{ fontVariationSettings: `"'FILL' ${activeTab === 'home' ? 1 : 0}"` }}
          >
            home
          </span>
          <span className="text-[12px] tracking-[0.05em] font-sans" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>홈</span>
        </button>

        {/* 식단표 */}
        <button 
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 w-16 h-13 rounded-2xl ${
            activeTab === 'menu' 
              ? 'bg-[#3c5500] text-white py-1 px-4 shadow-[0_4px_12px_rgba(60,85,0,0.2)]' 
              : 'text-[#536500] opacity-70 hover:opacity-100'
          }`}
        >
          <span 
            className="material-symbols-outlined text-[24px]" 
            style={{ fontVariationSettings: `"'FILL' ${activeTab === 'menu' ? 1 : 0}"` }}
          >
            calendar_month
          </span>
          <span className="text-[12px] tracking-[0.05em] font-sans mt-0.5" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>식단표</span>
        </button>

        {/* 영양계산 */}
        <button 
          onClick={() => setActiveTab('nutrition')}
          className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 w-16 h-13 rounded-2xl ${
            activeTab === 'nutrition' 
              ? 'bg-[#3c5500] text-white py-1 px-4 shadow-[0_4px_12px_rgba(60,85,0,0.2)]' 
              : 'text-[#536500] opacity-70 hover:opacity-100'
          }`}
        >
          <span 
            className={`material-symbols-outlined text-[24px]`} 
            style={{ fontVariationSettings: `"'FILL' ${activeTab === 'nutrition' ? 1 : 0}"` }}
          >
            calculate
          </span>
          <span className="text-[12px] tracking-[0.05em] font-sans mt-0.5" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>영양계산</span>
        </button>

        {/* 프로필 */}
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 w-16 h-12 rounded-2xl ${
            activeTab === 'profile' 
              ? 'text-[#3c5500] font-bold' 
              : 'text-[#536500] opacity-70 hover:opacity-100'
          }`}
        >
          <span 
            className="material-symbols-outlined text-[24px] mb-0.5" 
            style={{ fontVariationSettings: `"'FILL' ${activeTab === 'profile' ? 1 : 0}"` }}
          >
            person
          </span>
          <span className="text-[12px] tracking-[0.05em] font-sans" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>프로필</span>
        </button>

      </div>
    </nav>
  );
};
