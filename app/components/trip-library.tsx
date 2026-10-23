'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from './travel-icon';
import { destinationImage } from '@/app/lib/destinations';

export type SavedTrip = { id: string; destination: string; days: number; budget: string; createdAt: string };
export default function TripLibrary({ trips }: { trips: SavedTrip[] }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const filtered = trips.filter(trip => trip.destination.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sort === 'name' ? a.destination.localeCompare(b.destination) : sort === 'oldest' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt));
  return <><div className="library-stats"><div><Icon name="bag" /><strong>{trips.length}</strong><span>saved adventures</span></div><div><Icon name="globe" /><strong>{new Set(trips.map(t => t.destination.toLowerCase())).size}</strong><span>places to discover</span></div><div><Icon name="calendar" /><strong>{trips.reduce((sum, trip) => sum + trip.days, 0)}</strong><span>days of possibility</span></div></div><div className="library-toolbar"><label className="search-input"><Icon name="search" size={18} /><input placeholder="Find a saved adventure…" aria-label="Search saved trips" value={search} onChange={e => setSearch(e.target.value)} /></label><label className="sort-label">Sort by<select aria-label="Sort trips" value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Destination A–Z</option></select></label></div>{filtered.length ? <div className="saved-trip-grid">{filtered.map(trip => <article className="saved-trip-card" key={trip.id}><Link href={'/trips/' + trip.id} className="saved-trip-image"><Image src={destinationImage(trip.destination)} alt="" fill sizes="(max-width: 700px) 90vw, 30vw" /><span className="photo-tag">{trip.days} days · {trip.budget}</span></Link><div className="saved-trip-info"><span className="eyebrow">SAVED {new Date(trip.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</span><h2><Link href={'/trips/' + trip.id}>{trip.destination}</Link></h2><Link className="text-link" href={'/trips/' + trip.id}>Open your adventure <Icon name="arrow" size={17} /></Link></div></article>)}</div> : <div className="empty-state"><Icon name="bag" size={40} /><h2>{search ? 'No trips match that search.' : 'Your next chapter is a blank page.'}</h2><p>{search ? 'Try another destination name.' : 'Plan something wonderful and save it here to come back to.'}</p><Link className="button primary" href="/planner">Plan an adventure <Icon name="arrow" size={17} /></Link></div>}</>;
}


