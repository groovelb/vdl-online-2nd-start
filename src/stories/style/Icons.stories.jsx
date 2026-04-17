import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
  Sun,
  SunDim,
  Sunset,
  MoonStar,
  Moon,
  Heart,
  Bookmark,
  Star,
  ThumbsUp,
  CheckCircle,
  Eye,
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Home,
  User,
  Settings,
  Plus,
  Minus,
} from 'lucide-react';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
} from '../../components/storybookDocumentation';

/**
 * 디자인 시스템 기본 아이콘 세트.
 * Lumenstate는 lucide-react를 기본 아이콘노그래피로 채택. 1px stroke가 기본값이며,
 * 모든 아이콘은 hairline 느낌의 절제된 라인으로 렌더된다. 필요 시 활성 상태 등에서
 * strokeWidth를 살짝 올려(예: 1.25~1.5) 강조할 수 있다.
 */

/**
 * Lucide 아이콘 공용 기본값. 디자인 시스템의 단일 진실 소스로 이 상수들을 참조할 것.
 */
const DEFAULT_STROKE = 1;
const DEFAULT_SIZE = 24;

/**
 * 데모용 시간대 아이콘 세트 — FloatingTimelineControl이 사용하는 동일 매핑.
 */
const TIMELINE_ICONS = [
  { Icon: Sun,      name: 'Sun',      label: '점심 12:00' },
  { Icon: SunDim,   name: 'SunDim',   label: '오후 16:00' },
  { Icon: Sunset,   name: 'Sunset',   label: '저녁 20:00' },
  { Icon: MoonStar, name: 'MoonStar', label: '밤 24:00' },
];

/**
 * 인터랙션·네비게이션에 자주 쓰이는 표준 아이콘 갤러리.
 */
const STANDARD_ICONS = [
  { Icon: Heart,        name: 'Heart' },
  { Icon: Bookmark,     name: 'Bookmark' },
  { Icon: Star,         name: 'Star' },
  { Icon: ThumbsUp,     name: 'ThumbsUp' },
  { Icon: CheckCircle,  name: 'CheckCircle' },
  { Icon: Eye,          name: 'Eye' },
  { Icon: Search,       name: 'Search' },
  { Icon: ShoppingBag,  name: 'ShoppingBag' },
  { Icon: Menu,         name: 'Menu' },
  { Icon: X,            name: 'X' },
  { Icon: ChevronLeft,  name: 'ChevronLeft' },
  { Icon: ChevronRight, name: 'ChevronRight' },
  { Icon: ArrowLeft,    name: 'ArrowLeft' },
  { Icon: ArrowRight,   name: 'ArrowRight' },
  { Icon: Home,         name: 'Home' },
  { Icon: User,         name: 'User' },
  { Icon: Settings,     name: 'Settings' },
  { Icon: Plus,         name: 'Plus' },
  { Icon: Minus,        name: 'Minus' },
  { Icon: Moon,         name: 'Moon' },
];

/**
 * Playground 컴포넌트 — Controls 탭에서 강도/크기를 조절할 수 있도록 래핑.
 */
