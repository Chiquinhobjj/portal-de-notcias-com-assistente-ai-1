import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { videos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID is a valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const videoId = parseInt(id);

    // Query single video by ID
    const video = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    // Return 404 if video not found
    if (video.length === 0) {
      return NextResponse.json(
        {
          error: 'Video not found',
          code: 'VIDEO_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Return the video object
    return NextResponse.json(video[0], { status: 200 });
  } catch (error) {
    console.error('GET video error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}