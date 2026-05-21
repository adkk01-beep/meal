/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NutritionInfo {
  protein: number;       // 단백질 (g)
  carbohydrates: number; // 탄수화물 (g)
  fat: number;           // 지방 (g)
}

export interface MealData {
  id: string;
  schoolName: string;
  date: Date;
  dateKey: string;       // YYYYMMDD 형식
  dayOfWeek: string;     // 월, 화, 수, 목, 금
  mealType: 'lunch' | 'dinner'; // 중식 또는 석식
  title: string;         // 대표 식단 성격 (치즈돈까스 정식, 참치마요덮밥 등)
  dishes: string[];      // 식단 세부 요리 목록
  totalCalories: number; // 총 칼로리 (kcal)
  nutrition: NutritionInfo;
  allergens: string[];   // 알레르기 성분 (대두, 밀, 쇠고기, 돼지고기, 난류, 우유 등)
  description?: string;  // 홈 히어로 카드의 대표 추천 급식 상세 설명
  imageUrl?: string;     // 급식 세부 이미지 URL
}

export interface UserProfile {
  name: string;
  grade: number;
  classNum: number;
  studentNum: number;
  allergies: string[];
  notifications: boolean;
}
