'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { interests, plannerSchema, tripSchema, type PlannerInput, type TripData } from '@/app/lib/trip-schema';
import { sampleTrip } from '@/app/lib/sample-trip';
import { destinations } from '@/app/lib/destinations';
import Icon from './travel-icon';
import Itinerary from './itinerary';
import { SignInPrompt } from './account';
import { useHydrated } from '@/app/lib/browser-store';

type PlannerProps = { initialDestination: string; initialDays: number; initialTravelers: number };
export default function Planner(props: PlannerProps) {
  const hydrated = useHydrated();
  if (!hydrated) return <div className="loading-state" role="status"><div className="loading-orbit" /><p>Getting your planner ready…</p></div>;
  return <PlannerForm key={props.initialDestination + props.initialDays + props.initialTravelers} {...props} />;
}
function PlannerForm({ initialDestination, initialDays, initialTravelers }: PlannerProps) {
  const [draft] = useState(() => {
    if (initialDestination) return null;
    try { return JSON.parse(sessionStorage.getItem('roam-planner-draft') || 'null'); } catch { return null; }
  });
  const [form, setForm] = useState<PlannerInput>(() => {
    const restored = plannerSchema.safeParse(draft?.form);
    return restored.success ? restored.data : { destination: initialDestination, days: initialDays, travelers: initialTravelers, budget: 'Moderate', pace: 'Balanced', interests: ['Culture', 'Food & drink'], startDate: '', notes: '' };
  });
  const [trip, setTrip] = useState<TripData | null>(() => {
    const restored = tripSchema.safeParse(draft?.trip);
    return restored.success ? restored.data : null;
  });
  const [isSample, setIsSample] = useState(Boolean(draft?.isSample));
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [needsAuth, setNeedsAuth] = useState(false);
  const [savedId, setSavedId] = useState('');
  const [saving, setSaving] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => setProgress(p => Math.min(p + 1, 3)), 5500);
    return () => clearInterval(timer);
  }, [loading]);
  function update<K extends keyof PlannerInput>(key: K, value: PlannerInput[K]) { setForm(current => ({ ...current, [key]: value })); }
  function remember(data: TripData | null, sample = false) { try { sessionStorage.setItem('roam-planner-draft', JSON.stringify({ form, trip: data, isSample: sample })); } catch { /* Browsing remains available without storage. */ } }
  async function generate(event: React.FormEvent) {
    event.preventDefault();
    setError(''); setNeedsAuth(false); setLoading(true); setProgress(0);
    remember(trip, isSample);
    const parsed = plannerSchema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0].message); setLoading(false); return; }
    try {
      const response = await fetch('/api/generate-trip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data), signal: AbortSignal.timeout(58_000) });
      const result = await response.json();
      if (!response.ok || !result.success) { setNeedsAuth(response.status === 401); throw new Error(result.error || 'We couldn’t create this trip. Please try again.'); }
      const validated = tripSchema.parse(result.data);
      setTrip(validated); setIsSample(false); setSavedId(''); remember(validated);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (failure) { setError(failure instanceof Error && failure.name !== 'TimeoutError' ? failure.message : 'Planning took longer than expected. Please try again.'); }
    finally { setLoading(false); }
  }
  async function save() {
    if (!trip || saving || savedId) return;
    setSaving(true); setError(''); setNeedsAuth(false); remember(trip, isSample);
    try {
      const response = await fetch('/api/save-trip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(trip) });
      const result = await response.json();
      if (!response.ok || !result.success) { setNeedsAuth(response.status === 401); throw new Error(result.error || 'Your trip couldn’t be saved.'); }
      setSavedId(result.data.id);
      try {
        const tools = localStorage.getItem('roam-trip-tools-draft-' + trip.destination);
        if (tools) localStorage.setItem('roam-trip-tools-' + result.data.id, tools);
      } catch { /* The trip is saved even if local tools cannot be copied. */ }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Your trip couldn’t be saved. Please retry.'); }
    finally { setSaving(false); }
  }
  return <>
    <div className="page-heading"><div><p className="eyebrow">A GREAT TRIP STARTS WITH YOU</p><h1>Let’s turn someday into a plan<span className="green">.</span></h1><p className="heading-description">Tell us what you love. We’ll connect the dots.</p></div><span className="pill"><Icon name="sparkles" size={14} /> Your personal AI planner</span></div>
    <div className="planner-layout"><form className="planner-form panel" onSubmit={generate}><div className="form-section-title"><span>01</span><h2>First, the possibilities.</h2></div>
      <label className="field-label" htmlFor="destination">Where would you like to go?</label><div className="input-with-icon"><Icon name="pin" /><input id="destination" placeholder="Kyoto, Japan" required minLength={2} maxLength={100} value={form.destination} onChange={e => update('destination', e.target.value)} /></div>
      <button className="surprise-button" type="button" onClick={() => { const place = destinations[Math.floor(Math.random() * destinations.length)]; update('destination', place.name + ', ' + place.country); }}><Icon name="shuffle" size={15} /> Surprise me with somewhere</button>
      <div className="field-grid three"><label className="field-label">Trip length<select value={form.days} onChange={e => update('days', Number(e.target.value))}>{Array.from({ length: 10 }, (_, i) => <option value={i + 1} key={i}>{i + 1} {i === 0 ? 'day' : 'days'}</option>)}</select></label><label className="field-label">Travelers<select value={form.travelers} onChange={e => update('travelers', Number(e.target.value))}>{Array.from({ length: 12 }, (_, i) => <option value={i + 1} key={i}>{i + 1} {i === 0 ? 'person' : 'people'}</option>)}</select></label><label className="field-label">Start date <span className="optional">optional</span><input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} /></label></div>
      <div className="form-section-title"><span>02</span><h2>Make it your kind of trip.</h2></div><fieldset><legend className="field-label">Your travel budget</legend><div className="choice-grid">{([{ value: 'Backpacker', name: 'Keep it simple', symbol: '$', text: 'More memories, less spend' }, { value: 'Moderate', name: 'A happy balance', symbol: '$$', text: 'Comfort with a little extra' }, { value: 'Luxury', name: 'Treat yourself', symbol: '$$$', text: 'Make every moment special' }] as const).map(item => <button type="button" aria-pressed={form.budget === item.value} className={'choice-card ' + (form.budget === item.value ? 'selected' : '')} key={item.value} onClick={() => update('budget', item.value)}><span>{item.symbol}</span><strong>{item.name}</strong><small>{item.text}</small></button>)}</div></fieldset>
      <fieldset><legend className="field-label">What draws you in?</legend><div className="interest-pills">{interests.map(interest => <button type="button" aria-pressed={form.interests.includes(interest)} className={'filter-pill ' + (form.interests.includes(interest) ? 'active' : '')} key={interest} onClick={() => update('interests', form.interests.includes(interest) ? form.interests.filter(x => x !== interest) : [...form.interests, interest])}>{form.interests.includes(interest) && <Icon name="check" size={14} />}{interest}</button>)}</div></fieldset>
      <fieldset><legend className="field-label">Find your rhythm</legend><div className="pace-options">{(['Relaxed', 'Balanced', 'Packed'] as const).map((pace, index) => <button type="button" className={form.pace === pace ? 'selected' : ''} aria-pressed={form.pace === pace} key={pace} onClick={() => update('pace', pace)}>{['Take it slow', 'A bit of everything', 'See it all'][index]}<small>{pace}</small></button>)}</div></fieldset>
      <label className="field-label" htmlFor="notes">Anything else we should know? <span className="optional">optional</span></label><textarea id="notes" placeholder="Vegetarian food, step-free routes, traveling with little ones…" maxLength={600} rows={3} value={form.notes} onChange={e => update('notes', e.target.value)} />
      <button className="button primary generate-button" disabled={loading} type="submit"><Icon name="sparkles" size={19} />{loading ? ['Finding your kind of places…', 'Connecting the dots…', 'Making room for the good stuff…', 'Adding the finishing touches…'][progress] : 'Create my adventure'}{!loading && <Icon name="arrow" size={19} />}</button><p className="form-footnote">Sign in to generate and save your personalized itinerary.</p>
    </form><aside className="planner-aside"><div className="planner-inspiration"><Image src="/images/kyoto.jpg" alt="Traditional streets and a pagoda in Kyoto" fill sizes="(max-width: 1000px) 100vw, 28vw" /><div><span className="hero-pill">GO WITH CURIOSITY</span><h2>The best plans<br />leave room<br />for wonder.</h2></div></div><div className="planner-promise"><Icon name="compass" size={27} /><h3>A plan, with personality.</h3><p>Real places. A thoughtful pace. Time for the things that make a trip yours.</p><ul><li><Icon name="check" size={15} /> Day-by-day places to discover</li><li><Icon name="check" size={15} /> Easy links to Google Maps</li><li><Icon name="check" size={15} /> Packing list & budget calculator</li></ul><button className="text-link" type="button" disabled={loading} onClick={() => { setTrip(sampleTrip); setIsSample(true); setSavedId(''); setError(''); setNeedsAuth(false); remember(sampleTrip, true); setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Try a sample Kyoto itinerary <Icon name="arrow" size={16} /></button></div></aside></div>
    {error && <div className="feedback error-feedback" role="alert"><Icon name="info" /><div><p>{error}</p>{needsAuth && <SignInPrompt>Sign in to continue</SignInPrompt>}</div></div>}
    {trip && <div ref={resultRef} className="trip-result"><div className="result-heading"><div><p className="eyebrow">{isSample ? 'SAMPLE ITINERARY · NOT AI GENERATED' : 'YOUR ADVENTURE, ALL TOGETHER'}</p><h2>A plan worth looking forward to.</h2></div>{savedId ? <Link href={'/trips/' + savedId} className="button primary"><Icon name="check" size={17} /> Saved · View trip</Link> : <button className="button primary" disabled={saving} onClick={save}><Icon name="bag" size={17} />{saving ? 'Saving…' : 'Save to my trips'}</button>}</div><Itinerary key={trip.destination + JSON.stringify(trip.itinerary)} trip={trip} storageId={savedId || 'draft-' + trip.destination} /></div>}
  </>;
}



