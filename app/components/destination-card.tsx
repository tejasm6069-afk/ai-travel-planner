'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { Destination } from '@/app/lib/destinations';
import Icon from './travel-icon';
import { useTravel } from './travel-context';

export default function DestinationCard({ destination }: { destination: Destination }) {
  const { favorites, toggleFavorite } = useTravel();
  const saved = favorites.includes(destination.id);
  return <article className="destination-card"><div className="destination-photo"><Image src={destination.image} alt={destination.name + ', ' + destination.country} fill sizes="(max-width: 600px) 90vw, (max-width: 1100px) 45vw, 25vw" /><span className="photo-tag">{destination.category}</span><button className={'favorite-button ' + (saved ? 'saved' : '')} aria-label={(saved ? 'Remove ' : 'Save ') + destination.name + (saved ? ' from wishlist' : ' to wishlist')} aria-pressed={saved} onClick={() => toggleFavorite(destination.id)}><Icon name="heart" size={18} /></button><span className="photo-caption">{destination.label}</span></div><div className="destination-info"><div><h3><Link href={'/planner?destination=' + encodeURIComponent(destination.name + ', ' + destination.country) + '&days=' + destination.days}>{destination.name}</Link></h3><p><Icon name="pin" size={13} />{destination.country}</p></div><Link className="round-link" aria-label={'Plan a trip to ' + destination.name} href={'/planner?destination=' + encodeURIComponent(destination.name + ', ' + destination.country) + '&days=' + destination.days}><Icon name="arrow" size={18} /></Link></div><div className="destination-meta"><span><Icon name="calendar" size={14} />{destination.days}-day trip idea</span><span>{destination.region}</span></div></article>;
}


