import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/app/lib/prisma';
import { unpackTrip } from '@/app/lib/trip-schema';
import Itinerary from '@/app/components/itinerary';
import Icon from '@/app/components/travel-icon';
import { SignInPrompt } from '@/app/components/account';
import DeleteButton from './DeleteButton';

export const metadata = { title: 'Your trip | roam.', robots: { index: false, follow: false } };
export default async function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? await auth() : { userId: null };
  if (!userId) return <div className="empty-state"><Icon name="bag" size={40} /><h1>Your adventure is waiting.</h1><p>Sign in to open your saved trip.</p><SignInPrompt>Sign in</SignInPrompt></div>;
  const { id } = await params;
  const row = await prisma.trip.findFirst({ where: { id, userId } });
  if (!row) notFound();
  const trip = unpackTrip(row);
  if (!trip) return <div className="empty-state"><h1>This trip needs a fresh start.</h1><p>The saved itinerary has an older, unsupported format.</p><Link href="/planner" className="button primary">Create a new plan</Link></div>;
  return <><div className="detail-toolbar"><Link className="text-link" href="/trips"><Icon name="arrow" size={17} style={{ transform: 'rotate(180deg)' }} /> Back to my trips</Link><DeleteButton tripId={row.id} /></div><Itinerary trip={trip} storageId={row.id} /></>;
}


