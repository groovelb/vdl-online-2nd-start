import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { TimeBlendImage } from './TimeBlendImage';
import arcLampLiving from '../../assets/brand-mood/arc-lamp-living.png';
import arcLampLivingNight from '../../assets/brand-mood/arc-lamp-living-night.png';
import archLightGallery from '../../assets/brand-mood/arch-light-gallery.png';
import archLightGalleryNight from '../../assets/brand-mood/arch-light-gallery-night.png';
import columnLampStudio from '../../assets/brand-mood/column-lamp-studio.png';
import columnLampStudioNight from '../../assets/brand-mood/column-lamp-studio-night.png';

export default {
  title: 'Component/4. Media/TimeBlendImage',
  component: TimeBlendImage,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## TimeBlendImage

Day/Night 쌍 이미지를 TimelineContext의 \`timeValue\`에 연동해 크로스페이드하는 **공용 미디어 프리미티브**.
Lumenstate의 "시간의 결" 시그니처를 ProductCard·HeroSection 등 여러 컴포넌트가 공유하도록
smoothstep + brightness/saturate filter 로직을 한 곳으로 모은 단일 진실 소스.

### 사용처
- \`ProductCard\` — 이미지 영역을 이 컴포넌트로 렌더
- \`HeroSection\` — 좌/우 2:1 그리드의 각 셀 이미지

### 제어
\`timeValue\` prop 미지정 시 toolbar Time of Day 자동 반영.
        `,
      },
    },
  },
  argTypes: {
    dayImage: { control: 'text', description: 'Day 이미지 URL' },
    nightImage: { control: 'text', description: 'Night 이미지 URL' },
    alt: { control: 'text', description: 'Day 이미지 대체 텍스트' },
    ratio: {
      control: 'select',
      options: [undefined, '1/1', '3/4', '4/5', '16/9', '21/9'],
      description: 'aspect-ratio (미지정 시 부모 높이 100%)',
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain'],
      description: 'object-fit 값',
    },
    timeValue: {
      control: { type: 'number', min: 0, max: 1, step: 0.01 },
      description: '시간 값 0(Day)~1(Night). 미지정 시 toolbar 구독',
    },
  },
};

/**
 * 기본 — aspect-ratio 4/5, toolbar Time of Day 자동 반영.
 */
export const Default = {
  args: {
    dayImage: arcLampLiving,
    nightImage: arcLampLivingNight,
    alt: 'Arc lamp in living space',
    ratio: '4/5',
    objectFit: 'cover',
  },
  render: (args) => (
    <Box sx={ { width: 360 } }>
      <TimeBlendImage { ...args } />
    </Box>
  ),
};

/**
 * Fill Container — ratio 미지정. 부모 높이 100% 채움. 히어로/섹션 타입에 사용.
 */
export const FillContainer = {
  render: () => (
    <Box sx={ { height: 480, width: '100%' } }>
      <TimeBlendImage
        dayImage={ archLightGallery }
        nightImage={ archLightGalleryNight }
        alt="Arch light gallery"
      />
    </Box>
  ),
};

/**
 * Gallery — 여러 장이 같은 시각으로 묶이는 감각. toolbar 한 번 바꾸면 전부 동시 전환.
 */
export const Gallery = {
  render: () => (
    <Grid container spacing={ 2 }>
      { [
        { day: arcLampLiving, night: arcLampLivingNight, alt: 'Arc lamp' },
        { day: archLightGallery, night: archLightGalleryNight, alt: 'Arch gallery' },
        { day: columnLampStudio, night: columnLampStudioNight, alt: 'Column studio' },
      ].map((item, i) => (
        <Grid key={ i } size={ { xs: 12, md: 4 } }>
          <TimeBlendImage
            dayImage={ item.day }
            nightImage={ item.night }
            alt={ item.alt }
            ratio="4/5"
          />
          <Typography variant="caption" sx={ { color: 'text.secondary', mt: 1, display: 'block' } }>
            { item.alt }
          </Typography>
        </Grid>
      )) }
    </Grid>
  ),
};
