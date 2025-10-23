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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        },
        { status: 400 }
      );
    }

    const video = await db.select()
      .from(videos)
      .where(eq(videos.id, parseInt(id)))
      .limit(1);

    if (video.length === 0) {
      return NextResponse.json(
        { 
          error: 'Video not found',
          code: 'VIDEO_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(video[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        },
        { status: 400 }
      );
    }

    const videoId = parseInt(id);

    const existingVideo = await db.select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    if (existingVideo.length === 0) {
      return NextResponse.json(
        { 
          error: 'Video not found',
          code: 'VIDEO_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim().length === 0) {
        return NextResponse.json(
          { 
            error: "Title must be a non-empty string",
            code: "INVALID_TITLE" 
          },
          { status: 400 }
        );
      }
      updates.title = body.title.trim();
    }

    if (body.description !== undefined) {
      if (typeof body.description !== 'string') {
        return NextResponse.json(
          { 
            error: "Description must be a string",
            code: "INVALID_DESCRIPTION" 
          },
          { status: 400 }
        );
      }
      updates.description = body.description.trim();
    }

    if (body.youtubeUrl !== undefined) {
      if (typeof body.youtubeUrl !== 'string' || body.youtubeUrl.trim().length === 0) {
        return NextResponse.json(
          { 
            error: "YouTube URL must be a non-empty string",
            code: "INVALID_YOUTUBE_URL" 
          },
          { status: 400 }
        );
      }
      updates.youtubeUrl = body.youtubeUrl.trim();
    }

    if (body.thumbnailUrl !== undefined) {
      if (typeof body.thumbnailUrl !== 'string' || body.thumbnailUrl.trim().length === 0) {
        return NextResponse.json(
          { 
            error: "Thumbnail URL must be a non-empty string",
            code: "INVALID_THUMBNAIL_URL" 
          },
          { status: 400 }
        );
      }
      updates.thumbnailUrl = body.thumbnailUrl.trim();
    }

    if (body.category !== undefined) {
      if (typeof body.category !== 'string' || body.category.trim().length === 0) {
        return NextResponse.json(
          { 
            error: "Category must be a non-empty string",
            code: "INVALID_CATEGORY" 
          },
          { status: 400 }
        );
      }
      updates.category = body.category.trim();
    }

    if (body.duration !== undefined) {
      if (typeof body.duration !== 'string' || body.duration.trim().length === 0) {
        return NextResponse.json(
          { 
            error: "Duration must be a non-empty string",
            code: "INVALID_DURATION" 
          },
          { status: 400 }
        );
      }
      updates.duration = body.duration.trim();
    }

    if (body.views !== undefined) {
      if (typeof body.views !== 'number' || body.views < 0) {
        return NextResponse.json(
          { 
            error: "Views must be a non-negative number",
            code: "INVALID_VIEWS" 
          },
          { status: 400 }
        );
      }
      updates.views = body.views;
    }

    if (body.likes !== undefined) {
      if (typeof body.likes !== 'number' || body.likes < 0) {
        return NextResponse.json(
          { 
            error: "Likes must be a non-negative number",
            code: "INVALID_LIKES" 
          },
          { status: 400 }
        );
      }
      updates.likes = body.likes;
    }

    if (body.source !== undefined) {
      if (typeof body.source !== 'string' || body.source.trim().length === 0) {
        return NextResponse.json(
          { 
            error: "Source must be a non-empty string",
            code: "INVALID_SOURCE" 
          },
          { status: 400 }
        );
      }
      updates.source = body.source.trim();
    }

    if (body.publishedAt !== undefined) {
      if (body.publishedAt !== null && typeof body.publishedAt !== 'string') {
        return NextResponse.json(
          { 
            error: "Published date must be a string or null",
            code: "INVALID_PUBLISHED_AT" 
          },
          { status: 400 }
        );
      }
      updates.publishedAt = body.publishedAt;
    }

    const updated = await db.update(videos)
      .set(updates)
      .where(eq(videos.id, videoId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        },
        { status: 400 }
      );
    }

    const videoId = parseInt(id);

    const existingVideo = await db.select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    if (existingVideo.length === 0) {
      return NextResponse.json(
        { 
          error: 'Video not found',
          code: 'VIDEO_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const deleted = await db.delete(videos)
      .where(eq(videos.id, videoId))
      .returning();

    return NextResponse.json(
      {
        message: 'Video deleted successfully',
        video: deleted[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}