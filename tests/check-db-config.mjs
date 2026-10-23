import fs from 'node:fs';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
for (const file of ['.env.local', '.env']) {
  if (!fs.existsSync(file)) continue;
  const config = dotenv.parse(fs.readFileSync(file));
  for (const key of ['DATABASE_URL', 'DIRECT_URL']) {
    if (!config[key]) continue;
    const db = new PrismaClient({ datasourceUrl: config[key] });
    try {
      await db.$queryRaw`SELECT 1`;
      console.log(file, key, 'connection PASS');
      try { await db.trip.count({ where: { userId: '__roam_verify__' } }); console.log(file, key, 'schema PASS'); }
      catch (error) { console.log(file, key, 'schema FAIL', error.code || error.name); }
    } catch (error) { console.log(file, key, 'connection FAIL', error.code || error.name); }
    finally { await db.$disconnect(); }
  }
}
