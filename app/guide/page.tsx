import Link from 'next/link';
import Icon, { type IconName } from '../components/travel-icon';
export const metadata = { title: 'The travel notebook | roam.' };
const notes: { icon: IconName; title: string; description: string }[] = [
  { icon: 'compass', title: 'Start with how you want to feel.', description: 'Choose a slower pace for long lunches and wandering, or pack in more stops when discovery is the point. Leave a little breathing room either way.' },
  { icon: 'map', title: 'Keep your days close together.', description: 'Open each stop in Maps before you head out. Check the route, travel time, opening hours, and accessibility directly with the place you’re visiting.' },
  { icon: 'wallet', title: 'Build in a little breathing room.', description: 'Use the trip budget calculator with your own prices. Add flights, insurance, and a cushion for unexpected costs separately. Estimates aren’t booking quotes.' },
  { icon: 'bag', title: 'Pack for the days you’ll actually have.', description: 'Use your trip’s packing checklist, then tailor it to your plans. Check your airline’s baggage allowance and destination conditions before leaving.' },
  { icon: 'leaf', title: 'Be a good guest.', description: 'Follow local customs, ask before photographing people, respect restricted spaces, and support independent places when you can.' },
  { icon: 'download', title: 'Keep a copy close.', description: 'Download your itinerary as text or use Print to save it as a PDF. Your packing checklist and personal notes are stored only in the browser you’re using.' },
];
export default function Guide() {
  return <><div className="page-heading"><div><p className="eyebrow">THE TRAVEL NOTEBOOK</p><h1>A little prepared. A lot more present<span className="green">.</span></h1><p className="heading-description">A few small things that make room for a better adventure.</p></div></div><div className="guide-grid">{notes.map((note, i) => <article className="guide-card panel" key={note.title}><div className="guide-card-top"><Icon name={note.icon} size={26} /><span>0{i + 1}</span></div><h2>{note.title}</h2><p>{note.description}</p></article>)}</div><div className="guide-disclosure panel"><Icon name="info" size={24} /><div><h2>Thoughtful ideas. Human judgment.</h2><p>roam uses AI to suggest itineraries. It doesn’t make bookings or check live availability, prices, weather, visa rules, or safety conditions. Verify time-sensitive details with official sources before traveling.</p><p>Saved trips are private to your signed-in account. Destination wishlists, packing checklists, and personal notes stay in this browser. Your trip preferences are sent to the AI provider to create your itinerary; avoid including sensitive personal details.</p><Link href="/planner" className="text-link">Let’s plan something good <Icon name="arrow" size={17} /></Link></div></div></>;
}


