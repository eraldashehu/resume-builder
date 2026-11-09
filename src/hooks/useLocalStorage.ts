import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/** useState that is saved to localStorage, so data survives a page reload. */
export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be full or blocked (private mode). The app still works without it.
    }
  }, [key, value]);

  return [value, setValue];
}
