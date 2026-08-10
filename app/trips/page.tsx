import { Trip } from '@prisma/client';
import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';

// Notice there is NO 'use client' here. This is a Server Component!
export default async function TripsDashboard() {
  // Fetch all saved trips directly from your Supabase database, newest first
  const trips = await prisma.trip.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Dashboard Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">My Saved Trips</h1>
            <p className="text-slate-600 mt-2">All your AI-generated travel itineraries in one place.</p>
          </div>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap"
          >
            + Plan New Trip
          </Link>
        </header>

        {/* Dynamic Trip Grid */}
        {trips.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-lg">You haven&apos;t saved any trips yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip: Trip) => (
              <div key={trip.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-3 uppercase tracking-wide">
                    {trip.days} Days • {trip.budget}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">{trip.destination}</h2>
                  <p className="text-slate-500 text-sm mt-2">
                    Saved on {new Date(trip.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-600 mb-4">
                    Fully planned day-by-day itinerary ready for your adventure.
                  </p>
                    <Link 
                        href={`/trips/${trip.id}`}
                        className="w-full block text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2 rounded-lg transition"
                    >
                        View Details
                    </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}