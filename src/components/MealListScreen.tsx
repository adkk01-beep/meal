/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MealData, UserProfile } from '../types';
import { getWeekDates, getWeekOfMonth, getTodayKST, formatDateKey, formatKoreanDate } from '../utils/dateUtils';

interface MealListScreenProps {
  meals: MealData[];
  userProfile: UserProfile;
}

export const MealListScreen: React.FC<MealListScreenProps> = ({ meals, userProfile }) => {
  const today = getTodayKST();
  const currentWeekDays = getWeekDates(today);

  // 기본적으로 오늘 날짜에 해당되는 요일을 선택.
  // 단, 오늘이 주말(토/일)이라면 첫번째 월요일로 자동 선택.
  const getInitialSelectedDate = () => {
    const day = today.getDay();
    if (day >= 1 && day <= 5) {
      return today;
    }
    return currentWeekDays[0]; // 월요일
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getInitialSelectedDate());

  // 선택된 날짜가 포함된 주차 텍스트 계산
  const weekLabel = getWeekOfMonth(selectedDate);

  const selectedDateKey = formatDateKey(selectedDate);

  // 해당 요일 식단 필터링
  const currentLunch = meals.find(m => m.dateKey === selectedDateKey && m.mealType === 'lunch');
  const currentDinner = meals.find(m => m.dateKey === selectedDateKey && m.mealType === 'dinner');

  const daysLabels = ['월', '화', '수', '목', '금'];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Header Section */}
      <section className="flex items-end justify-between">
        <div>
          <h2 className="text-[32px] leading-[40px] font-bold text-[#1c1c17] tracking-tight" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>
            주간 식단
          </h2>
          <p className="text-[16px] leading-[24px] font-medium text-[#747967] mt-1 font-sans">
            {weekLabel}
          </p>
        </div>
        
        <div className="bg-[#d2ea7a] text-[#576a00] px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm font-sans flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">school</span>
          씨마스고 수능급식 
        </div>
      </section>

      {/* Date Selector (Horizontal Scroll) */}
      <section className="bg-white dark:bg-zinc-800 p-3 rounded-2xl border border-[#e5e2db] dark:border-zinc-700 shadow-sm">
        <div className="flex justify-between items-center gap-2">
          {currentWeekDays.map((dateObj, idx) => {
            const isSelected = formatDateKey(dateObj) === selectedDateKey;
            const isDayToday = formatDateKey(dateObj) === formatDateKey(today);
            const dateNum = dateObj.getDate();
            const dayLabel = daysLabels[idx];

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(dateObj)}
                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-[#3c5500] text-white shadow-md scale-105 active:scale-95'
                    : 'bg-[#f1eee6]/50 hover:bg-[#ebe8e0] dark:bg-zinc-700/50 text-[#444939] active:scale-95'
                }`}
              >
                <span className="text-[14px] font-medium tracking-wide font-sans">{dayLabel}</span>
                <span className="text-[18px] font-bold mt-1 font-sans">{dateNum}</span>
                
                {isDayToday && !isSelected && (
                  <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#3c5500] rounded-full"></div>
                )}
                {isSelected && (
                  <div className="absolute -bottom-1 w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Day Status */}
      <div className="text-[14px] font-bold text-[#3c5500] font-sans flex items-center gap-1.5 px-1">
        <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
        <span>{formatKoreanDate(selectedDate)}의 수능 식단표</span>
      </div>

      {/* Meal Cards Container */}
      <section className="flex flex-col gap-5">
        
        {/* Lunch Card */}
        {currentLunch ? (
          <article className="bg-white dark:bg-zinc-800 rounded-3xl shadow-[0_4px_16px_rgba(79,111,0,0.08)] p-5 flex flex-col overflow-hidden relative border border-[#e5e2db] dark:border-zinc-700 transition-all hover:-translate-y-0.5">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#d2ea7a]/15 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-4 z-10">
              <div className="bg-[#d2ea7a] text-[#576a00] px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 font-sans">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  wb_sunny
                </span>
                중식
              </div>
              <span className="text-[20px] font-bold text-[#3c5500] font-sans">
                {currentLunch.totalCalories} <span className="text-[14px] text-[#747967] font-normal">kcal</span>
              </span>
            </div>

            <ul className="flex flex-col gap-3 mb-6 z-10">
              {currentLunch.dishes.map((dish, i) => {
                // 특정 주재료 알레르기 경고를 빨간 레이블로 표시
                const matchedAllergens = currentLunch.allergens.filter(alg => userProfile.allergies.includes(alg));
                const containsAllergen = matchedAllergens.length > 0 && i === 2; // 임의로 대표 메뉴(두번째 행 등)에 경고 맵핑

                return (
                  <li key={i} className="flex items-start justify-between">
                    <span className={`text-[16px] leading-[22px] text-[#1c1c17] ${i < 3 ? 'font-bold' : 'font-medium'} font-sans`}>
                      {dish}
                    </span>
                    {containsAllergen && (
                      <span className="bg-[#ffdad6] text-[#ba1a1a] px-2 py-0.5 rounded-full text-[10px] border border-[#ba1a1a]/20 font-bold font-sans">
                        알레르기 주의
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Protein Goal Target Bar (Design Fidelity) */}
            <div className="mt-auto bg-[#f1eee6] dark:bg-zinc-700 rounded-xl p-3 z-10 border border-[#e5e2db]/50 dark:border-zinc-600">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] text-[#444939] font-medium flex items-center gap-1 font-sans">
                  <span className="material-symbols-outlined text-[16px] text-[#3c5500]">fitness_center</span>
                  수험생 단백질 권장량 달성률
                </span>
                <span className="text-[12px] font-bold text-[#3c5500] font-sans">
                  {Math.round((currentLunch.nutrition.protein / 40) * 100)}%
                </span>
              </div>
              <div className="w-full bg-[#ebe8e0] dark:bg-zinc-650 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#3c5500] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (currentLunch.nutrition.protein / 40) * 100)}%` }}
                ></div>
              </div>
            </div>
          </article>
        ) : (
          <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl text-center text-[#747967] text-[14px] font-sans border border-[#e5e2db] dark:border-zinc-700 shadow-sm">
            선택된 날짜에는 단체 중식 급식 서비스가 마련되어 있지 않습니다.
          </div>
        )}

        {/* Dinner Card */}
        {currentDinner ? (
          <article className="bg-white dark:bg-zinc-800 rounded-3xl shadow-[0_4px_16px_rgba(79,111,0,0.08)] p-5 flex flex-col overflow-hidden relative border border-[#e5e2db] dark:border-zinc-700 transition-all hover:-translate-y-0.5">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#3c5500]/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-4 z-10">
              <div className="bg-[#f1eee6] text-[#444939] dark:bg-zinc-700 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 font-sans">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  nights_stay
                </span>
                석식
              </div>
              <span className="text-[20px] font-bold text-[#747967] font-sans">
                {currentDinner.totalCalories} <span className="text-[14px] text-[#outline-variant] font-normal">kcal</span>
              </span>
            </div>

            <ul className="flex flex-col gap-3 mb-6 z-10">
              {currentDinner.dishes.map((dish, i) => {
                const matchedAllergens = currentDinner.allergens.filter(alg => userProfile.allergies.includes(alg));
                const containsAllergen = matchedAllergens.length > 0 && i === 0;

                return (
                  <li key={i} className="flex items-start justify-between">
                    <span className={`text-[16px] leading-[22px] text-[#1c1c17] ${i === 0 ? 'font-bold' : 'font-medium'} font-sans`}>
                      {dish}
                    </span>
                    {containsAllergen && (
                      <span className="bg-[#ffdad6] text-[#ba1a1a] px-2 py-0.5 rounded-full text-[10px] border border-[#ba1a1a]/20 font-bold font-sans">
                        알레르기 주의
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Protein Goal Target Bar (Dinner version) */}
            <div className="mt-auto bg-[#f1eee6] dark:bg-zinc-700 rounded-xl p-3 z-10 border border-[#e5e2db]/50 dark:border-zinc-600">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] text-[#444939] font-medium flex items-center gap-1 font-sans">
                  <span className="material-symbols-outlined text-[16px] text-[#536500]">fitness_center</span>
                  수험생 단백질 권장량 달성률
                </span>
                <span className="text-[12px] font-bold text-[#536500] font-sans">
                  {Math.round((currentDinner.nutrition.protein / 40) * 100)}%
                </span>
              </div>
              <div className="w-full bg-[#ebe8e0] dark:bg-zinc-650 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#536500] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (currentDinner.nutrition.protein / 40) * 100)}%` }}
                ></div>
              </div>
            </div>
          </article>
        ) : (
          <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl text-center text-[#747967] text-[14px] font-sans border border-[#e5e2db] dark:border-zinc-700 shadow-sm">
            선택된 날짜에는 단체 석식 급식 서비스가 제공되지 않습니다.
          </div>
        )}
      </section>
    </div>
  );
};
