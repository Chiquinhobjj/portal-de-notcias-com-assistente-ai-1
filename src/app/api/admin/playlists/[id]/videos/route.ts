import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { playlists, playlistVideos, videos } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: playlistId } = await params;
    const { videoId } = await request.json();

    // Validate playlistId
    if (!playlistId || isNaN(parseInt(playlistId))) {
      return NextResponse.json(
        { 
          error: 'Valid playlist ID is required',
          code: 'INVALID_PLAYLIST_ID' 
        },
        { status: 400 }
      );
    }

    // Validate videoId
    if (!videoId || isNaN(parseInt(videoId))) {
      return NextResponse.json(
        { 
          error: 'Valid video ID is required',
          code: 'INVALID_VIDEO_ID' 
        },
        { status: 400 }
      );
    }

    const parsedPlaylistId = parseInt(playlistId);
    const parsedVideoId = parseInt(videoId);

    // Check if playlist exists
    const playlist = await db.select()
      .from(playlists)
      .where(eq(playlists.id, parsedPlaylistId))
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

    // Check if video exists
    const video = await db.select()
      .from(videos)
      .where(eq(videos.id, parsedVideoId))
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

    // Check if video is already in playlist (prevent duplicates)
    const existingEntry = await db.select()
      .from(playlistVideos)
      .where(
        and(
          eq(playlistVideos.playlistId, parsedPlaylistId),
          eq(playlistVideos.videoId, parsedVideoId)
        )
      )
      .limit(1);

    if (existingEntry.length > 0) {
      return NextResponse.json(
        { 
          error: 'Video is already in this playlist',
          code: 'VIDEO_ALREADY_IN_PLAYLIST' 
        },
        { status: 400 }
      );
    }

    // Get max position from existing playlistVideos for this playlist
    const maxPositionResult = await db.select()
      .from(playlistVideos)
      .where(eq(playlistVideos.playlistId, parsedPlaylistId))
      .orderBy(desc(playlistVideos.position))
      .limit(1);

    const maxPosition = maxPositionResult.length > 0 ? maxPositionResult[0].position : -1;
    const newPosition = maxPosition + 1;

    // Insert new playlistVideos record
    const newPlaylistVideo = await db.insert(playlistVideos)
      .values({
        playlistId: parsedPlaylistId,
        videoId: parsedVideoId,
        position: newPosition,
        createdAt: new Date().toISOString()
      })
      .returning();

    // Update playlist videoCount and updatedAt
    await db.update(playlists)
      .set({
        videoCount: playlist[0].videoCount + 1,
        updatedAt: new Date().toISOString()
      })
      .where(eq(playlists.id, parsedPlaylistId));

    return NextResponse.json(newPlaylistVideo[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}