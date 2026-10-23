import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export class RequestError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export async function readJson(request: Request, limit = 80_000): Promise<unknown> {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) throw new RequestError('This request is not allowed.', 403);
  if (!request.headers.get('content-type')?.includes('application/json')) throw new RequestError('Send a JSON request.', 415);
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError('A request body is required.');
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new RequestError('This request is too large.', 413); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new RequestError('The request contains invalid JSON.'); }
}
export async function requireUser() {
  if (!process.env.CLERK_SECRET_KEY || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) throw new RequestError('Sign-in is not configured yet.', 503);
  const { userId } = await auth();
  if (!userId) throw new RequestError('Sign in to continue.', 401);
  return userId;
}
export function apiError(error: unknown, fallback: string) {
  if (error instanceof RequestError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  // Provider messages can contain secrets or private request content.
  console.error(fallback, error instanceof Error ? error.name : 'UnknownError');
  return NextResponse.json({ success: false, error: fallback }, { status: 503 });
}

