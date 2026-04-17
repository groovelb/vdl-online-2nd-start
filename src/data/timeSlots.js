/**
 * Lumenstate — 시간대 슬롯 정의
 *
 * 하루의 4개 시각을 Day/Night 블렌드 값(0~1)과 라이트/다크 테마로 매핑한다.
 * ProductCard 등 Time Blend 이미지 컴포넌트가 `timeValue`를,
 * TimelineProvider / Themed Shell이 `theme`을 소비한다.
 *
 * 비선형 timeValue:
 * - 16시는 아직 해가 높다 → 살짝 따뜻한 기미만 (0.20)
 * - 20시는 일몰 후, 이미 밤에 가깝다 → 0.70
 * 균등 분할(0.33 / 0.66)은 "시간의 결"이 평면적으로 읽히므로 지양.
 *
 * theme 매핑:
 * - 12시·16시 → 'light' (낮의 공간감)
 * - 20시·24시 → 'dark' (밤의 공간감)
 */

export const TIME_SLOTS = [
  { id: 'noon',      hour: 12, label: '점심', timeValue: 0.00, theme: 'light' },
  { id: 'afternoon', hour: 16, label: '오후', timeValue: 0.20, theme: 'light' },
  { id: 'evening',   hour: 20, label: '저녁', timeValue: 0.70, theme: 'dark'  },
  { id: 'midnight',  hour: 24, label: '밤',   timeValue: 1.00, theme: 'dark'  },
];

/**
 * id로 slot을 찾는다.
 * @param {string} id - slot id ('noon' | 'afternoon' | 'evening' | 'midnight')
 * @returns {object|undefined}
 */
export const getTimeSlot = (id) => TIME_SLOTS.find((s) => s.id === id);

/**
 * hour로 slot을 찾는다.
 * @param {number} hour - 정수 시각 (12, 16, 20, 24)
 * @returns {object|undefined}
 */
export const getTimeSlotByHour = (hour) => TIME_SLOTS.find((s) => s.hour === hour);

export default TIME_SLOTS;
