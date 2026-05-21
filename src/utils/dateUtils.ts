/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 한국 주간(KST, Asia/Seoul) 시간으로 오늘을 가리키는 정오(12:00:00) 기준 Date 객체를 반환합니다.
 * 시/분/초를 고정하면 타임존 변환 중에 하루 앞뒤 날짜 오차를 원천 차단할 수 있습니다.
 */
export function getTodayKST(): Date {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
  const parts = formatter.formatToParts(now);
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  
  parts.forEach(part => {
    if (part.type === 'year') year = parseInt(part.value, 10);
    if (part.type === 'month') month = parseInt(part.value, 10);
    if (part.type === 'day') day = parseInt(part.value, 10);
  });
  
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * “M월 D일 요일” (예: 5월 15일 금요일) 형식으로 변환합니다.
 */
export function formatKoreanDate(date: Date): string {
  // 타임존은 아시아 서울로 일치시킴
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  return formatter.format(date);
}

/**
 * “YYYYMMDD” 형식으로 변환합니다 (NEIS API 조회 및 내부 매핑 키용).
 */
export function formatDateKey(date: Date): string {
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(date);
  let year = '';
  let month = '';
  let day = '';
  
  parts.forEach(part => {
    if (part.type === 'year') year = part.value;
    if (part.type === 'month') month = part.value;
    if (part.type === 'day') day = part.value;
  });
  
  return `${year}${month}${day}`;
}

/**
 * 해당 날짜가 포함된 주의 월요일부터 금요일까지 Date 배열 5개를 반환합니다.
 */
export function getWeekDates(date: Date): Date[] {
  // KST 가상 데이트 복제
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const day = d.getDay(); // 0(일) ~ 6(토)
  
  // 일요일(0)이면 월요일은 -6일, 그 외 요일은 1 - 요일만큼 이동
  const distanceToMonday = day === 0 ? -6 : 1 - day;
  
  const monday = new Date(d);
  monday.setDate(d.getDate() + distanceToMonday);
  
  const weekDates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);
    weekDates.push(currentDay);
  }
  return weekDates;
}

/**
 * 해당 날짜가 몇 월 몇 주차인지 계산하여 "M월 N주차" 형식으로 반환합니다.
 * 달력 기준의 한국식 보편 주차 계산을 적용합니다.
 */
export function getWeekOfMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const currentDate = date.getDate();
  
  // 해당 월 1일의 요일 구하기 (0: 일요일, 1: 월요일, ...)
  const firstDay = new Date(year, month, 1).getDay();
  
  // 첫째 주 월요일까지의 공백을 포함해 7일 단위로 올림하여 주차를 구함
  const offset = firstDay === 0 ? 6 : firstDay - 1; // 월요일 기준 요일 오프셋
  const weekNum = Math.ceil((currentDate + offset) / 7);
  
  return `${month + 1}월 ${weekNum}주차`;
}

/**
 * 기본 선택 날짜를 구합니다.
 * - 오늘이 평일(월~금)이면 오늘 반환
 * - 오늘이 토요일 또는 일요일이면 가장 가까운 다음 월요일을 반환 (방식 B 적용 편의성 제고)
 */
export function getDefaultSelectedDate(today: Date): Date {
  const day = today.getDay(); // 0(일) ~ 6(토)
  if (day >= 1 && day <= 5) {
    return today;
  }
  
  // 주말인 경우: 다음 주 월요일로 설정
  const daysToAdd = day === 6 ? 2 : 1;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysToAdd);
  nextMonday.setHours(12, 0, 0, 0);
  return nextMonday;
}

/**
 * 한국 시간 요일 약칭(월, 화, 수, 목, 금)을 구합니다.
 */
export function getKoreanDayOfWeek(date: Date): string {
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    weekday: 'short'
  });
  return formatter.format(date);
}
