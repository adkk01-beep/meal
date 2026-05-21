/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MealData, UserProfile } from '../types';
import { formatKoreanDate, formatDateKey, getTodayKST } from '../utils/dateUtils';

interface HomeScreenProps {
  meals: MealData[];
  userProfile: UserProfile;
  onNavigateToMenu: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ meals, userProfile, onNavigateToMenu }) => {
  const today = getTodayKST();
  const dayOfWeek = today.getDay(); // 0: 일, 6: 토

  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // 방식 B 적용: 주말이면 다음주 월요일 급식 데이터를 보여주고 "다음 급식일" 배지를 노출
  let displayDate = today;
  let isNextMealDay = false;

  if (isWeekend) {
    isNextMealDay = true;
    const daysToAdd = dayOfWeek === 6 ? 2 : 1;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysToAdd);
    nextMonday.setHours(12, 0, 0, 0);
    displayDate = nextMonday;
  }

  const dateKey = formatDateKey(displayDate);

  // 현재 표시할 날짜의 중식과 석식 획득
  const displayLunch = meals.find(m => m.dateKey === dateKey && m.mealType === 'lunch');
  const displayDinner = meals.find(m => m.dateKey === dateKey && m.mealType === 'dinner');

  // 히어로 카드는 기본적으로 오늘의 중식 대표 식단을 보여주고 영롱하게 스타일링
  const heroMeal = displayLunch || meals[0];

  const [isLiked, setIsLiked] = useState<boolean>(false);

  // 알레르기 경고를 탐지하는 로직
  const checkAllergyWarning = (mealAllergens: string[]) => {
    if (!userProfile.notifications) return [];
    return mealAllergens.filter(allergen => userProfile.allergies.includes(allergen));
  };

  const lunchAllergyWarnings = displayLunch ? checkAllergyWarning(displayLunch.allergens) : [];
  const dinnerAllergyWarnings = displayDinner ? checkAllergyWarning(displayDinner.allergens) : [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Date Notice Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[32px] leading-[40px] font-bold text-[#1c1c17]" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>
            급식 소식
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[16px] leading-[24px] font-medium text-[#444939] font-sans">
              {formatKoreanDate(displayDate)}
            </p>
            {isNextMealDay && (
              <span className="bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/20 text-[11px] font-bold px-2.5 py-0.5 rounded-full font-sans tracking-wide">
                다음 급식일
              </span>
            )}
            {!isWeekend && (
              <span className="bg-[#d2ea7a] text-[#576a00] text-[11px] font-bold px-2.5 py-0.5 rounded-full font-sans">
                오늘 급식
              </span>
            )}
          </div>
        </div>
        
        <button 
          onClick={onNavigateToMenu}
          className="bg-[#d2ea7a] hover:bg-[#c1cc98] text-[#576a00] px-4 py-2 rounded-full text-[12px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform font-sans"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          식단표 전체보기
        </button>
      </div>

      {isWeekend && (
        <div className="bg-[#f1eee6] border border-[#747967]/10 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
          <span className="material-symbols-outlined text-[#3c5500] text-[24px]">info</span>
          <div>
            <p className="text-[14px] font-bold text-[#1c1c17] font-sans">주말 급식 안내</p>
            <p className="text-[13px] text-[#444939] font-sans mt-0.5 leading-relaxed">
              오늘은 즐거운 주말입니다! 가장 가까운 급식일인 다음 주 월요일 식단표를 미리 확인해 보세요.
            </p>
          </div>
        </div>
      )}

      {/* Hero Card */}
      {heroMeal && (
        <section className="bg-white dark:bg-zinc-800 rounded-3xl shadow-[0_4px_16px_rgba(79,111,0,0.08)] overflow-hidden flex flex-col border border-[#e5e2db] dark:border-zinc-700 transition-all hover:shadow-[0_8px_24px_rgba(79,111,0,0.12)]">
          <div className="relative w-full h-48 sm:h-56 bg-[#ebe8e0] overflow-hidden">
            <img 
              alt={`${heroMeal.title} 추천 이미지`} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
              src={heroMeal.imageUrl || 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=600'}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-[#ffdad6] text-[#93000a] text-[12px] font-bold px-3 py-1 rounded-full border border-[#ba1a1a]/20 shadow-sm font-sans">
              오늘의 추천 급식
            </div>
            
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm text-[#3c5500] hover:bg-white transition-all active:scale-90"
              aria-label="찜하기"
            >
              <span className={`material-symbols-outlined text-[20px] ${isLiked ? 'icon-filled text-[#ba1a1a]' : ''}`} style={{ fontVariationSettings: `"'FILL' ${isLiked ? 1 : 0}"` }}>
                favorite
              </span>
            </button>
          </div>

          <div className="p-5 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[14px] leading-[20px] font-medium text-[#747967] font-sans">
                  {formatKoreanDate(displayDate)} 대표 식단
                </p>
                <h3 className="text-[20px] leading-[28px] font-bold text-[#3c5500] mt-0.5" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>
                  {heroMeal.title}
                </h3>
              </div>
              <div className="bg-[#d2ea7a]/50 text-[#3c5500] px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1 font-sans">
                <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                {heroMeal.totalCalories} kcal
              </div>
            </div>
            
            <p className="text-[14px] leading-[22px] text-[#444939] font-sans mt-2 whitespace-pre-line leading-relaxed">
              {heroMeal.description}
            </p>
          </div>
        </section>
      )}

      {/* Daily Meals Summary (Lunch & Dinner) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] leading-[28px] font-bold text-[#1c1c17]" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>
            오늘의 급식
          </h3>
          <span className="bg-[#ebe8e0] dark:bg-zinc-700 text-[#747967] text-[12px] font-bold px-3 py-1 rounded-full font-sans">
            중식 &amp; 석식
          </span>
        </div>

        {/* Lunch Card */}
        {displayLunch ? (
          <article className="bg-white dark:bg-zinc-800 rounded-3xl shadow-[0_4px_16px_rgba(79,111,0,0.08)] p-5 border border-[#e5e2db] dark:border-zinc-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3c5500]"></div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-[#3c5500]">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  wb_sunny
                </span>
                <h4 className="text-[20px] font-bold" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>중식</h4>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-[#747967] font-sans">11:30 - 13:00</span>
                <span className="text-[16px] font-bold text-[#3c5500] font-sans">{displayLunch.totalCalories} kcal</span>
              </div>
            </div>

            {lunchAllergyWarnings.length > 0 && (
              <div className="mb-3 p-2.5 bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] rounded-xl text-[12px] font-sans flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                <span>알레르기 경고! 나에게 맞지 않는 <strong>{lunchAllergyWarnings.join(', ')}</strong> 성분이 포함되어 있습니다.</span>
              </div>
            )}

            <ul className="flex flex-col gap-2.5 text-[14px] text-[#1c1c17] mb-4">
              {displayLunch.dishes.map((dish, idx) => {
                const isMain = idx === 2 || dish === displayLunch.title; // 대표 반찬 강조
                return (
                  <li key={idx} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isMain ? 'bg-[#3c5500]' : 'bg-[#d2ea7a]'}`}></div>
                    <span className={isMain ? 'font-bold text-[#3c5500]' : 'font-medium'}>
                      {dish}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#e5e2db] dark:border-zinc-700">
              {displayLunch.allergens.map((allergen, idx) => {
                const isUserAllergy = userProfile.allergies.includes(allergen);
                return (
                  <span 
                    key={idx} 
                    className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full font-sans transition-all ${
                      isUserAllergy 
                        ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/30 shadow-sm' 
                        : 'bg-[#ebe8e0] text-[#444939] border border-[#outline-variant]/10'
                    }`}
                  >
                    {allergen}
                  </span>
                );
              })}
            </div>
          </article>
        ) : (
          <div className="bg-[#ebe8e0]/40 p-8 rounded-3xl text-center text-[#747967] text-[14px] font-sans border border-dashed border-[#outline]">
            정규 중식 급식이 제공되지 않는 날입니다.
          </div>
        )}

        {/* Dinner Card */}
        {displayDinner ? (
          <article className="bg-white dark:bg-zinc-800 rounded-3xl shadow-[0_4px_16px_rgba(79,111,0,0.08)] p-5 border border-[#e5e2db] dark:border-zinc-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#536500]"></div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-[#536500]">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  nights_stay
                </span>
                <h4 className="text-[20px] font-bold" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>석식</h4>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-[#747967] font-sans">17:30 - 18:30</span>
                <span className="text-[16px] font-bold text-[#536500] font-sans">{displayDinner.totalCalories} kcal</span>
              </div>
            </div>

            {dinnerAllergyWarnings.length > 0 && (
              <div className="mb-3 p-2.5 bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] rounded-xl text-[12px] font-sans flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                <span>알레르기 경고! 나에게 맞지 않는 [<strong>{dinnerAllergyWarnings.join(', ')}</strong>] 성분이 식단에 포함되어 있습니다.</span>
              </div>
            )}

            <ul className="flex flex-col gap-2.5 text-[14px] text-[#1c1c17] mb-4">
              {displayDinner.dishes.map((dish, idx) => {
                const isMain = idx === 0 || dish === displayDinner.title;
                return (
                  <li key={idx} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isMain ? 'bg-[#536500]' : 'bg-[#e5e2db]'}`}></div>
                    <span className={isMain ? 'font-bold text-[#536500]' : 'font-medium'}>
                      {dish}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#e5e2db] dark:border-zinc-700">
              {displayDinner.allergens.map((allergen, idx) => {
                const isUserAllergy = userProfile.allergies.includes(allergen);
                return (
                  <span 
                    key={idx} 
                    className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full font-sans transition-all ${
                      isUserAllergy 
                        ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/30 shadow-sm' 
                        : 'bg-[#ebe8e0] text-[#444939] border border-[#outline-variant]/10'
                    }`}
                  >
                    {allergen}
                  </span>
                );
              })}
            </div>
          </article>
        ) : (
          <div className="bg-[#ebe8e0]/40 p-8 rounded-3xl text-center text-[#747967] text-[14px] font-sans border border-dashed border-[#outline]">
            정규 석식 급식이 제공되지 않는 날입니다.
          </div>
        )}
      </section>
    </div>
  );
};
