'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useBrowserStore } from '@/app/lib/browser-store';

const TravelContext = createContext<{ favorites: string[]; toggleFavorite: (id: string) => void; notify: (message: string) => void }>({ favorites: [], toggleFavorite: () => {}, notify: () => {} });
export function useTravel() { return useContext(TravelContext); }
export function TravelProvider({ children }: { children: ReactNode }) {
  const [storedFavorites, writeFavorites] = useBrowserStore('roam-favorites');
  let favorites: string[] = [];
  try {
    const stored: unknown = JSON.parse(storedFavorites || '[]');
    if (Array.isArray(stored)) favorites = stored.filter((item): item is string => typeof item === 'string');
  } catch { /* Ignore damaged browser data. */ }
  const [toast, setToast] = useState('');
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 4000); return () => clearTimeout(timer); } }, [toast]);
  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    try { writeFavorites(next); }
    catch { setToast('Your browser couldn’t save this wishlist. Please allow browser storage and try again.'); }
  }
  return <TravelContext.Provider value={{ favorites, toggleFavorite, notify: setToast }}>{children}<div className={'toast ' + (toast ? 'visible' : '')} role="status">{toast}</div></TravelContext.Provider>;
}

