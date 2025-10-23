import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { videos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID
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

    // Get current video record
    const existingVideo = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    if (existingVideo.length === 0) {
      return NextResponse.json(
        {
          error: 'Video not found',
          code: 'VIDEO_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Increment views count
    const currentViews = existingVideo[0].views || 0;
    const newViews = currentViews + 1;

    // Update video with incremented views
    const updatedVideo = await db
      .update(videos)
      .set({
        views: newViews,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(videos.id, videoId))
      .returning();

    return NextResponse.json(updatedVideo[0], { status: 200 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}