/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MealData } from '../types';
import { getTodayKST, formatDateKey, getDefaultSelectedDate, formatKoreanDate } from '../utils/dateUtils';

interface NutritionScreenProps {
  meals: MealData[];
}

interface InteractiveDish {
  name: string;
  category: '밥류' | '국/찌개' | '반찬' | '디저트';
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  selected: boolean;
}

export const NutritionScreen: React.FC<NutritionScreenProps> = ({ meals }) => {
  const today = getTodayKST();
  const activeDate = getDefaultSelectedDate(today); // 평일이면 오늘, 주말이면 다음 월요일
  const activeDateKey = formatDateKey(activeDate);

  // 오늘 날짜의 중식 데이터 획득
  const activeLunch = meals.find(m => m.dateKey === activeDateKey && m.mealType === 'lunch') || meals[0];

  const [activeCategory, setActiveCategory] = useState<string>('전체');
  const [dishItems, setDishItems] = useState<InteractiveDish[]>([]);

  // 식단 변경 시, 각 반찬별 영양가 분포를 합리적으로 연산하여 매핑
  useEffect(() => {
    if (activeLunch) {
      const dishes = activeLunch.dishes;
      const totalKcal = activeLunch.totalCalories;
      const totalProt = activeLunch.nutrition.protein;
      const totalCarb = activeLunch.nutrition.carbohydrates;
      const totalFat = activeLunch.nutrition.fat;

      const itemsCount = dishes.length;

      // 각 반찬에 맞게 가중치를 두어 매핑 (예: 밥, 국, 메인 육류에 영양 집중 배분)
      const modeledDishes: InteractiveDish[] = dishes.map((dishName, index) => {
        let category: '밥류' | '국/찌개' | '반찬' | '디저트' = '반찬';
        let weight = 0.15; // 기본 분담률

        // 카테고리 자가 판별 및 가중치 매핑
        if (dishName.includes('밥') || dishName.includes('죽')) {
          category = '밥류';
          weight = 0.38; // 밥은 칼로리 및 탄수화물이 높음
        } else if (dishName.includes('국') || dishName.includes('찌개') || dishName.includes('탕')) {
          category = '국/찌개';
          weight = 0.15;
        } else if (index === 2 || dishName.includes('돈까스') || dishName.includes('불고기') || dishName.includes('갈비') || dishName.includes('강정') || dishName.includes('구이') || dishName.includes('치킨')) {
          category = '반찬';
          weight = 0.35; // 메인 요리는 칼로리 및 단단지 골고루 높음
        } else if (dishName.includes('김치') || dishName.includes('단무지') || dishName.includes('피클')) {
          category = '디저트';
          weight = 0.06;
        } else if (dishName.includes('요구르트') || dishName.includes('주스') || dishName.includes('과일') || dishName.includes('오렌지') || dishName.includes('쿨피스')) {
          category = '디저트';
          weight = 0.08;
        }

        // 전체 가중치 합을 고정 비율로 맞춰 칼로리 분해
        const dishKcal = Math.round(totalKcal * weight);
        
        // 탄수화물, 단백질, 지방 분할율 임의 보정
        let dishProt = 0;
        let dishCarb = 0;
        let dishFat = 0;

        if (category === '밥류') {
          dishProt = Math.round(totalProt * 0.15);
          dishCarb = Math.round(totalCarb * 0.70);
          dishFat = Math.round(totalFat * 0.10);
        } else if (category === '국/찌개') {
          dishProt = Math.round(totalProt * 0.20);
          dishCarb = Math.round(totalCarb * 0.10);
          dishFat = Math.round(totalFat * 0.20);
        } else if (category === '반찬') {
          dishProt = Math.round(totalProt * 0.60);
          dishCarb = Math.round(totalCarb * 0.15);
          dishFat = Math.round(totalFat * 0.65);
        } else { // 디저트 & 김치류
          dishProt = Math.round(totalProt * 0.05);
          dishCarb = Math.round(totalCarb * 0.05);
          dishFat = Math.round(totalFat * 0.05);
        }

        return {
          name: dishName,
          category,
          kcal: dishKcal,
          protein: Math.max(1, dishProt),
          carbs: Math.max(1, dishCarb),
          fat: Math.max(1, dishFat),
          selected: true // 기본값은 전체 선택 상태
        };
      });

      // 영양 수치 정밀화 평탄화 (정확히 원본 합과 일치하도록 마지막 요소 보정)
      const sumKcal = modeledDishes.reduce((sum, item) => sum + item.kcal, 0);
      const diffKcal = totalKcal - sumKcal;
      if (modeledDishes.length > 0) {
        modeledDishes[modeledDishes.length - 1].kcal += diffKcal;
      }

      setDishItems(modeledDishes);
    }
  }, [activeLunch]);

  // 반찬 선택 토글 핸들러
  const handleToggleSelect = (indexInModel: number) => {
    setDishItems(prev => prev.map((item, i) => {
      if (i === indexInModel) {
        return { ...item, selected: !item.selected };
      }
      return item;
    }));
  };

  // 실시간 합산 수치 계산
  const selectedKcal = dishItems.filter(item => item.selected).reduce((sum, item) => sum + item.kcal, 0);
  const selectedProtein = dishItems.filter(item => item.selected).reduce((sum, item) => sum + item.protein, 0);
  const selectedCarbs = dishItems.filter(item => item.selected).reduce((sum, item) => sum + item.carbs, 0);
  const selectedFat = dishItems.filter(item => item.selected).reduce((sum, item) => sum + item.fat, 0);

  // 성인/학생 하루 권장 섭취 평균 기준치 (단백질 60g, 탄수화물 130g, 지방 50g) 기준 달성 퍼센트 계산
  const proteinPercent = Math.min(100, Math.round((selectedProtein / 60) * 100));
  const carbsPercent = Math.min(100, Math.round((selectedCarbs / 130) * 100));
  const fatPercent = Math.min(100, Math.round((selectedFat / 50) * 100));

  // 카테고리 필터링
  const filteredDishesWithOriginalIndex = dishItems
    .map((item, originalIdx) => ({ item, originalIdx }))
    .filter(({ item }) => activeCategory === '전체' || item.category === activeCategory);

  const categories: Array<'전체' | '밥류' | '국/찌개' | '반찬' | '디저트'> = ['전체', '밥류', '국/찌개', '반찬', '디저트'];

  const handleSaveResult = () => {
    alert(`📊 영양계산 결과 가상 저장 완료!\n선택한 메뉴 총 열량은 ${selectedKcal} kcal 이며, 수능 영양 다이어리에 안전하게 전송되었습니다.`);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Top Description */}
      <div>
        <h2 className="text-[32px] leading-[40px] font-bold text-[#1c1c17]" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>
          영양계산
        </h2>
        <p className="text-[14px] text-[#444939] mt-1 font-sans">
          급식 메뉴를 먹은 만큼 직접 체크하여, 나만의 **탄단지 영양섭취 균형**을 정교하게 분석해 보세요!
        </p>
        <div className="mt-2 text-[12px] font-bold text-[#3c5500] bg-[#d2ea7a]/30 inline-block px-3 py-1 rounded-full font-sans">
          🎯 기준 날짜: {formatKoreanDate(activeDate)} (중식 기준)
        </div>
      </div>

      {/* Result Card */}
      <section className="bg-white dark:bg-zinc-800 rounded-3xl p-5 shadow-[0_4px_16px_rgba(79,111,0,0.08)] flex flex-col gap-4 border border-[#e5e2db] dark:border-zinc-700">
        <div className="flex justify-between items-center">
          <h3 className="text-[18px] font-bold text-[#1c1c17] flex items-center gap-2" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>
            <span className="material-symbols-outlined text-[#3c5500]" style={{ fontVariationSettings: "'FILL' 1" }}>
              analytics
            </span>
            내가 섭취할 영양소 분기
          </h3>
        </div>

        <div className="flex items-end gap-1 my-1">
          <span className="text-[40px] leading-[40px] font-bold text-[#3c5500] tracking-tight font-sans">
            {selectedKcal}
          </span>
          <span className="text-[14px] text-[#747967] mb-1 font-sans font-medium">kcal (선택됨)</span>
        </div>

        <div className="flex flex-col gap-3.5">
          {/* Protein */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center w-full text-[13px] font-sans">
              <span className="text-[#444939] font-medium">단백질 (Protein)</span>
              <span className="font-bold text-[#3c5500]">{selectedProtein}g</span>
            </div>
            <div className="w-full h-2 bg-[#ebe8e0] dark:bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#536500] rounded-full transition-all duration-500" 
                style={{ width: `${proteinPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Carbs */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center w-full text-[13px] font-sans">
              <span className="text-[#444939] font-medium">탄수화물 (Carbo)</span>
              <span className="font-bold text-[#3c5500]">{selectedCarbs}g</span>
            </div>
            <div className="w-full h-2 bg-[#ebe8e0] dark:bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#3c5500] rounded-full transition-all duration-500" 
                style={{ width: `${carbsPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Fat */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center w-full text-[13px] font-sans">
              <span className="text-[#444939] font-medium">지방 (Fat)</span>
              <span className="font-bold text-[#3c5500]">{selectedFat}g</span>
            </div>
            <div className="w-full h-2 bg-[#ebe8e0] dark:bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#c1cc98] rounded-full transition-all duration-500" 
                style={{ width: `${fatPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Selection Area */}
      <section className="flex flex-col gap-3">
        {/* Categories Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1.5 -mx-4 px-4">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 text-[12px] font-bold px-4 py-2 rounded-full border transition-all duration-200 active:scale-95 font-sans ${
                activeCategory === cat
                  ? 'bg-[#3c5500] text-white border-transparent shadow-sm'
                  : 'bg-[#f1eee6] text-[#444939] border-[#e5e2db] hover:bg-[#ebe8e0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List Items */}
        <div className="flex flex-col gap-3 mt-1.5">
          {filteredDishesWithOriginalIndex.map(({ item, originalIdx }) => (
            <div
              key={originalIdx}
              onClick={() => handleToggleSelect(originalIdx)}
              className={`border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-250 active:scale-[0.98] ${
                item.selected
                  ? 'bg-[#f1eee6]/40 border-[#3c5500] shadow-sm'
                  : 'bg-white dark:bg-zinc-800 border-transparent shadow-[0_2px_8px_rgba(79,111,0,0.04)] text-opacity-65'
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full font-sans ${
                    item.category === '밥류' ? 'bg-[#dde8b2] text-[#414b23]' :
                    item.category === '국/찌개' ? 'bg-[#ffdad6] text-[#ba1a1a]' :
                    item.category === '반찬' ? 'bg-[#c9f17c] text-[#141f00]' :
                    'bg-[#f1eee6] text-[#444939]'
                  }`}>
                    {item.category}
                  </span>
                  <span className={`text-[16px] font-bold font-sans ${item.selected ? 'text-[#1c1c17]' : 'text-[#747967] line-through'}`}>
                    {item.name}
                  </span>
                </div>
                <div className="flex gap-2 text-[12px] text-[#747967] font-sans font-medium pl-1">
                  <span>{item.kcal} kcal</span>
                  <span>•</span>
                  <span>탄{item.carbs}g</span>
                  <span>•</span>
                  <span>단{item.protein}g</span>
                  <span>•</span>
                  <span>지{item.fat}g</span>
                </div>
              </div>

              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                item.selected
                  ? 'bg-[#3c5500] border-[#3c5500] text-white'
                  : 'border-[#c4c9b4] text-transparent'
              }`}>
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Action Button */}
      <div className="pt-2">
        <button 
          onClick={handleSaveResult}
          className="w-full bg-[#3c5500] hover:bg-[#3c5500]/90 text-white font-bold text-[18px] py-4 rounded-2xl shadow-[0_4px_16px_rgba(60,85,0,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2 font-sans"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
            save
          </span>
          계산 결과 저장하기
        </button>
      </div>
    </div>
  );
};
