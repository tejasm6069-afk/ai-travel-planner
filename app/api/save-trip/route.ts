import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { tripSchema } from '@/app/lib/trip-schema';
import { apiError, readJson, RequestError, requireUser } from '@/app/lib/api';

export async function POST(request: Request) {
  try {
    const userId = await requireUser();
    const result = tripSchema.safeParse(await readJson(request));
    if (!result.success) throw new RequestError(result.error.issues[0].message);
    const { destination, budget, days, ...details } = result.data;
    const saved = await prisma.trip.create({ data: { userId, destination, budget, days, itinerary: details }, select: { id: true } });
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) { return apiError(error, 'We couldn’t save your trip. Your itinerary is still here—please try again.'); }
}

