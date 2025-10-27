import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ads } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const adId = parseInt(id);

    // Check if ad exists
    const existingAd = await db.select()
      .from(ads)
      .where(eq(ads.id, adId))
      .limit(1);

    if (existingAd.length === 0) {
      return NextResponse.json(
        { 
          error: 'Ad not found',
          code: 'AD_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Increment clicks and update timestamp
    const updatedAd = await db.update(ads)
      .set({
        clicks: (existingAd[0].clicks ?? 0) + 1,
        updatedAt: new Date().toISOString()
      })
      .where(eq(ads.id, adId))
      .returning();

    return NextResponse.json(updatedAd[0], { status: 200 });

  } catch (error) {
    console.error('POST ad click error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}