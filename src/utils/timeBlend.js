/**
 * Lumenstate — 시간 블렌드 공용 유틸
 *
 * 제품 카드의 Day/Night 이미지 opacity와 사이트 전역 배경/전경 색이 같은 곡선을
 * 공유해 "시간의 결" 감각을 통일한다. 양쪽 모두 `smoothstep(timeValue)` 값을
 * 블렌드 비율로 소비한다.
 *
 * - smoothstep: timeValue(0~1) → 블렌드 비율(0~1). 중간 구간 겹침을 줄여 "흐릿한
 *   더블 노출"을 피하는 ease-in-out 곡선.
 * - lerpHex: 두 hex 색상을 선형 보간. smoothstep이 이미 곡선을 만들었으므로
 *   여기선 linear가 맞다.
 */

/**
 * smoothstep ease-in-out 매핑. 3x² - 2x³.
 * @param {number} value - 0~1 범위
 * @returns {number} 0~1 범위
 */
export const smoothstep = (value) => {
  if (typeof value !== 'number') return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value * value * (3 - 2 * value);
};

/**
 * hex 문자열(#RGB 또는 #RRGGBB)을 {r, g, b}로 파싱.
 */
const parseHex = (hex) => {
  const s = hex.startsWith('#') ? hex.slice(1) : hex;
  const full = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
};

const toHexByte = (n) => {
  const clamped = Math.max(0, Math.min(255, Math.round(n)));
  return clamped.toString(16).padStart(2, '0');
};

/**
 * 두 hex 색상을 t 비율로 선형 보간한다.
 *
 * @param {string} aHex - 시작 색 (#RRGGBB)
 * @param {string} bHex - 끝 색 (#RRGGBB)
 * @param {number} t - 0~1. smoothstep 등 곡선이 이미 적용된 값을 넘길 것.
 * @returns {string} #RRGGBB
 */
export const lerpHex = (aHex, bHex, t) => {
  const a = parseHex(aHex);
  const b = parseHex(bHex);
  const clamped = t <= 0 ? 0 : t >= 1 ? 1 : t;
  const r = a.r + (b.r - a.r) * clamped;
  const g = a.g + (b.g - a.g) * clamped;
  const bl = a.b + (b.b - a.b) * clamped;
  return `#${ toHexByte(r) }${ toHexByte(g) }${ toHexByte(bl) }`;
};
