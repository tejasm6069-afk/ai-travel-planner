import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteButton from './DeleteButton';

// Define the interfaces matching your JSON itinerary structure
interface Activity {
  timeOfDay: string;
  placeName: string;
  description: string;
  estimatedCost: string;
}

interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TripDetailsPage({ params }: Props) {
  // Await the params object for Next.js 15 compatibility
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Fetch the specific trip from Supabase using its unique ID
  const trip = await prisma.trip.findUnique({
    where: { id },
  });

  // If the ID doesn't exist in the database, show a 404 page
  if (!trip) {
    notFound();
  }

  // Parse the stored JSON itinerary back into JavaScript objects
  const itinerary = trip.itinerary as unknown as DayPlan[];

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Delete Action */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/trips"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition"
          >
            ← Back to Saved Trips
          </Link>
          <DeleteButton tripId={trip.id} />
        </div>

        {/* Trip Header Banner */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wide">
              {trip.days} Days
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wide">
              {trip.budget} Budget
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            {trip.destination}
          </h1>
          <p className="text-slate-500 text-sm">
            Saved on {new Date(trip.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Day-by-Day Itinerary List */}
        <div className="space-y-6">
          {itinerary.map((dayPlan) => (
            <div key={dayPlan.day} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <div className="border-b pb-3">
                <h3 className="text-xl font-semibold text-slate-800">Day {dayPlan.day}</h3>
                <p className="text-sm text-blue-600 font-medium">{dayPlan.theme}</p>
              </div>

              <div className="space-y-3">
                {dayPlan.activities.map((act, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-start justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div>
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded mr-2 mb-1">
                        {act.timeOfDay}
                      </span>
                      <h4 className="font-semibold text-slate-900 inline">{act.placeName}</h4>
                      <p className="text-sm text-slate-600 mt-1">{act.description}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 mt-2 sm:mt-0 whitespace-nowrap">
                      Est. Cost: {act.estimatedCost}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}