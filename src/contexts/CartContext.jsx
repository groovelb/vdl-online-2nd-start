import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';

/**
 * Lumenstate Cart Context
 *
 * 제품 + 옵션 조합을 장바구니 아이템으로 관리한다. 상태는 `localStorage`에 저장되어
 * 재방문 시에도 유지된다(`02-ux-flow.md:222`의 "브라우저 영속" 원칙).
 *
 * 아이템 식별:
 * - 같은 productId라도 options 조합이 다르면 별개 라인 아이템으로 취급.
 * - `${ productId }::${ glassFinish }::${ hardware }::${ height }` 를 lineId로 사용.
 *
 * 제공 값:
 * - items: 현재 장바구니 아이템 배열
 * - totalCount: 총 수량
 * - add / remove / update / clear: 아이템 조작
 * - isOpen / open / close / toggle: Drawer 노출 상태
 */

const CartContext = createContext(null);

const STORAGE_KEY = 'lumenstate.cart.v1';

const makeLineId = (productId, options) => {
  const g = options?.glassFinish ?? '';
  const h = options?.hardware ?? '';
  const ht = options?.height ?? '';
  return `${ productId }::${ g }::${ h }::${ ht }`;
};

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* noop — 할당량 초과 등 무시 */
  }
};

/**
 * CartProvider 컴포넌트
 *
 * 앱 최상단에서 한 번 렌더. 내부에서 `localStorage`를 읽어 초기 상태 복원,
 * items 변경 시 자동 저장.
 *
 * Props:
 * @param {node} children [Required]
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStorage());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    writeStorage(items);
  }, [items]);

  /**
   * 아이템 추가. 동일 lineId 존재 시 수량 가산.
   * @param {object} line - { productId, title, image, options, quantity }
   */
  const add = useCallback((line) => {
    if (!line || typeof line.productId === 'undefined') return;
    const quantity = Math.max(1, Math.floor(line.quantity ?? 1));
    const lineId = makeLineId(line.productId, line.options);
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.lineId === lineId);
      if (idx >= 0) {
        const next = prev.slice();
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [ ...prev, { ...line, lineId, quantity } ];
    });
  }, []);

  /**
   * lineId로 아이템 제거.
   */
  const remove = useCallback((lineId) => {
    setItems((prev) => prev.filter((it) => it.lineId !== lineId));
  }, []);

  /**
   * lineId의 수량을 절대값으로 갱신. 0 이하면 제거.
   */
  const update = useCallback((lineId, quantity) => {
    const q = Math.floor(quantity);
    if (q <= 0) {
      setItems((prev) => prev.filter((it) => it.lineId !== lineId));
      return;
    }
    setItems((prev) => prev.map((it) => (it.lineId === lineId ? { ...it, quantity: q } : it)));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const totalCount = useMemo(() => items.reduce((sum, it) => sum + (it.quantity ?? 0), 0), [items]);

  const value = useMemo(() => ({
    items,
    totalCount,
    add,
    remove,
    update,
    clear,
    isOpen,
    open,
    close,
    toggle,
  }), [items, totalCount, add, remove, update, clear, isOpen, open, close, toggle]);

  return (
    <CartContext.Provider value={ value }>
      { children }
    </CartContext.Provider>
  );
}

/**
 * Provider 내부에서만 사용. 외부 호출 시 에러.
 */
export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === null) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}

/**
 * Provider 밖에서도 안전. 미존재 시 null.
 */
export function useCartSafe() {
  return useContext(CartContext);
}
