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

    // Validate ID is a valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid playlist ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const playlistId = parseInt(id);

    // Fetch playlist details
    const playlistResult = await db
      .select()
      .from(playlists)
      .where(eq(playlists.id, playlistId))
      .limit(1);

    if (playlistResult.length === 0) {
      return NextResponse.json(
        {
          error: 'Playlist not found',
          code: 'PLAYLIST_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    const playlist = playlistResult[0];

    // Fetch all videos in this playlist with join
    const playlistVideosResult = await db
      .select({
        video: videos,
        position: playlistVideos.position,
      })
      .from(playlistVideos)
      .leftJoin(videos, eq(playlistVideos.videoId, videos.id))
      .where(eq(playlistVideos.playlistId, playlistId))
      .orderBy(asc(playlistVideos.position));

    // Extract video objects and filter out any null videos from failed joins
    const videosList = playlistVideosResult
      .filter((item) => item.video !== null)
      .map((item) => item.video);

    // Return playlist with videos
    return NextResponse.json({
      playlist,
      videos: videosList,
    });
  } catch (error) {
    console.error('GET playlist error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}