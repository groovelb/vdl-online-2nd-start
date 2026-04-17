import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

/**
 * CategoryTab 컴포넌트
 *
 * 카테고리 필터링을 위한 탭 메뉴. horizontal / vertical 두 방향을 지원한다.
 *
 * Props:
 * @param {Array} categories - 카테고리 목록 [{ id, label }] [Required]
 * @param {string} selected - 현재 선택된 카테고리 ID [Required]
 * @param {function} onChange - 변경 핸들러 (id) => void [Required]
 * @param {string} orientation - 방향 ('horizontal' | 'vertical') [Optional, 기본값: 'horizontal']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <CategoryTab
 *   orientation="vertical"
 *   categories={ [{ id: 'all', label: 'All' }, { id: 'ceiling', label: 'Ceiling' }] }
 *   selected={ selected }
 *   onChange={ setSelected }
 * />
 */
export function CategoryTab({ categories = [], selected, onChange, orientation = 'horizontal', sx }) {
  const isVertical = orientation === 'vertical';

  return (
    <Box
      sx={ {
        ...(isVertical
          ? null
          : { borderBottom: 1, borderColor: 'divider', mb: 3 }
        ),
        ...sx,
      } }
    >
      <Tabs
        orientation={ orientation }
        value={ selected }
        onChange={ (e, newValue) => onChange(newValue) }
        variant={ isVertical ? 'standard' : 'scrollable' }
        scrollButtons={ isVertical ? false : 'auto' }
        aria-label="category tabs"
        sx={ {
          ...(isVertical && {
            minHeight: 0,
            '& .MuiTabs-indicator': {
              left: 0,
              right: 'auto',
              width: 6,
              backgroundColor: 'transparent',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: '50%',
                marginTop: '-3px',
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
              },
            },
          }),
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 'auto',
            ...(isVertical
              ? {
                alignItems: 'flex-start',
                textAlign: 'left',
                position: 'relative',
                minHeight: 28,
                py: 0.25,
                pl: 2.25,
                pr: 1,
                fontSize: 13,
              }
              : { mr: 2 }
            ),
          },
        } }
      >
        { categories.map((cat) => (
          <Tab key={ cat.id } label={ cat.label } value={ cat.id } />
        )) }
      </Tabs>
    </Box>
  );
}
