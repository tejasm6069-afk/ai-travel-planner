'use client';
import { useState } from 'react';
import { useBrowserStore } from '@/app/lib/browser-store';
import type { TripData } from '@/app/lib/trip-schema';
import Icon from './travel-icon';
import { useTravel } from './travel-context';

const packing = ['Travel documents & ID', 'Tickets & reservations', 'Phone, charger & power bank', 'Comfortable walking shoes', 'Weather-appropriate layers', 'Personal medication & toiletries', 'Reusable water bottle', 'Payment cards & some local cash'];
export default function Itinerary({ trip, storageId }: { trip: TripData; storageId: string }) {
  const [day, setDay] = useState(0);
  const [view, setView] = useState('Itinerary');
  const [currency, setCurrency] = useState('USD');
  const [costs, setCosts] = useState({ stay: 80, meals: 30, activities: 25, transport: 10 });
  const { notify } = useTravel();
  const storageKey = 'roam-trip-tools-' + storageId;
  const [stored, writeStored] = useBrowserStore(storageKey);
  let packed: string[] = [];
  let notes = '';
  try {
    const saved = JSON.parse(stored || 'null');
    if (saved) {
      if (Array.isArray(saved.packed)) packed = saved.packed.filter((item: unknown): item is string => typeof item === 'string' && packing.includes(item));
      if (typeof saved.notes === 'string') notes = saved.notes;
    }
  } catch { /* Ignore damaged browser data. */ }
  function persist(nextPacked: string[], nextNotes: string) { try { writeStored({ packed: nextPacked, notes: nextNotes }); } catch { notify('Your browser couldn’t save these changes. Please allow browser storage.'); } }
  function download() {
    const content = [trip.destination, trip.days + ' days · ' + trip.travelers + ' traveler(s) · ' + trip.budget, trip.summary, ...trip.itinerary.flatMap(d => ['\nDAY ' + d.day + ' — ' + d.theme, ...d.activities.map(a => a.timeOfDay + ': ' + a.placeName + '\n' + a.description + '\n' + a.estimatedCost)]), '\nTRAVEL NOTES', ...trip.tips, notes].join('\n\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'roam-' + trip.destination.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.txt'; anchor.click(); URL.revokeObjectURL(url); notify('Your itinerary is ready to take with you.');
  }
  const selected = trip.itinerary[Math.min(day, trip.itinerary.length - 1)];
  const total = costs.stay * Math.max(0, trip.days - 1) + (costs.meals + costs.activities + costs.transport) * trip.days * trip.travelers;
  const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
  return <section className="itinerary panel">
    <div className="itinerary-header"><div><div className="trip-badges"><span className="pill">{trip.days} days</span><span className="pill">{trip.budget === 'Backpacker' ? 'Budget-friendly' : trip.budget + ' budget'}</span><span className="pill">{trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}</span>{trip.startDate && <span className="pill">{new Date(trip.startDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}</div><h2>{trip.destination}</h2><p>{trip.summary}</p></div><div className="itinerary-actions"><button className="icon-button" title="Download itinerary" aria-label="Download itinerary as text" onClick={download}><Icon name="download" /></button><button className="icon-button" title="Print or save PDF" aria-label="Print itinerary or save as PDF" onClick={() => window.print()}><Icon name="printer" /></button></div></div>
    <div className="itinerary-tabs" aria-label="Trip tools">{['Itinerary', 'Budget calculator', 'Packing & notes'].map(tab => <button key={tab} onClick={() => setView(tab)} aria-pressed={view === tab} className={view === tab ? 'active' : ''}>{tab}</button>)}</div>
    {view === 'Itinerary' && <div className="itinerary-body"><div className="day-selector" aria-label="Select itinerary day">{trip.itinerary.map((d, i) => <button key={d.day} onClick={() => setDay(i)} className={day === i ? 'active' : ''} aria-pressed={day === i}>Day {d.day}</button>)}</div><div className="day-heading"><div><span className="eyebrow">DAY {selected.day} · {trip.pace.toUpperCase()} PACE</span><h3>{selected.theme}</h3></div><a className="text-link" target="_blank" rel="noopener noreferrer" href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(trip.destination)}>Explore the area <Icon name="map" size={17} /></a></div><div className="timeline">{selected.activities.map((activity, index) => <article className="activity" key={index}><div className="activity-marker">{index + 1}</div><div className="activity-content"><div className="activity-time"><Icon name="clock" size={13} />{activity.timeOfDay}</div><h4>{activity.placeName}</h4><p>{activity.description}</p><div className="activity-footer"><span><Icon name="wallet" size={14} />{activity.estimatedCost}</span><a target="_blank" rel="noopener noreferrer" href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(activity.placeName + ', ' + trip.destination)}>View on map <Icon name="arrow" size={14} /></a></div></div></article>)}</div>{trip.tips.length > 0 && <div className="travel-tips"><h4><Icon name="leaf" size={19} /> A little local know-how</h4><ul>{trip.tips.map(tip => <li key={tip}>{tip}</li>)}</ul></div>}<p className="fine-print">An itinerary is a starting point. Confirm current prices, opening hours, accessibility, and availability before you go.</p></div>}
    {view === 'Budget calculator' && <div className="itinerary-body"><div className="day-heading"><div><span className="eyebrow">A LITTLE ROOM IN THE BUDGET</span><h3>Know what you’re planning for.</h3></div><label className="currency-label">Currency<select value={currency} onChange={e => setCurrency(e.target.value)}>{['USD', 'EUR', 'INR', 'GBP', 'JPY', 'IDR', 'CHF'].map(code => <option key={code}>{code}</option>)}</select></label></div><p className="muted">These are editable example amounts, not live destination prices. Enter your own estimates in the selected currency; changing currency does not convert amounts.</p><div className="budget-grid">{([{ key: 'stay', label: 'Accommodation', detail: 'Per night · shared by your group' }, { key: 'meals', label: 'Food & drink', detail: 'Per person, per day' }, { key: 'activities', label: 'Activities', detail: 'Per person, per day' }, { key: 'transport', label: 'Local transport', detail: 'Per person, per day' }] as const).map(item => <label className="budget-field" key={item.key}><strong>{item.label}</strong><small>{item.detail}</small><div><span>{currency}</span><input aria-label={item.label + ' cost'} type="number" min="0" max="10000000" value={costs[item.key]} onChange={e => setCosts({ ...costs, [item.key]: Math.min(10000000, Math.max(0, Number(e.target.value) || 0)) })} /></div></label>)}</div><div className="budget-total"><div><span>Estimated trip total</span><strong>{money(total)}</strong><small>{trip.travelers} traveler(s) · {trip.days} days · {Math.max(0, trip.days - 1)} nights</small></div><div><span>Per person</span><strong>{money(total / trip.travelers)}</strong></div></div><p className="fine-print">Flights, insurance, visas, shopping, and contingency are not included. Calculator amounts last for this visit.</p></div>}
    {view === 'Packing & notes' && <div className="itinerary-body tools-grid"><div><div className="day-heading"><div><span className="eyebrow">THE LITTLE ESSENTIALS</span><h3>Ready when you are.</h3></div><span className="pill">{packed.length}/{packing.length}</span></div><div className="packing-progress"><span style={{ width: (packed.length / packing.length * 100) + '%' }} /></div><div className="packing-list">{packing.map(item => <label key={item}><input type="checkbox" checked={packed.includes(item)} onChange={() => { const next = packed.includes(item) ? packed.filter(x => x !== item) : [...packed, item]; persist(next, notes); }} /><span>{item}</span></label>)}</div></div><div><label className="field-label" htmlFor="trip-notes">A place for your notes</label><textarea id="trip-notes" rows={10} maxLength={5000} placeholder="A café someone mentioned. A reservation to make. A little thing you don’t want to forget." value={notes} onChange={e => { persist(packed, e.target.value); }} /><p className="fine-print">Your checklist and notes stay in this browser. Notes are included in the text download.</p></div></div>}
    <div className="print-itinerary">{trip.itinerary.map(d => <section key={d.day}><h3>Day {d.day}: {d.theme}</h3>{d.activities.map((a, i) => <article key={i}><strong>{a.timeOfDay} · {a.placeName}</strong><p>{a.description}</p><small>{a.estimatedCost}</small></article>)}</section>)}{trip.tips.map(tip => <p key={tip}>{tip}</p>)}{notes && <p>Notes: {notes}</p>}</div>
  </section>;
}



