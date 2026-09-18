import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const STORAGE_KEY = 'syrnaya-palitra:cart:v1';

/** Ключ позиции: тот же сыр с другой фасовкой — отдельная строка. */
export const itemKey = (id, pack) => `${id}::${pack}`;

function saveStorage(nextItems) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  } catch (e) {
    console.error('Failed to save cart to localStorage:', e);
  }
}

function readStorage() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((it) => ({
        id: it?.id,
        pack: Number(it?.pack),
        qty: Number(it?.qty),
      }))
      .filter((it) => it.id !== undefined && it.id !== null && it.pack > 0 && it.qty > 0);
  } catch (e) {
    console.error('Failed to read cart from localStorage:', e);
    return [];
  }
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStorage);

  useEffect(() => {
    saveStorage(items);
  }, [items]);

  const add = useCallback((id, pack = 100, maxStock = Infinity) => {
    const normalizedPack = Number(pack) || 100;
    setItems((prev) => {
      const already = prev
        .filter((it) => String(it.id) === String(id))
        .reduce((sum, it) => sum + it.qty, 0);
      if (already >= maxStock) return prev;

      const key = itemKey(id, normalizedPack);
      const found = prev.find((it) => itemKey(it.id, it.pack) === key);
      const next = found
        ? prev.map((it) => (itemKey(it.id, it.pack) === key ? { ...it, qty: it.qty + 1 } : it))
        : [...prev, { id, pack: normalizedPack, qty: 1 }];
      saveStorage(next);
      return next;
    });
  }, []);

  const inc = useCallback((id, pack, maxStock = Infinity) => {
    const key = itemKey(id, pack);
    setItems((prev) => {
      const already = prev
        .filter((it) => String(it.id) === String(id))
        .reduce((sum, it) => sum + it.qty, 0);
      if (already >= maxStock) return prev;

      const next = prev.map((it) => (itemKey(it.id, it.pack) === key ? { ...it, qty: it.qty + 1 } : it));
      saveStorage(next);
      return next;
    });
  }, []);

  /** qty === 1 → no-op: удаление только крестиком. */
  const dec = useCallback((id, pack) => {
    const key = itemKey(id, pack);
    setItems((prev) => {
      const next = prev.map((it) => (itemKey(it.id, it.pack) === key && it.qty > 1 ? { ...it, qty: it.qty - 1 } : it));
      saveStorage(next);
      return next;
    });
  }, []);

  const remove = useCallback((id, pack) => {
    const key = itemKey(id, pack);
    setItems((prev) => {
      const next = prev.filter((it) => itemKey(it.id, it.pack) !== key);
      saveStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    saveStorage([]);
  }, []);

  const totalQty = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, totalQty, add, inc, dec, remove, clear }),
    [items, totalQty, add, inc, dec, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};