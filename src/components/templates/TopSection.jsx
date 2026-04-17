import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import LineGrid from '../layout/LineGrid';
import { HeroSection } from './HeroSection';
import { BrandValueSection } from './BrandValueSection';

/**
 * TopSection 컴포넌트
 *
 * Lumenstate 랜딩 최상단 블록. HeroSection과 BrandValueSection을 LineGrid **stack 모드**로
 * 수직 결합하여, 히어로 내부의 2:1 세로 라인 → 섹션 사이의 1px 가로 라인 → 브랜드 가치
 * 3열 라인으로 이어지는 "하나의 그리드 판"을 연출한다.
 *
 * 레이아웃:
 * 1. HeroSection (기본: 이미지 원본 비율 유지) — 2:1 수평 분할 + 브랜드 타이틀 오버레이
 * 2. 1px Horizontal Divider (LineGrid stack mode가 자동 삽입)
 * 3. BrandValueSection — 3열 브랜드 가치 카드
 *
 * 동작 방식:
 * 1. LineGrid에 container prop을 주지 않으면 Stack 모드로 동작 (Divider 자동 삽입).
 * 2. borderColor는 두 섹션 모두 동일 토큰으로 묶여 테마 전환 시 동시 반전된다.
 * 3. heroHeight 미지정 시 HeroSection이 원본 이미지 비율로 자연 높이 렌더, 지정 시 해당 높이로 고정.
 *
 * Props:
 * @param {string} heroHeight - HeroSection 높이 (CSS 단위 문자열). 미지정 시 이미지 원본 비율로 자동 [Optional]
 * @param {string} borderColor - 모든 LineGrid 라인 색상 토큰 [Optional, 기본값: 'text.primary']
 * @param {array} features - BrandValueSection에 전달할 브랜드 가치 항목 배열 [Optional]
 * @param {object} sx - 외곽 래퍼 추가 스타일 [Optional]
 *
 * Example usage:
 * <TopSection />                        // 히어로는 이미지 원본 비율로 렌더
 * <TopSection heroHeight="100vh" />     // 히어로 높이 고정 (cover 크롭 발생 가능)
 */
const TopSection = forwardRef(function TopSection({
  heroHeight,
  borderColor = 'text.primary',
  features,
  sx,
  ...props
}, ref) {
  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        width: '100%',
        ...sx,
      } }
    >
      <LineGrid gap={ 0 } borderColor={ borderColor }>
        <HeroSection height={ heroHeight } borderColor={ borderColor } />
        <BrandValueSection features={ features } borderColor={ borderColor } />
      </LineGrid>
    </Box>
  );
});

export { TopSection };
