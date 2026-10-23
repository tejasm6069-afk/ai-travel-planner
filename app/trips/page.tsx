import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { prisma } from '@/app/lib/prisma';
import TripLibrary from '../components/trip-library';
import { SignInPrompt } from '../components/account';
import Icon from '../components/travel-icon';

export const metadata = { title: 'Your adventures | roam.' };
export const dynamic = 'force-dynamic';
export default async function TripsDashboard() {
  const { userId } = process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? await auth() : { userId: null };
  if (!userId) return <div className="empty-state account-empty"><Icon name="bag" size={45} /><p className="eyebrow">A HOME FOR YOUR ADVENTURES</p><h1>Good plans are worth keeping.</h1><p>Sign in to save your itineraries and pick up where you left off.</p><SignInPrompt>Sign in to see my trips</SignInPrompt><Link className="text-link" href="/planner">Explore the planner <Icon name="arrow" size={17} /></Link></div>;
  let trips;
  try { trips = await prisma.trip.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 100, select: { id: true, destination: true, days: true, budget: true, createdAt: true } }); }
  catch { return <div className="empty-state"><Icon name="info" size={38} /><h1>Your trips are taking a little longer.</h1><p>We couldn’t connect to your trip library. Please try again shortly.</p><Link className="button primary" href="/trips">Try again</Link></div>; }
  return <><div className="page-heading"><div><p className="eyebrow">ALL YOUR POSSIBILITIES, IN ONE PLACE</p><h1>Your next great stories<span className="green">.</span></h1><p className="heading-description">Saved plans. Open possibilities. Where will you go next?</p></div><Link className="button primary" href="/planner"><Icon name="plus" size={17} /> New adventure</Link></div><TripLibrary trips={trips.map(trip => ({ ...trip, createdAt: trip.createdAt.toISOString() }))} />{trips.length === 100 && <p className="fine-print">Showing your 100 most recent trips.</p>}</>;
}


