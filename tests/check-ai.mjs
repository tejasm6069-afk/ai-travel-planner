import nextEnv from '@next/env';
import { plannerSchema } from '../app/lib/trip-schema.ts';
import { generateTrip } from '../app/lib/generation.ts';
nextEnv.loadEnvConfig(process.cwd());
try {
  const trip = await generateTrip(plannerSchema.parse({ destination: 'Kyoto, Japan', budget: 'Moderate', days: 3, travelers: 2, pace: 'Relaxed', interests: ['Culture'] }));
  console.log('PASS actual generation service:', trip.itinerary.length, 'valid days;', trip.itinerary.reduce((n, d) => n + d.activities.length, 0), 'activities');
} catch (error) {
  let message = String(error.message || error.name);
  for (const key of ['GROQ_API_KEY', 'DATABASE_URL', 'DIRECT_URL', 'CLERK_SECRET_KEY']) if (process.env[key]) message = message.replaceAll(process.env[key], '[redacted]');
  console.log('FAIL generation:', message.slice(0, 2000));
  process.exitCode = 1;
}
