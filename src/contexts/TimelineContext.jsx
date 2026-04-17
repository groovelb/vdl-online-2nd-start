import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { TIME_SLOTS } from '../data/timeSlots';

/**
 * Lumenstate Timeline Context
 *
 * 사이트 전체가 공유하는 "시간" 상태. 4개 TIME_SLOTS 중 하나를 선택하면
 * 전역에서 같은 시각을 구독할 수 있다.
 *
 * 경험적 원칙:
 * - 타임라인은 휘발 (`02-ux-flow.md:96-98`) — 영속 저장 없음
 * - 첫 진입은 항상 기본 슬롯(noon)에서 시작
 *
 * 제공 값:
 * - slotId: 현재 슬롯 id ('noon' | 'afternoon' | 'evening' | 'midnight')
 * - slot: 현재 슬롯 객체 (id, hour, label, timeValue, theme)
 * - timeValue: 0~1 블렌드 값
 * - theme: 'light' | 'dark' (MUI 테마 선택용)
 * - setSlot: 슬롯 id로 전환하는 함수
 */

const TimelineContext = createContext(null);

const DEFAULT_SLOT_ID = TIME_SLOTS[0].id;

const findSlot = (id) => TIME_SLOTS.find((s) => s.id === id) ?? TIME_SLOTS[0];

/**
 * TimelineProvider 컴포넌트
 *
 * 앱 최상단(또는 스토리북 decorator 최상단)에서 한 번만 렌더한다.
 * 하위에서 useTimeline() / useTimelineSafe()로 상태 구독.
 *
 * Props:
 * @param {string} defaultSlotId - 초기 슬롯 id [Optional, 기본값: TIME_SLOTS[0].id]
 * @param {string} slotId - 외부에서 제어 (controlled). 지정 시 내부 state를 덮어씀 [Optional]
 * @param {function} onChange - 슬롯 변경 시 호출. (slotId) => void [Optional]
 * @param {node} children [Required]
 *
 * Example usage:
 * <TimelineProvider>
 *   <App />
 * </TimelineProvider>
 */
export function TimelineProvider({
  defaultSlotId = DEFAULT_SLOT_ID,
  slotId: controlledSlotId,
  onChange,
  children,
}) {
  const [internalSlotId, setInternalSlotId] = useState(defaultSlotId);
  const activeSlotId = controlledSlotId ?? internalSlotId;

  const setSlot = useCallback((nextId) => {
    if (controlledSlotId === undefined) {
      setInternalSlotId(nextId);
    }
    onChange?.(nextId);
  }, [controlledSlotId, onChange]);

  const value = useMemo(() => {
    const slot = findSlot(activeSlotId);
    return {
      slotId: slot.id,
      slot,
      timeValue: slot.timeValue,
      theme: slot.theme,
      setSlot,
    };
  }, [activeSlotId, setSlot]);

  return (
    <TimelineContext.Provider value={ value }>
      { children }
    </TimelineContext.Provider>
  );
}

/**
 * Provider 내부에서만 사용. 외부에서 호출하면 에러를 던진다.
 * @returns {{slotId, slot, timeValue, theme, setSlot}}
 */
export function useTimeline() {
  const ctx = useContext(TimelineContext);
  if (ctx === null) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return ctx;
}

/**
 * Provider 바깥에서도 안전하게 동작. 미존재 시 null 반환.
 * 컴포넌트가 prop 우선, context fallback 패턴을 쓸 때 사용.
 * @returns {{slotId, slot, timeValue, theme, setSlot}|null}
 */
export function useTimelineSafe() {
  return useContext(TimelineContext);
}
