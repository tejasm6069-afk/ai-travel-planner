'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Icon, { type IconName } from './travel-icon';
import Account from './account';
import { TravelProvider, useTravel } from './travel-context';

const navigation: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: 'Discover', icon: 'compass' }, { href: '/planner', label: 'AI Trip Planner', icon: 'sparkles' },
  { href: '/explore', label: 'Explore destinations', icon: 'globe' }, { href: '/trips', label: 'My trips', icon: 'bag' },
  { href: '/wishlist', label: 'Wishlist', icon: 'heart' },
];
function Navigation({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const { favorites } = useTravel();
  return <nav className="main-nav" aria-label="Main navigation">{navigation.map(item => <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={(item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)) ? 'page' : undefined}><Icon name={item.icon} size={19} /><span>{item.label}</span>{item.href === '/planner' && <span className="nav-ai">AI</span>}{item.href === '/wishlist' && favorites.length > 0 && <span className="nav-count">{favorites.length}</span>}</Link>)}</nav>;
}
function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const title = navigation.find(item => item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))?.label ?? 'Travel notes';
  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    {open && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <aside className={'sidebar ' + (open ? 'is-open' : '')}>
      <Link href="/" className="brand" onClick={() => setOpen(false)}><span className="brand-symbol"><Icon name="compass" size={26} /></span>roam<span className="brand-dot">.</span></Link>
      <div className="sidebar-label">A WORLD OF POSSIBILITIES</div>
      <Navigation onNavigate={() => setOpen(false)} />
      <div className="sidebar-bottom"><div className="sidebar-note"><span className="note-icon"><Icon name="sparkles" size={22} /></span><h3>A little less planning.<br />A lot more living.</h3><p>Your next great story starts with a place.</p><Link href="/planner" onClick={() => setOpen(false)}>Let’s make a plan <Icon name="arrow" size={16} /></Link></div><Link className="guide-link" href="/guide" onClick={() => setOpen(false)}><Icon name="book" size={18} /> The travel notebook <Icon name="chevron" size={14} /></Link><p className="sidebar-footer">Made for the way you wander.</p></div>
    </aside>
    <div className="main-wrap"><header className="topbar"><div className="topbar-title"><button className="icon-button mobile-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button><span>{title}</span></div><div className="topbar-actions"><span className="topbar-tag"><span /> Less planning. More possibilities.</span><Account /></div></header><main id="main-content" className="page-content">{children}</main><footer className="site-footer"><span><strong>roam.</strong> Go somewhere that stays with you.</span><Link href="/guide">A few things to know <Icon name="arrow" size={14} /></Link></footer></div>
  </div>;
}
export default function Shell({ children }: { children: React.ReactNode }) { return <TravelProvider><ShellContent>{children}</ShellContent></TravelProvider>; }


