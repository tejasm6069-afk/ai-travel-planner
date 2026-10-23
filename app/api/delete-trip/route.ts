import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/app/lib/prisma';
import { apiError, readJson, RequestError, requireUser } from '@/app/lib/api';

export async function DELETE(request: Request) {
  try {
    const userId = await requireUser();
    const result = z.object({ id: z.string().min(1).max(100) }).safeParse(await readJson(request, 1_000));
    if (!result.success) throw new RequestError('A valid trip ID is required.');
    const deleted = await prisma.trip.deleteMany({ where: { id: result.data.id, userId } });
    if (!deleted.count) throw new RequestError('That trip could not be found.', 404);
    return NextResponse.json({ success: true });
  } catch (error) { return apiError(error, 'We couldn’t delete your trip. Please try again.'); }
}

