/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MealData } from '../types';
import { getWeekDates, formatDateKey, getKoreanDayOfWeek } from '../utils/dateUtils';

/**
 * 앱이 구동되는 시점의 날짜(KST)를 기준으로, 해당 주 월요일부터 금요일까지의 동적 급식 mock data 10개(중식/석식 각 5개)를 생성해 반환합니다.
 */
export function generateMockMeals(referenceDate: Date): MealData[] {
  const weekDates = getWeekDates(referenceDate);
  const meals: MealData[] = [];

  const daysOfWeekKor = ['월', '화', '수', '목', '금'];

  // 대표 설명 세트 (홈 화면 히어로 카드에서 사용됨)
  const menuDescriptions: Record<string, string> = {
    '월-lunch': '바삭하게 튀겨낸 치즈돈까스 위에 깊은 풍미의 수제 특제브라운소스를 올렸습니다. 뜨끈한 한우 미역국과 배추김치, 아삭아삭한 시금치나물이 급식의 든든한 조화를 보여줍니다.',
    '월-dinner': '고소한 마요네즈와 달콤 명품 쯔유 소스, 단백함을 살린 참치 슬라이스가 일품인 참치마요덮밥입니다. 유부장국과 대표 분식인 매콤달콤한 떡볶이와 완벽한 조화를 이룹니다.',
    '화-lunch': '단란하게 구워낸 담백소불고기와 신선한 알야채가 가득 들어간 소불고기 덮밥입니다. 화풍을 더한 시원하고 알싸한 팽이버섯 된장국, 노릇노릇 해물파전이 식탁을 따뜻하게 물들입니다.',
    '화-dinner': '진한 인도풍 커리 소스에 매콤 바삭한 엄선 치킨 가라아게를 퐁당 얹은 카레라이스입니다. 부드러운 두부유부국 및 달콤한 고구마 고로케를 곁들여 활력을 보충해 줍니다.',
    '수-lunch': '씨마스고 명물! 엄선된 1등급 한돈으로 두드려 만든 고소하고 도톰한 수제 돈까스 정식입니다. 맑게 싹 끓여낸 소고기 미역국 한 그릇이 몸을 건강하게 정화해 줍니다.',
    '수-dinner': '철판에 육즙 가득 고소하게 구워 담아낸 도톰한 삼겹살 구이 정식입니다. 칼칼하게 졸여낸 어묵 매운탕과 짭조름한 무쌈&야채무침, 비법 쌈장이 조화를 이루어 든든한 저녁이 됩니다.',
    '목-lunch': '매콤하고 쫄깃하게 볶아내어 밥도둑을 자처하는 영양만점 낙지 비빔밥입니다. 맑고 깔끔한 콩나물국과 푸딩처럼 아주 보들보들한 계란찜이 매콤함을 살며시 감싸안아 줍니다.',
    '목-dinner': '가쓰오와 남해 멸치로 맑고 시원하게 우려낸 육수에 쫄깃한 면발을 담아 올린 명품 잔치국수입니다. 꼬마 주먹밥과 고소촉촉한 김말이 튀김이 더해져 즐거운 야식 느낌을 선사합니다.',
    '금-lunch': '갓 튀겨 바삭함이 가득 스며든 치킨가라아게 마요덮밥과 쫄깃하고 깊은 국물의 유부 미니 우동입니다. 상큼한 요구르트 한 병이 깔끔한 입가심을 도와줍니다.',
    '금-dinner': '신선 가득 꽃게와 주꾸미가 깊고 칼칼하게 잘 어우러진 명품 해물 짬뽕밥입니다. 중국식 촉촉한 바삭함의 군만두를 달콤한 짜장 떡볶이 소스에 가볍게 찍어 맛있게 즐기세요.'
  };

  const images: Record<string, string> = {
    '월-lunch': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=600',
    '월-dinner': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600',
    '화-lunch': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600',
    '화-dinner': 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=600',
    '수-lunch': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=600',
    '수-dinner': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    '목-lunch': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600',
    '목-dinner': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=600',
    '금-lunch': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=600',
    '금-dinner': 'https://images.unsplash.com/photo-1582234375179-4b10deddbb9a?auto=format&fit=crop&q=80&w=600',
  };

  // 월~금 루프
  for (let i = 0; i < 5; i++) {
    const curDate = weekDates[i];
    const key = formatDateKey(curDate);
    const dayName = daysOfWeekKor[i];

    // 중식 데이터
    const lunchKey = `${dayName}-lunch`;
    const lunchProps = getPresetMealsProps(dayName, 'lunch');
    meals.push({
      id: `meal-${key}-lunch`,
      schoolName: '씨마스고등학교',
      date: curDate,
      dateKey: key,
      dayOfWeek: dayName,
      mealType: 'lunch',
      title: lunchProps.title,
      dishes: lunchProps.dishes,
      totalCalories: lunchProps.totalCalories,
      nutrition: lunchProps.nutrition,
      allergens: lunchProps.allergens,
      description: menuDescriptions[lunchKey] || '씨마스고등학교 맛있는 중식 급식입니다.',
      imageUrl: images[lunchKey] || 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=600'
    });

    // 석식 데이터
    const dinnerKey = `${dayName}-dinner`;
    const dinnerProps = getPresetMealsProps(dayName, 'dinner');
    meals.push({
      id: `meal-${key}-dinner`,
      schoolName: '씨마스고등학교',
      date: curDate,
      dateKey: key,
      dayOfWeek: dayName,
      mealType: 'dinner',
      title: dinnerProps.title,
      dishes: dinnerProps.dishes,
      totalCalories: dinnerProps.totalCalories,
      nutrition: dinnerProps.nutrition,
      allergens: dinnerProps.allergens,
      description: menuDescriptions[dinnerKey] || '씨마스고등학교 맛있는 석식 급식입니다.',
      imageUrl: images[dinnerKey] || 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600'
    });
  }

  return meals;
}

