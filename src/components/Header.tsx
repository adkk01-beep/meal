/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HeaderProps {
  activeTab: string;
  onIconClick?: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onIconClick, onLogoClick }) => {
  const isProfile = activeTab === 'profile';

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-zinc-900 shadow-[0_4px_16px_0px_rgba(79,111,0,0.08)] transition-colors duration-300">
      <div className="flex items-center justify-between px-6 h-16 w-full max-w-md mx-auto md:max-w-2xl">
        <div 
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform duration-200"
          onClick={onLogoClick}
        >
          <span className="material-symbols-outlined text-[#3c5500] text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>
            restaurant
          </span>
          <h1 className="font-sans text-[20px] leading-[28px] font-bold text-[#3c5500]" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>
            씨마스고등학교 급식
          </h1>
        </div>
        
        <button 
          onClick={onIconClick}
          aria-label={isProfile ? "Settings" : "Notifications"}
          className="hover:bg-[#f1eee6] dark:hover:bg-zinc-800 transition-colors active:scale-95 duration-200 rounded-full p-2 text-[#3c5500]"
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>
            {isProfile ? 'settings' : 'notifications'}
          </span>
        </button>
      </div>
    </header>
  );
};
