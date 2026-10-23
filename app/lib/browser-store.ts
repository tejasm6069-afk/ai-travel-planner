'use client';
import { useCallback, useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('roam-storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('roam-storage', callback);
  };
}
export function useBrowserStore(key: string) {
  const getSnapshot = useCallback(() => {
    try { return window.localStorage.getItem(key); } catch { return null; }
  }, [key]);
  const value = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const write = useCallback((data: unknown) => {
    window.localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('roam-storage'));
  }, [key]);
  return [value, write] as const;
}
const subscribeHydration = () => () => {};
export function useHydrated() { return useSyncExternalStore(subscribeHydration, () => true, () => false); }
