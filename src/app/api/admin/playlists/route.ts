import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { playlists } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const allPlaylists = await db.select()
      .from(playlists)
      .orderBy(desc(playlists.createdAt));

    return NextResponse.json(allPlaylists, { status: 200 });
  } catch (error) {
    console.error('GET playlists error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, thumbnailUrl } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ 
        error: "Title is required and must be a non-empty string",
        code: "TITLE_REQUIRED" 
      }, { status: 400 });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ 
        error: "Description is required and must be a non-empty string",
        code: "DESCRIPTION_REQUIRED" 
      }, { status: 400 });
    }

    if (!thumbnailUrl || typeof thumbnailUrl !== 'string' || thumbnailUrl.trim().length === 0) {
      return NextResponse.json({ 
        error: "Thumbnail URL is required and must be a non-empty string",
        code: "THUMBNAIL_URL_REQUIRED" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();
    const sanitizedThumbnailUrl = thumbnailUrl.trim();

    // Create playlist with auto-generated fields
    const newPlaylist = await db.insert(playlists)
      .values({
        title: sanitizedTitle,
        description: sanitizedDescription,
        thumbnailUrl: sanitizedThumbnailUrl,
        videoCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newPlaylist[0], { status: 201 });
  } catch (error) {
    console.error('POST playlist error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}