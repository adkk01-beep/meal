/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { MealListScreen } from './components/MealListScreen';
import { NutritionScreen } from './components/NutritionScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { generateMockMeals } from './data/mockMeals';
import { getTodayKST } from './utils/dateUtils';
import { UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  // 한국 오프셋 기준 오늘 날짜 획득
  const today = useMemo(() => getTodayKST(), []);

  // 오늘 날짜가 속한 주의 동적 5일치(월~금) 중식 및 석식 Mock Meals 목록 자동 생성
  const meals = useMemo(() => generateMockMeals(today), [today]);

  // 김학생 가상 프로필 상태 (알레르기 실시간 연동을 위해 글로벌 관리)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '김학생',
    grade: 2,
    classNum: 3,
    studentNum: 15,
    allergies: ['우유', '땅콩'],
    notifications: true
  });

  const handleHeaderIconClick = () => {
    if (activeTab === 'profile') {
      alert('⚙️ 씨마스고 인트라넷 계정 설정이 가상으로 열립니다.');
    } else {
      const activeLunch = meals.find(m => m.mealType === 'lunch');
      const matchedAllergens = activeLunch 
        ? activeLunch.allergens.filter(a => userProfile.allergies.includes(a))
        : [];
      
      if (userProfile.notifications && matchedAllergens.length > 0) {
        alert(`🔔 급식 안전 알림!\n오늘 급식 중 주의 대상 성분(${matchedAllergens.join(', ')})이 들어있습니다. 식사에 유의하세요!`);
      } else {
        alert('🔔 새 급식 알림: 오늘의 식단과 칼로리가 완벽하게 구성되었습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7ef] dark:bg-zinc-950 text-[#1c1c17] dark:text-zinc-100 font-sans antialiased pb-24 selection:bg-[#c9f17c] selection:text-[#141f00]">
      {/* Top Application Bar */}
      <Header 
        activeTab={activeTab} 
        onIconClick={handleHeaderIconClick}
        onLogoClick={() => setActiveTab('home')}
      />

      {/* Main Single Column Bento-Grid Style Screen */}
      <main className="max-w-[390px] md:max-w-xl mx-auto w-full px-6 pt-24 pb-8 flex flex-col gap-8 transition-colors duration-300">
        {activeTab === 'home' && (
          <HomeScreen 
            meals={meals} 
            userProfile={userProfile}
            onNavigateToMenu={() => setActiveTab('menu')}
          />
        )}

        {activeTab === 'menu' && (
          <MealListScreen 
            meals={meals} 
            userProfile={userProfile}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionScreen 
            meals={meals}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen 
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        )}
      </main>

      {/* Persistent Bottom Tab In-App Controller Bar */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

