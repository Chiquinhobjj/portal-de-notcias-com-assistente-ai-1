import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { videos } from '@/db/schema';
import { eq, like, and, or, desc, asc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single video by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const video = await db.select()
        .from(videos)
        .where(eq(videos.id, parseInt(id)))
        .limit(1);

      if (video.length === 0) {
        return NextResponse.json({ 
          error: 'Video not found',
          code: "VIDEO_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(video[0], { status: 200 });
    }

    // List videos with pagination, search, filtering, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const sortField = searchParams.get('sort') ?? 'createdAt';
    const sortOrder = searchParams.get('order') ?? 'desc';

    let query = db.select().from(videos);
    const conditions = [];

    // Search in title and description (case-insensitive)
    if (search) {
      const searchTerm = search.trim();
      conditions.push(
        or(
          sql`lower(${videos.title}) LIKE lower(${'%' + searchTerm + '%'})`,
          sql`lower(${videos.description}) LIKE lower(${'%' + searchTerm + '%'})`
        )
      );
    }

    // Filter by category
    if (category) {
      conditions.push(eq(videos.category, category.trim()));
    }

    // Apply filters
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply sorting
    const orderColumn = sortField === 'title' ? videos.title :
                       sortField === 'category' ? videos.category :
                       sortField === 'views' ? videos.views :
                       sortField === 'likes' ? videos.likes :
                       sortField === 'publishedAt' ? videos.publishedAt :
                       sortField === 'updatedAt' ? videos.updatedAt :
                       videos.createdAt;

    query = query.orderBy(sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn));

    // Get total count for pagination metadata
    const countQuery = conditions.length > 0 
      ? db.select({ count: sql<number>`count(*)` }).from(videos).where(conditions.length === 1 ? conditions[0] : and(...conditions))
      : db.select({ count: sql<number>`count(*)` }).from(videos);
    
    const [countResult] = await countQuery;
    const total = countResult?.count || 0;

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json({
      data: results,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'youtubeUrl', 'thumbnailUrl', 'category', 'duration', 'source'];
    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== 'string' || body[field].trim() === '') {
        return NextResponse.json({ 
          error: `${field} is required and must be a non-empty string`,
          code: `MISSING_${field.toUpperCase()}` 
        }, { status: 400 });
      }
    }

    // Sanitize string inputs
    const sanitizedData = {
      title: body.title.trim(),
      description: body.description.trim(),
      youtubeUrl: body.youtubeUrl.trim(),
      thumbnailUrl: body.thumbnailUrl.trim(),
      category: body.category.trim(),
      duration: body.duration.trim(),
      source: body.source.trim(),
      publishedAt: body.publishedAt ? body.publishedAt.trim() : null,
      views: typeof body.views === 'number' ? body.views : 0,
      likes: typeof body.likes === 'number' ? body.likes : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newVideo = await db.insert(videos)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newVideo[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const videoId = parseInt(id);

    // Check if video exists
    const existingVideo = await db.select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    if (existingVideo.length === 0) {
      return NextResponse.json({ 
        error: 'Video not found',
        code: "VIDEO_NOT_FOUND" 
      }, { status: 404 });
    }

    const body = await request.json();

    // Build update object with only provided fields
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    // Sanitize and add provided fields
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim() === '') {
        return NextResponse.json({ 
          error: "title must be a non-empty string",
          code: "INVALID_TITLE" 
        }, { status: 400 });
      }
      updates.title = body.title.trim();
    }

    if (body.description !== undefined) {
      if (typeof body.description !== 'string' || body.description.trim() === '') {
        return NextResponse.json({ 
          error: "description must be a non-empty string",
          code: "INVALID_DESCRIPTION" 
        }, { status: 400 });
      }
      updates.description = body.description.trim();
    }

    if (body.youtubeUrl !== undefined) {
      if (typeof body.youtubeUrl !== 'string' || body.youtubeUrl.trim() === '') {
        return NextResponse.json({ 
          error: "youtubeUrl must be a non-empty string",
          code: "INVALID_YOUTUBE_URL" 
        }, { status: 400 });
      }
      updates.youtubeUrl = body.youtubeUrl.trim();
    }

    if (body.thumbnailUrl !== undefined) {
      if (typeof body.thumbnailUrl !== 'string' || body.thumbnailUrl.trim() === '') {
        return NextResponse.json({ 
          error: "thumbnailUrl must be a non-empty string",
          code: "INVALID_THUMBNAIL_URL" 
        }, { status: 400 });
      }
      updates.thumbnailUrl = body.thumbnailUrl.trim();
    }

    if (body.category !== undefined) {
      if (typeof body.category !== 'string' || body.category.trim() === '') {
        return NextResponse.json({ 
          error: "category must be a non-empty string",
          code: "INVALID_CATEGORY" 
        }, { status: 400 });
      }
      updates.category = body.category.trim();
    }

    if (body.duration !== undefined) {
      if (typeof body.duration !== 'string' || body.duration.trim() === '') {
        return NextResponse.json({ 
          error: "duration must be a non-empty string",
          code: "INVALID_DURATION" 
        }, { status: 400 });
      }
      updates.duration = body.duration.trim();
    }

    if (body.source !== undefined) {
      if (typeof body.source !== 'string' || body.source.trim() === '') {
        return NextResponse.json({ 
          error: "source must be a non-empty string",
          code: "INVALID_SOURCE" 
        }, { status: 400 });
      }
      updates.source = body.source.trim();
    }

    if (body.publishedAt !== undefined) {
      updates.publishedAt = body.publishedAt ? body.publishedAt.trim() : null;
    }

    if (body.views !== undefined) {
      if (typeof body.views !== 'number') {
        return NextResponse.json({ 
          error: "views must be a number",
          code: "INVALID_VIEWS" 
        }, { status: 400 });
      }
      updates.views = body.views;
    }

    if (body.likes !== undefined) {
      if (typeof body.likes !== 'number') {
        return NextResponse.json({ 
          error: "likes must be a number",
          code: "INVALID_LIKES" 
        }, { status: 400 });
      }
      updates.likes = body.likes;
    }

    const updated = await db.update(videos)
      .set(updates)
      .where(eq(videos.id, videoId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const videoId = parseInt(id);

    // Check if video exists before deleting
    const existingVideo = await db.select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    if (existingVideo.length === 0) {
      return NextResponse.json({ 
        error: 'Video not found',
        code: "VIDEO_NOT_FOUND" 
      }, { status: 404 });
    }

    const deleted = await db.delete(videos)
      .where(eq(videos.id, videoId))
      .returning();

    return NextResponse.json({
      message: 'Video deleted successfully',
      video: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}