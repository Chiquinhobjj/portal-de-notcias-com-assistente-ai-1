import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { playlists, playlistVideos, videos } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const playlistId = parseInt(id);

    // Fetch playlist details
    const playlist = await db
      .select()
      .from(playlists)
      .where(eq(playlists.id, playlistId))
      .limit(1);

    if (playlist.length === 0) {
      return NextResponse.json(
        { 
          error: 'Playlist not found',
          code: 'PLAYLIST_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Fetch videos in playlist with join
    const playlistWithVideos = await db
      .select({
        videoId: videos.id,
        title: videos.title,
        description: videos.description,
        youtubeUrl: videos.youtubeUrl,
        thumbnailUrl: videos.thumbnailUrl,
        duration: videos.duration,
        views: videos.views,
        likes: videos.likes,
        source: videos.source,
        publishedAt: videos.publishedAt,
        createdAt: videos.createdAt,
        updatedAt: videos.updatedAt,
        position: playlistVideos.position,
      })
      .from(playlistVideos)
      .leftJoin(videos, eq(playlistVideos.videoId, videos.id))
      .where(eq(playlistVideos.playlistId, playlistId))
      .orderBy(asc(playlistVideos.position));

    const videosList = playlistWithVideos.map(item => ({
      id: item.videoId,
      title: item.title,
      description: item.description,
      youtubeUrl: item.youtubeUrl,
      thumbnailUrl: item.thumbnailUrl,
      duration: item.duration,
      views: item.views,
      likes: item.likes,
      source: item.source,
      publishedAt: item.publishedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      position: item.position,
    }));

    return NextResponse.json({
      playlist: playlist[0],
      videos: videosList,
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
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
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const playlistId = parseInt(id);

    // Check if playlist exists
    const existingPlaylist = await db
      .select()
      .from(playlists)
      .where(eq(playlists.id, playlistId))
      .limit(1);

    if (existingPlaylist.length === 0) {
      return NextResponse.json(
        { 
          error: 'Playlist not found',
          code: 'PLAYLIST_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Sanitize string inputs
    const updates: Partial<typeof playlists.$inferInsert> = {};

    if (body.title !== undefined) {
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      if (!title) {
        return NextResponse.json(
          { 
            error: 'Title cannot be empty',
            code: 'INVALID_TITLE' 
          },
          { status: 400 }
        );
      }
      updates.title = title;
    }

    if (body.description !== undefined) {
      const description = typeof body.description === 'string' ? body.description.trim() : '';
      if (!description) {
        return NextResponse.json(
          { 
            error: 'Description cannot be empty',
            code: 'INVALID_DESCRIPTION' 
          },
          { status: 400 }
        );
      }
      updates.description = description;
    }

    if (body.thumbnailUrl !== undefined) {
      const thumbnailUrl = typeof body.thumbnailUrl === 'string' ? body.thumbnailUrl.trim() : '';
      if (!thumbnailUrl) {
        return NextResponse.json(
          { 
            error: 'Thumbnail URL cannot be empty',
            code: 'INVALID_THUMBNAIL_URL' 
          },
          { status: 400 }
        );
      }
      updates.thumbnailUrl = thumbnailUrl;
    }

    if (body.videoCount !== undefined) {
      const videoCount = parseInt(body.videoCount);
      if (isNaN(videoCount) || videoCount < 0) {
        return NextResponse.json(
          { 
            error: 'Video count must be a non-negative number',
            code: 'INVALID_VIDEO_COUNT' 
          },
          { status: 400 }
        );
      }
      updates.videoCount = videoCount;
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    if (Object.keys(updates).length === 1) {
      return NextResponse.json(
        { 
          error: 'No valid fields to update',
          code: 'NO_UPDATES' 
        },
        { status: 400 }
      );
    }

    const updatedPlaylist = await db
      .update(playlists)
      .set(updates)
      .where(eq(playlists.id, playlistId))
      .returning();

    return NextResponse.json(updatedPlaylist[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
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
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const playlistId = parseInt(id);

    // Check if playlist exists
    const existingPlaylist = await db
      .select()
      .from(playlists)
      .where(eq(playlists.id, playlistId))
      .limit(1);

    if (existingPlaylist.length === 0) {
      return NextResponse.json(
        { 
          error: 'Playlist not found',
          code: 'PLAYLIST_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Delete playlist (CASCADE will automatically remove playlistVideos entries)
    const deletedPlaylist = await db
      .delete(playlists)
      .where(eq(playlists.id, playlistId))
      .returning();

    return NextResponse.json({
      message: 'Playlist deleted successfully',
      playlist: deletedPlaylist[0],
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}