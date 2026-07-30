'use client';

import { useState } from 'react';

// Define TypeScript interfaces matching our API response structure
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

interface TripData {
  destination: string;
  budget: string;
  itinerary: DayPlan[];
}

export default function Home() {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('Moderate');
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState<TripData | null>(null);
  const [error, setError] = useState('');
  
  // NEW: State for saving the trip to the database
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTrip(null);
    setSavedSuccess(false); // Reset save state on new generation

    try {
      const res = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, budget, days: Number(days) }),
      });

      const result = await res.json();

      if (result.success) {
        setTrip(result.data);
      } else {
        setError(result.error || 'Failed to generate itinerary');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to send the generated trip to your database
  const handleSaveTrip = async () => {
    if (!trip) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/save-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: trip.destination,
          budget: trip.budget,
          days,
          itinerary: trip.itinerary,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setSavedSuccess(true);
      } else {
        alert('Failed to save trip.');
      }
    } catch (err) {
      alert('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900">AI Travel Planner</h1>
          <p className="text-slate-600">Plan your dream trip in seconds with structured AI recommendations.</p>
        </header>

        {/* Form Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
              <input
                type="text"
                required
                placeholder="e.g. Kyoto, Japan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                <option value="Backpacker">Backpacker / Budget</option>
                <option value="Moderate">Moderate</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Days</label>
              <input
                type="number"
                min={1}
                max={7}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Generating Itinerary...' : 'Generate Trip'}
              </button>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Trip Itinerary Display */}
        {trip && (
          <div className="space-y-6">
            
            {/* NEW: Updated Header with Save Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {trip.destination} Itinerary ({trip.budget} Budget)
              </h2>
              <button
                onClick={handleSaveTrip}
                disabled={saving || savedSuccess}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 whitespace-nowrap"
              >
                {saving ? 'Saving...' : savedSuccess ? 'Saved! ✓' : 'Save Trip'}
              </button>
            </div>

            {trip.itinerary.map((dayPlan) => (
              <div key={dayPlan.day} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-xl font-semibold text-slate-800">Day {dayPlan.day}</h3>
                  <p className="text-sm text-blue-600 font-medium">{dayPlan.theme}</p>
                </div>

                <div className="space-y-3">
                  {dayPlan.activities.map((act, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-start justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
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
        )}
      </div>
    </main>
  );
}