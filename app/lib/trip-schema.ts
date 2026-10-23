import { z } from 'zod';

export const interests = ['Culture', 'Food & drink', 'Nature', 'Adventure', 'Relaxation', 'Shopping'] as const;
export const plannerSchema = z.object({
  destination: z.string().trim().min(2, 'Enter a destination with at least 2 characters.').max(100),
  days: z.number().int().min(1).max(10),
  budget: z.enum(['Backpacker', 'Moderate', 'Luxury']),
  travelers: z.number().int().min(1).max(12).default(2),
  pace: z.enum(['Relaxed', 'Balanced', 'Packed']).default('Balanced'),
  interests: z.array(z.enum(interests)).max(6).default([]),
  startDate: z.string().refine(value => !value || (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value), 'Choose a valid date.').default(''),
  notes: z.string().trim().max(600).default(''),
});
export const activitySchema = z.object({
  timeOfDay: z.string().min(1).max(60), placeName: z.string().min(1).max(180),
  description: z.string().min(1).max(1200), estimatedCost: z.string().min(1).max(100),
});
export const daySchema = z.object({
  day: z.number().int().min(1).max(10), theme: z.string().min(1).max(180),
  activities: z.array(activitySchema).min(1).max(8),
});
export const tripSchema = plannerSchema.extend({
  itinerary: z.array(daySchema).min(1).max(10),
  summary: z.string().max(1000).default('A little discovery, a little adventure. A journey made for you.'),
  tips: z.array(z.string().max(500)).max(8).default([]),
}).refine(trip => trip.itinerary.length === trip.days && trip.itinerary.every((day, index) => day.day === index + 1), {
  message: 'The itinerary must contain every requested day, in order.', path: ['itinerary'],
});
export type PlannerInput = z.infer<typeof plannerSchema>;
export type TripData = z.infer<typeof tripSchema>;
export type DayPlan = z.infer<typeof daySchema>;

// Read original array-based trips as well as new trips with richer preferences.
export function unpackTrip(row: { destination: string; budget: string; days: number; itinerary: unknown }): TripData | null {
  const stored = Array.isArray(row.itinerary) ? { itinerary: row.itinerary } : row.itinerary;
  const parsed = tripSchema.safeParse({ ...(typeof stored === 'object' && stored ? stored : {}), destination: row.destination, budget: row.budget, days: row.days });
  return parsed.success ? parsed.data : null;
}

