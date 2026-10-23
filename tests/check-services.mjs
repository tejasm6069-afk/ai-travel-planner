// Explicit integration check: no secrets or user records are printed.
import nextEnv from '@next/env';

import { generateTrip } from '../app/lib/generation.ts';
import { plannerSchema } from '../app/lib/trip-schema.ts';

nextEnv.loadEnvConfig(process.cwd());
const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();
const rollback = new Error('intentional-test-rollback');
function safeError(error) {
  let message = String(error.message || error.name);
  for (const name of ['DATABASE_URL', 'DIRECT_URL', 'GROQ_API_KEY', 'CLERK_SECRET_KEY']) {
    if (process.env[name]) message = message.replaceAll(process.env[name], '[redacted]');
  }
  return message.replace(/postgres(?:ql)?:\/\/\S+/g, '[database URL]').slice(0, 1500);
}
try {
  await prisma.trip.count({ where: { userId: '__roam_read_check__' } });
  console.log('PASS database connection and userId column');
  let checked = false;
  try {
    await prisma.$transaction(async tx => {
      const userId = '__roam_verify_' + crypto.randomUUID();
      const row = await tx.trip.create({ data: { userId, destination: 'Integration check (rolled back)', budget: 'Moderate', days: 1, itinerary: [] } });
      const hidden = await tx.trip.findFirst({ where: { id: row.id, userId: userId + '_other' } });
      const denied = await tx.trip.deleteMany({ where: { id: row.id, userId: userId + '_other' } });
      const owned = await tx.trip.findFirst({ where: { id: row.id, userId } });
      if (hidden || denied.count !== 0 || !owned) throw new Error('ownership-check-failed');
      const deleted = await tx.trip.deleteMany({ where: { id: row.id, userId } });
      if (deleted.count !== 1) throw new Error('owner-delete-failed');
      checked = true;
      throw rollback;
    }, { timeout: 15000 });
  } catch (error) { if (error !== rollback) throw error; }
  if (checked) console.log('PASS isolated create, owner-only read/delete; transaction rolled back');
} catch (error) {
  console.log('FAIL database check:', safeError(error));
  process.exitCode = 1;
} finally { await prisma.$disconnect(); }

try {
  await generateTrip(plannerSchema.parse({ destination: 'Kyoto, Japan', budget: 'Moderate', days: 1, travelers: 2, pace: 'Relaxed', interests: ['Culture'] }));
  console.log('PASS live AI response validated against itinerary schema');
} catch (error) {
  console.log('FAIL AI check:', safeError(error));
  process.exitCode = 1;
}
console.log('Clerk key mode:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_') ? 'development' : 'production or unset');


