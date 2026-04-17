import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LineGrid from '../layout/LineGrid';
import { TimeBlendImage } from '../media/TimeBlendImage';
import { content } from '../../data/content';
import arcLampLivingDay from '../../assets/brand-mood/arc-lamp-living.png';
import arcLampLivingNight from '../../assets/brand-mood/arc-lamp-living-night.png';
import archLightGalleryDay from '../../assets/brand-mood/arch-light-gallery.png';
import archLightGalleryNight from '../../assets/brand-mood/arch-light-gallery-night.png';

/**
 * 원본 이미지 aspect ratio — crop 없이 본 비율 그대로 표시하기 위해 사용.
 * 두 이미지는 2:1 그리드 셀에서 자연 높이가 서로 근접하도록 설계되어 있다.
 */
const ARC_LAMP_RATIO = '2528/1696';      // ≈ 1.49 (가로)
const ARCH_GALLERY_RATIO = '1792/2400';  // ≈ 0.75 (세로)

/**
 * HeroSection 컴포넌트
 *
 * Lumenstate 랜딩의 첫 히어로 섹션. LineGrid 2:1 수평 분할 위에 브랜드 무드 이미지 두 장을
 * 얹어 "공간 속 빛의 한 장면"을 연출한다. 두 이미지 모두 TimeBlendImage(공용)로 렌더되어
 * 사이트 전체의 시간대와 같은 비율로 Day↔Night 크로스페이드된다.
 *
 * 이미지 비율:
 * - 원본 aspect ratio를 유지하기 위해 TimeBlendImage에 `ratio` prop을 전달 → 셀 높이가
 *   이미지 자연 비율로 결정됨. 고정 높이/equalHeight 미사용.
 * - arc-lamp-living: 2528×1696 (가로), arch-light-gallery: 1792×2400 (세로).
 *   두 이미지가 2/3 + 1/3 폭에서 자연 높이가 거의 일치하도록 설계됨.
 *
 * 레이아웃:
 * - 좌측 2/3 (size xs:8): arc-lamp-living — 거실 공간의 아크 램프
 *   · 상단 좌측에 브랜드 타이틀 + 태그라인 오버레이 (position-relative wrapper 안에 배치)
 * - 우측 1/3 (size xs:4): arch-light-gallery — 아치 조명 갤러리
 * - LineGrid gap=0, 셀 사이 1px 라인 자동 삽입
 *
 * 동작 방식:
 * 1. TimeBlendImage가 TimelineContext를 구독해 Day/Night 블렌드 자동 수행.
 * 2. 브랜드 타이틀은 `text.primary` 토큰 사용 → 테마 전환 시 자동 반전.
 *
 * Props:
 * @param {string} height - 히어로 전체 높이. 미지정 시 이미지 원본 비율로 자동 결정 [Optional]
 * @param {string} borderColor - LineGrid 라인 색상 토큰 [Optional, 기본값: 'text.primary']
 * @param {object} sx - 외곽 래퍼 추가 스타일 [Optional]
 *
 * Example usage:
 * <HeroSection />                    // 원본 비율로 렌더
 * <HeroSection height="100vh" />     // 강제 고정 높이 (이미지는 cover로 크롭될 수 있음)
 */
const HeroSection = forwardRef(function HeroSection({
  height,
  borderColor = 'text.primary',
  sx,
  ...props
}, ref) {
  const hasFixedHeight = height !== undefined;

  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        width: '100%',
        ...(hasFixedHeight && { height }),
        ...sx,
      } }
    >
      <LineGrid
        container
        gap={ 0 }
        borderColor={ borderColor }
        { ...(hasFixedHeight ? { equalHeight: true } : {}) }
      >
        <Grid
          size={ { xs: 8 } }
          sx={ hasFixedHeight ? undefined : { alignSelf: 'flex-start' } }
        >
          <Box
            sx={ {
              position: 'relative',
              width: '100%',
              ...(hasFixedHeight && { height: '100%' }),
            } }
          >
            <TimeBlendImage
              dayImage={ arcLampLivingDay }
              nightImage={ arcLampLivingNight }
              alt="Arc lamp in living space"
              { ...(hasFixedHeight ? {} : { ratio: ARC_LAMP_RATIO }) }
            />
            {/* 좌측 상단 브랜드 오버레이 — 반응형 크기/패딩 */}
            <Box
              sx={ {
                position: 'absolute',
                top: 0,
                left: 0,
                p: { xs: 3, sm: 4, md: 6, lg: 8 },
                zIndex: 2,
                color: 'text.primary',
                pointerEvents: 'none',
                maxWidth: '90%',
              } }
            >
              <Typography
                component="h1"
                sx={ {
                  typography: { xs: 'h4', md: 'h1' },
                  mb: { xs: 1.5, md: 2.5 },
                } }
              >
                { content.brand.name }
              </Typography>
              <Typography
                sx={ {
                  fontWeight: 400,
                  opacity: 0.85,
                  letterSpacing: '0.02em',
                  ml: 1,
                  fontSize: {
                    xs: '1.125rem',  // 18px
                    md: '1.5rem',    // 24px
                    lg: '1.75rem',   // 28px
                  },
                  lineHeight: 1.4,
                } }
              >
                { content.brand.tagline }
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid
          size={ { xs: 4 } }
          sx={ hasFixedHeight ? undefined : { alignSelf: 'flex-start' } }
        >
          <TimeBlendImage
            dayImage={ archLightGalleryDay }
            nightImage={ archLightGalleryNight }
            alt="Arch light gallery"
            { ...(hasFixedHeight ? {} : { ratio: ARCH_GALLERY_RATIO }) }
          />
        </Grid>
      </LineGrid>
    </Box>
  );
});

export { HeroSection };
