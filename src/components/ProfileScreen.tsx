/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ userProfile, setUserProfile }) => {
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [newAllergen, setNewAllergen] = useState<string>('');

  const commonAllergens = ['우유', '땅콩', '대두', '밀', '쇠고기', '돼지고기', '난류', '조개류', '오징어', '복숭아', '아황산류'];

  // 알레르기 토글 스위치 변경
  const handleToggleAllergyNotif = () => {
    setUserProfile(prev => ({
      ...prev,
      notifications: !prev.notifications
    }));
  };

  // 알레르기 성분 삭제
  const handleRemoveAllergy = (allergen: string) => {
    setUserProfile(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergen)
    }));
  };

  // 알레르기 성분 추가
  const handleAddAllergy = (allergen: string) => {
    if (!allergen || userProfile.allergies.includes(allergen)) return;
    setUserProfile(prev => ({
      ...prev,
      allergies: [...prev.allergies, allergen]
    }));
    setNewAllergen('');
    setShowAddMenu(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Top Profile Bento Card */}
      <section className="bg-gradient-to-br from-[#d5ed7d] to-[#dde8b2] rounded-3xl p-5 shadow-[0_4px_16px_rgba(79,111,0,0.08)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-sm overflow-hidden flex items-center justify-center">
              <img 
                alt="김학생 프로필 아바타" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-[#171e00]" style={{ fontFamily: '"Gmarket Sans", "Plus Jakarta Sans", sans-serif' }}>
                {userProfile.name}
              </h3>
              <p className="text-[14px] font-medium text-[#485229] mt-1 font-sans">
                {userProfile.grade}학년 {userProfile.classNum}반 {userProfile.studentNum}번
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => alert('프로필 편집은 학급 인증 완료 후 가상으로 제공됩니다.')}
            className="p-2.5 bg-white/50 hover:bg-white/80 active:scale-95 text-[#171e00] rounded-full transition-all"
            aria-label="Edit Profile"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
        </div>
      </section>

      {/* Settings Grid List */}
      <section className="flex flex-col gap-4">
        
        {/* Allergy Alert Setting (Card) */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-5 shadow-[0_4px_16px_rgba(79,111,0,0.08)] border border-[#e5e2db] dark:border-zinc-700">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#3c5500] text-[24px]">warning</span>
              <div>
                <h3 className="text-[16px] font-bold text-[#1c1c17] font-sans">알레르기 경고 알림</h3>
                <p className="text-[12px] text-[#747967] font-sans mt-0.5">내가 기피하는 식품이 식단에 있다면 즉시 알립니다</p>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <div 
              onClick={handleToggleAllergyNotif}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                userProfile.notifications ? 'bg-[#3c5500]' : 'bg-[#c4c9b4]'
              }`}
            >
              <span 
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  userProfile.notifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Active Allergy Tags */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#e5e2db] dark:border-zinc-700/50">
            {userProfile.allergies.map((allergen, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 bg-[#ffdad6] text-[#93000a] rounded-full text-[12px] font-bold border border-[#ba1a1a]/15 flex items-center gap-1 font-sans"
              >
                {allergen}
                <button 
                  onClick={() => handleRemoveAllergy(allergen)}
                  className="hover:bg-white/80 active:scale-90 rounded-full w-4 h-4 flex items-center justify-center transition-all"
                  aria-label={`Remove ${allergen}`}
                >
                  <span className="material-symbols-outlined text-[12px] font-bold">close</span>
                </button>
              </span>
            ))}

            <button 
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="px-3 py-1 bg-[#f1eee6] hover:bg-[#ebe8e0] dark:bg-zinc-700/50 text-[#1c1c17] rounded-full text-[12px] font-bold hover:scale-95 transition-all flex items-center gap-1 font-sans"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              추가하기
            </button>
          </div>

          {/* Inline Allergen Addition UI */}
          {showAddMenu && (
            <div className="mt-4 p-3 bg-[#f1eee6]/50 rounded-xl border border-[#c4c9b4]/20 animate-fade-in flex flex-col gap-2">
              <p className="text-[12px] font-bold text-[#444939] font-sans">식품 알레르기 목록 추가</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {commonAllergens
                  .filter(a => !userProfile.allergies.includes(a))
                  .map((alg, i) => (
                    <button 
                      key={i}
                      onClick={() => handleAddAllergy(alg)}
                      className="bg-white hover:bg-[#d2ea7a]/30 hover:border-[#3c5500] px-2.5 py-1 text-[11px] font-semibold border border-[#c4c9b4] text-[#444939] rounded-lg transition-all"
                    >
                      + {alg}
                    </button>
                  ))}
              </div>

              <div className="flex gap-2 mt-2">
                <input 
                  type="text"
                  placeholder="직접 입력 (예: 복숭아)"
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  className="bg-white flex-1 px-3 py-1.5 rounded-lg border border-[#c4c9b4] text-[13px] font-sans focus:outline-none focus:border-[#3c5500]"
                />
                <button 
                  onClick={() => handleAddAllergy(newAllergen.trim())}
                  className="bg-[#3c5500] text-white font-bold px-4 py-1.5 rounded-lg text-[13px] font-sans active:scale-95 transition-transform"
                >
                  등록
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Daily Meal Schedule Notification Notification Card */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-5 shadow-[0_4px_16px_rgba(79,111,0,0.08)] border border-[#e5e2db] dark:border-zinc-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#3c5500] text-[24px]">notifications_active</span>
              <div>
                <h3 className="text-[16px] font-bold text-[#1c1c17] font-sans">일일 식단 정기 알림</h3>
                <p className="text-[12px] text-[#747967] font-sans mt-0.5">매일 아침 유용한 등교 시간 알람</p>
                <p className="text-[13px] text-[#3c5500] font-bold font-sans mt-1">오전 8:00 발송</p>
              </div>
            </div>

            <div 
              onClick={() => alert('조식 알림 정기푸시는 브라우저 테스트 상태입니다.')}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#3c5500] transition-colors duration-200 ease-in-out"
            >
              <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 translate-x-5 transition duration-200" />
            </div>
          </div>
        </div>

        {/* Standard Links Card List */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl overflow-hidden shadow-[0_4px_16px_rgba(79,111,0,0.08)] border border-[#e5e2db] dark:border-zinc-700">
          <a 
            onClick={() => alert('준비 중인 고객센터 채널입니다.')}
            className="flex justify-between items-center p-4 hover:bg-[#f1eee6]/50 dark:hover:bg-zinc-700/50 transition-colors border-b border-[#e5e2db]/60 dark:border-zinc-700 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#747967] text-[20px]">support_agent</span>
              <span className="text-[15px] font-semibold text-[#1c1c17] font-sans">고객센터 / 씨마스고 문의하기</span>
            </div>
            <span className="material-symbols-outlined text-[#747967] text-[18px]">chevron_right</span>
          </a>

          <a 
            onClick={() => alert('이용 가이드 및 서비스 약관 규정 고지')}
            className="flex justify-between items-center p-4 hover:bg-[#f1eee6]/50 dark:hover:bg-zinc-700/50 transition-colors border-b border-[#e5e2db]/60 dark:border-zinc-700 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#747967] text-[20px]">description</span>
              <span className="text-[15px] font-semibold text-[#1c1c17] font-sans">급식 알리미 이용약관</span>
            </div>
            <span className="material-symbols-outlined text-[#747967] text-[18px]">chevron_right</span>
          </a>

          <a 
            onClick={() => alert('성공적으로 가상 로그아웃되었습니다.')}
            className="flex justify-between items-center p-4 hover:bg-[#ffdad6]/20 transition-colors text-[#ba1a1a] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="text-[15px] font-bold font-sans">서비스 로그아웃</span>
            </div>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </a>
        </div>
      </section>

      {/* Footer message */}
      <footer className="mt-4 text-center">
        <p className="text-[12px] text-[#747967] font-sans font-medium">© 2026 씨마스고등학교 급식실</p>
        <p className="text-[11px] text-[#747967] mt-1 font-sans">안전하고 맛있고 정성을 다하는 수능 대박 식단을 지향합니다.</p>
      </footer>
    </div>
  );
};
