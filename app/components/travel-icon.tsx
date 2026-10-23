import type { CSSProperties } from 'react';

const paths = {
  compass: 'm16 8-3 5-5 3 3-5 5-3Z M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  sparkles: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z M20 2v4 M18 4h4',
  home: 'm3 10 9-7 9 7v10H3V10Z M9 20v-7h6v7',
  map: 'm3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z M9 3v15 M15 6v15',
  bag: 'M5 7h14v14H5V7Z M9 7V3h6v4 M9 11v6 M15 11v6',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  arrow: 'M4 12h16 m-6-6 6 6-6 6',
  chevron: 'm9 5 7 7-7 7',
  pin: 'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  calendar: 'M4 5h16v16H4V5Z M8 2v6 M16 2v6 M4 10h16',
  people: 'M16 21v-3a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v3 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z M17 3a4 4 0 0 1 0 8 M18 14a4 4 0 0 1 3 4v3',
  wallet: 'M21 8H4a2 2 0 0 1 0-4h14v4 M3 6v14h18V8 M21 12h-6v4h6',
  search: 'M20 20l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M3 12h18 M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z',
  leaf: 'M20 3C8 2 2 9 5 16s15 5 15-13Z M4 21 15 10',
  sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1 1 M18 18l1 1 M5 19l1-1 M18 6l1-1',
  mountain: 'm2 20 7-14 4 7 3-5 6 12H2Z M6 12l3 2 3-2',
  coffee: 'M4 8h12v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z M16 9h2a3 3 0 0 1 0 6h-2 M7 2v3 M12 2v3',
  building: 'M3 21h18 M5 21V8h14v13 M3 8l9-6 9 6H3Z M9 11v7 M15 11v7',
  check: 'm5 12 4 4L19 6',
  close: 'm6 6 12 12 M6 18 18 6',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  book: 'M12 5C7 2 3 3 3 3v17s4-1 9 2c5-3 9-2 9-2V3s-4-1-9 2Z M12 5v17',
  clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M12 7v5l3 2',
  download: 'M12 3v12 m-5-5 5 5 5-5 M4 16v5h16v-5',
  printer: 'M7 8V3h10v5 M7 17H3V8h18v9h-4 M7 14h10v7H7V14Z',
  trash: 'M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7',
  plus: 'M12 5v14 M5 12h14',
  shuffle: 'M3 7h3l12 10h3 m-4-4 4 4-4 4 M3 17h3l4-4 M14 9l4-2h3 m-4-4 4 4-4 4',
  info: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M12 11v6 M12 7v1',
} as const;
export type IconName = keyof typeof paths;
export default function Icon({ name, size = 20, className = '', style }: { name: IconName; size?: number; className?: string; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}><path d={paths[name]} /></svg>;
}