const IconPlayground = ({
  strokeWidth = DEFAULT_STROKE,
  size = 48,
  color = 'currentColor',
}) => (
  <Box sx={ { display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' } }>
    { TIMELINE_ICONS.map(({ Icon, name, label }) => (
      <Box key={ name } sx={ { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 } }>
        <Icon size={ size } strokeWidth={ strokeWidth } color={ color } />
        <Typography variant="caption" sx={ { color: 'text.secondary', fontFamily: 'monospace' } }>
          { name }
        </Typography>
        <Typography variant="caption" sx={ { color: 'text.secondary' } }>
          { label }
        </Typography>
      </Box>
    )) }
  </Box>
);

export default {
  title: 'Style/Icons',
  component: IconPlayground,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Icons — lucide-react

Lumenstate 디자인 시스템의 **기본 아이콘노그래피**는 [lucide-react](https://lucide.dev/)이다.

### 기본 속성
- **strokeWidth: 1** — hairline feel. 브랜드의 Immanence·절제 톤과 일치.
- **size: 24** — 기본 크기. 슬롯/컨텍스트에 따라 16·20·28 등으로 조정.
- **color: currentColor** — 부모 \`color\`를 상속. \`theme.palette\` 토큰과 함께 쓰기 좋다.

### 활성/강조
선택 상태나 강조가 필요할 때 **strokeWidth를 1.25~1.5**로 살짝 올리는 것으로 해결.
Fill은 사용하지 않는다 (Lumenstate는 선형 아이콘을 기본으로 한다).

### 사용 예
\`\`\`jsx
import { Sun } from 'lucide-react';
<Sun size={ 20 } strokeWidth={ 1 } />
// 활성 상태
<Sun size={ 20 } strokeWidth={ 1.5 } />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    strokeWidth: {
      control: { type: 'number', min: 0.5, max: 2.5, step: 0.25 },
      description: 'Stroke width (기본 1 = hairline)',
      table: { defaultValue: { summary: DEFAULT_STROKE } },
    },
    size: {
      control: { type: 'range', min: 16, max: 96, step: 4 },
      description: '아이콘 크기 (px)',
    },
    color: {
      control: 'color',
      description: '아이콘 색상 (기본 currentColor)',
    },
  },
};

/**
 * Default — Controls 탭에서 strokeWidth / size / color를 실시간 조절.
 */
export const Default = {
  args: {
    strokeWidth: DEFAULT_STROKE,
    size: 48,
    color: 'currentColor',
  },
};

/**
 * Stroke Scale — 1px 기본 대비 강조 두께 비교.
 */
export const StrokeScale = {
  parameters: { layout: 'padded' },
  render: () => {
    const scales = [
      { value: 0.75, label: 'hairline+' },
      { value: 1, label: '기본 (1px)' },
      { value: 1.25, label: 'active' },
      { value: 1.5, label: 'strong' },
      { value: 2, label: 'xl' },
    ];

    return (
      <>
        <DocumentTitle
          title="Stroke Scale"
          status="Available"
          note="Default 1px hairline and accent thicknesses"
          brandName="Design System"
          systemName="Starter Kit"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Stroke Scale
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
            기본 1px를 중심으로 한 강조 두께 비교. 활성 상태는 1.25~1.5 권장.
          </Typography>

          <SectionTitle title="두께별 렌더링" description="같은 아이콘, 다른 strokeWidth" />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: '20%' } }>Stroke Width</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: '20%' } }>Label</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Preview</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { scales.map((s) => (
                  <TableRow key={ s.value }>
                    <TableCell sx={ { fontFamily: 'monospace' } }>{ s.value }</TableCell>
                    <TableCell>{ s.label }</TableCell>
                    <TableCell>
                      <Box sx={ { display: 'flex', gap: 2 } }>
                        <Sun size={ 28 } strokeWidth={ s.value } />
                        <Sunset size={ 28 } strokeWidth={ s.value } />
                        <MoonStar size={ 28 } strokeWidth={ s.value } />
                      </Box>
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle title="사용 예시" description="MUI sx prop과 함께" />
          <Box
            component="pre"
            sx={ { backgroundColor: 'grey.100', p: 2, fontSize: 12, fontFamily: 'monospace', overflow: 'auto' } }
          >
{`import { Sun } from 'lucide-react';

// 기본 hairline
<Sun size={ 20 } strokeWidth={ 1 } />

// 활성 상태 강조
<Sun size={ 20 } strokeWidth={ 1.5 } color={ theme.palette.text.primary } />`}
          </Box>
        </PageContainer>
      </>
    );
  },
};

/**
 * Gallery — 자주 쓰는 표준 아이콘 갤러리. 모두 strokeWidth=1 기본.
 */
export const Gallery = {
  parameters: { layout: 'padded' },
  render: () => (
    <>
      <DocumentTitle
        title="Icon Gallery"
        status="Available"
        note="Common icons at the default 1px stroke"
        brandName="Design System"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Gallery
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          인터랙션·네비게이션에 자주 쓰는 lucide-react 아이콘 세트. 1px stroke 기본.
        </Typography>

        <Box
          sx={ {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 2,
          } }
        >
          { STANDARD_ICONS.map(({ Icon, name }) => (
            <Box
              key={ name }
              sx={ {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
              } }
            >
              <Icon size={ DEFAULT_SIZE } strokeWidth={ DEFAULT_STROKE } />
              <Typography variant="caption" sx={ { fontFamily: 'monospace', color: 'text.secondary' } }>
                { name }
              </Typography>
            </Box>
          )) }
        </Box>
      </PageContainer>
    </>
  ),
};
