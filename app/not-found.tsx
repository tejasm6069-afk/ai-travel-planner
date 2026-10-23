import Link from 'next/link';
import Icon from './components/travel-icon';
export default function NotFound() { return <div className="empty-state"><Icon name="compass" size={48} /><p className="eyebrow">OFF THE BEATEN PATH · 404</p><h1>This place isn’t on the map.</h1><p>The page may have moved, or this trip isn’t in your account.</p><Link href="/" className="button primary">Back to discover <Icon name="arrow" size={18} /></Link></div>; }


