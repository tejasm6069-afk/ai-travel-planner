# roam. Travel planner

A Next.js travel app with destination discovery, a personal AI planner, private saved trips, wishlist, budget tools, packing checklist, notes, maps links, and itinerary export.

## Run locally

1. Install Node.js 22 or newer and run `npm install`.
2. Copy `.env.example` to `.env.local` and supply your own Clerk, Groq, and PostgreSQL credentials.
3. Run `npx prisma migrate deploy` against your new development database, then `npm run dev`.
4. Visit http://localhost:3000.

Never commit credentials. The source ZIP intentionally excludes them.

## Checks

- `npm run lint`
- `npm test`
- `npm run build`
- `node tests/check-ai.mjs` calls the live AI service and consumes API usage.
- `node tests/check-services.mjs` checks database ownership with a rolled-back transaction and calls the AI service.

## Deploy

Link the project to Vercel, configure the variables listed in `.env.example`, initialize the new PostgreSQL database, then deploy with `vercel --prod`. Use production Clerk keys and configure the deployed domain in Clerk before a public release.

## Current limitations

The Neon database is provisioned in tejas-48fb and its initial migration is applied. Live app: https://roam-travel-planner-tau.vercel.app. Vercel production deployment and public page/API smoke checks passed. The old database is unreachable; existing records have not been migrated. Current Clerk credentials are development credentials. AI prices and schedules are estimates, not live booking data. Wishlist, notes, and packing progress are stored in the current browser. Generation throttling is per server instance; use a shared rate limiter before a large public launch.