/**
 * 요일 및 유형별 프리셋 식단 속성을 고정 반환하는 도우미 함수
 */
function getPresetMealsProps(day: string, type: 'lunch' | 'dinner') {
  if (day === '월') {
    if (type === 'lunch') {
      return {
        title: '치즈돈까스 정식',
        dishes: ['친환경현미밥', '한우 미역국', '수제 치즈돈까스 & 특제소스', '시금치나물무침', '배추김치'],
        totalCalories: 845,
        nutrition: { protein: 32, carbohydrates: 110, fat: 25 },
        allergens: ['대두', '밀', '쇠고기', '돼지고기']
      };
    } else {
      return {
        title: '참치마요덮밥',
        dishes: ['참치마요덮밥', '유부장국', '매콤떡볶이', '단무지', '쿨피스'],
        totalCalories: 720,
        nutrition: { protein: 22, carbohydrates: 98, fat: 18 },
        allergens: ['난류', '우유', '대두', '밀']
      };
    }
  } else if (day === '화') {
    if (type === 'lunch') {
      return {
        title: '소불고기 덮밥',
        dishes: ['친환경보리밥', '소불고기 볶음', '팽이버섯 된장국', '노릇 해물파전', '도토리묵 무침', '깍두기'],
        totalCalories: 810,
        nutrition: { protein: 28, carbohydrates: 105, fat: 22 },
        allergens: ['대두', '밀', '쇠고기', '조개류']
      };
    } else {
      return {
        title: '가라아게 카레라이스',
        dishes: ['매콤 치킨 카레라이스', '맑은 두부 유부국', '고구마 고로케', '야채 드레싱 샐러드', '배추김치'],
        totalCalories: 750,
        nutrition: { protein: 24, carbohydrates: 112, fat: 15 },
        allergens: ['우유', '대두', '밀', '닭고기']
      };
    }
  } else if (day === '수') {
    if (type === 'lunch') {
      return {
        title: '수제 돈까스 & 특제소스',
        dishes: ['친환경 혼합잡곡밥', '한우 미역국', '수제 돈까스 & 특제소스', '시금치 나물무침', '배추김치'],
        totalCalories: 850,
        nutrition: { protein: 35, carbohydrates: 100, fat: 26 },
        allergens: ['대두', '밀', '쇠고기', '돼지고기']
      };
    } else {
      return {
        title: '삼겹살 구이 정식',
        dishes: ['쌀밥', '삼겹살 구이', '어묵 매운탕', '무쌈 & 야채무침', '비법 쌈장', '깍두기'],
        totalCalories: 780,
        nutrition: { protein: 30, carbohydrates: 85, fat: 32 },
        allergens: ['대두', '밀', '돼지고기']
      };
    }
  } else if (day === '목') {
    if (type === 'lunch') {
      return {
        title: '낙지 비빔밥',
        dishes: ['낙지 비빔밥', '맑은 콩나물국', '야채 계란찜', '바삭 야채 튀김', '깍두기'],
        totalCalories: 790,
        nutrition: { protein: 26, carbohydrates: 115, fat: 14 },
        allergens: ['난류', '대두', '밀', '조개류']
      };
    } else {
      return {
        title: '잔치국수 & 주먹밥',
        dishes: ['잔치국수', '김가루 고소 주먹밥', '김말이 튀김', '단무지', '오렌지 한 조각'],
        totalCalories: 690,
        nutrition: { protein: 18, carbohydrates: 120, fat: 10 },
        allergens: ['대두', '밀']
      };
    }
  } else { // 금
    if (type === 'lunch') {
      return {
        title: '치킨 마요덮밥',
        dishes: ['치킨가라아게 마요덮밥', '유부 미니 우동', '바삭 감자튀김', '배추김치', '상큼 요구르트'],
        totalCalories: 830,
        nutrition: { protein: 25, carbohydrates: 112, fat: 24 },
        allergens: ['난류', '우유', '대두', '밀', '닭고기']
      };
    } else {
      return {
        title: '해물 짬뽕밥',
        dishes: ['얼큰 해물 짬뽕밥', '바삭 군만두', '새콤 단무지', '짜장 국물 떡볶이', '미니 찹쌀 도넛'],
        totalCalories: 740,
        nutrition: { protein: 22, carbohydrates: 108, fat: 16 },
        allergens: ['대두', '밀', '조개류', '오징어']
      };
    }
  }
}
