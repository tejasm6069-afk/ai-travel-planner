import { NextResponse } from 'next/server';
import { plannerSchema } from '@/app/lib/trip-schema';
import { generateTrip } from '@/app/lib/generation';
import { apiError, readJson, RequestError, requireUser } from '@/app/lib/api';

export const runtime = 'nodejs';
export const maxDuration = 60;
// Per-instance burst protection. Use shared Redis for a global multi-instance quota.
const requests = new Map<string, { count: number; reset: number }>();

export async function POST(request: Request) {
  try {
    const userId = await requireUser();
    const input = plannerSchema.safeParse(await readJson(request, 8_000));
    if (!input.success) throw new RequestError(input.error.issues[0].message);
    const now = Date.now();
    for (const [key, value] of requests) if (value.reset < now) requests.delete(key);
    const limit = requests.get(userId) ?? { count: 0, reset: now + 60_000 };
    if (limit.count >= 3) return NextResponse.json({ success: false, error: 'You’ve planned a few adventures! Please wait a minute and try again.' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((limit.reset - now) / 1000)) } });
    if (!process.env.GROQ_API_KEY) throw new RequestError('The AI planner is temporarily unavailable. Explore the sample itinerary while we reconnect.', 503);
    requests.set(userId, { ...limit, count: limit.count + 1 });
    const trip = await generateTrip(input.data);
    return NextResponse.json({ success: true, data: trip }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return apiError(error, 'We couldn’t create your trip right now. Please try again shortly.'); }
}
