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
 * HeroSection 컴포넌트
 *
 * Lumenstate 랜딩의 첫 히어로 섹션. LineGrid 2:1 수평 분할 위에 브랜드 무드 이미지 두 장을
 * 얹어 "공간 속 빛의 한 장면"을 연출한다. 두 이미지 모두 TimeBlendImage(공용)로 렌더되어
 * 사이트 전체의 시간대와 같은 비율로 Day↔Night 크로스페이드된다.
 *
 * 레이아웃:
 * - 좌측 2/3 (size xs:8): arc-lamp-living — 거실 공간의 아크 램프
 *   · 상단 좌측에 브랜드 타이틀 + 태그라인 오버레이 (반응형 크기)
 * - 우측 1/3 (size xs:4): arch-light-gallery — 아치 조명 갤러리
 * - LineGrid gap=0, 셀 사이 1px 라인 자동 삽입
 *
 * 동작 방식:
 * 1. TimeBlendImage가 TimelineContext를 구독해 Day/Night 블렌드 자동 수행.
 * 2. 브랜드 타이틀은 `text.primary` 토큰 사용 → 테마 전환 시 자동 반전.
 * 3. equalHeight=true로 두 셀이 컨테이너 높이에 맞춰 균등 확장.
 *
 * Props:
 * @param {string} height - 히어로 전체 높이 (CSS 단위 문자열) [Optional, 기본값: '100vh']
 * @param {string} borderColor - LineGrid 라인 색상 토큰 [Optional, 기본값: 'text.primary']
 * @param {object} sx - 외곽 래퍼 추가 스타일 [Optional]
 *
 * Example usage:
 * <HeroSection />
 * <HeroSection height="80vh" />
 */
const HeroSection = forwardRef(function HeroSection({
  height = '100vh',
  borderColor = 'text.primary',
  sx,
  ...props
}, ref) {
  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        width: '100%',
        height,
        ...sx,
      } }
    >
      <LineGrid container gap={ 0 } borderColor={ borderColor } equalHeight>
        <Grid size={ { xs: 8 } }>
          <TimeBlendImage
            dayImage={ arcLampLivingDay }
            nightImage={ arcLampLivingNight }
            alt="Arc lamp in living space"
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
        </Grid>
        <Grid size={ { xs: 4 } }>
          <TimeBlendImage
            dayImage={ archLightGalleryDay }
            nightImage={ archLightGalleryNight }
            alt="Arch light gallery"
          />
        </Grid>
      </LineGrid>
    </Box>
  );
});

export { HeroSection };
