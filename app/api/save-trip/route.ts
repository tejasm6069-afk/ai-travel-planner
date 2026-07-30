// app/api/save-trip/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
  try {
    const { destination, budget, days, itinerary } = await req.json();

    const savedTrip = await prisma.trip.create({
      data: {
        destination,
        budget,
        days: Number(days),
        itinerary, // Saves the full JSON structure
      },
    });

    return NextResponse.json({ success: true, trip: savedTrip });
  } catch (error) {
    console.error("Error saving trip to database:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to save trip to database' },
      { status: 500 }
    );
  }
}