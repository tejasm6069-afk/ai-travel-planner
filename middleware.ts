import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Make the home page and the generation API public so anyone can try the AI
const isPublicRoute = createRouteMatcher(['/', '/api/generate-trip']);

export default clerkMiddleware(async (auth, req) => {
  // If the user tries to access a protected route (like /trips), force them to log in
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};