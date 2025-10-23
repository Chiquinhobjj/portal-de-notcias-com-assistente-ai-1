import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { playlists, playlistVideos } from '@/db/schema';
import { eq, and, asc, gt } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; videoId: string }> }
) {
  try {
    const { id, videoId } = await params;

    // Validate playlistId
    const playlistId = parseInt(id);
    if (!id || isNaN(playlistId)) {
      return NextResponse.json(
        {
          error: 'Valid playlist ID is required',
          code: 'INVALID_PLAYLIST_ID',
        },
        { status: 400 }
      );
    }

    // Validate videoId
    const videoIdNum = parseInt(videoId);
    if (!videoId || isNaN(videoIdNum)) {
      return NextResponse.json(
        {
          error: 'Valid video ID is required',
          code: 'INVALID_VIDEO_ID',
        },
        { status: 400 }
      );
    }

    // Check if playlist exists
    const playlist = await db
      .select()
      .from(playlists)
      .where(eq(playlists.id, playlistId))
      .limit(1);

    if (playlist.length === 0) {
      return NextResponse.json(
        {
          error: 'Playlist not found',
          code: 'PLAYLIST_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Check if this video is in this playlist
    const playlistVideo = await db
      .select()
      .from(playlistVideos)
      .where(
        and(
          eq(playlistVideos.playlistId, playlistId),
          eq(playlistVideos.videoId, videoIdNum)
        )
      )
      .limit(1);

    if (playlistVideo.length === 0) {
      return NextResponse.json(
        {
          error: 'Video not found in this playlist',
          code: 'VIDEO_NOT_IN_PLAYLIST',
        },
        { status: 404 }
      );
    }

    const deletedPosition = playlistVideo[0].position;

    // Delete the playlistVideos record
    await db
      .delete(playlistVideos)
      .where(
        and(
          eq(playlistVideos.playlistId, playlistId),
          eq(playlistVideos.videoId, videoIdNum)
        )
      );

    // Get remaining videos in playlist ordered by position
    const remainingVideos = await db
      .select()
      .from(playlistVideos)
      .where(eq(playlistVideos.playlistId, playlistId))
      .orderBy(asc(playlistVideos.position));

    // Reorder remaining videos to be sequential (0, 1, 2, etc.)
    for (let i = 0; i < remainingVideos.length; i++) {
      const video = remainingVideos[i];
      // Only update if position needs to change
      if (video.position !== i) {
        await db
          .update(playlistVideos)
          .set({ position: i })
          .where(eq(playlistVideos.id, video.id));
      }
    }

    // Calculate new video count (ensure it doesn't go below 0)
    const newVideoCount = Math.max(0, (playlist[0].videoCount || 0) - 1);

    // Update playlist videoCount and updatedAt
    await db
      .update(playlists)
      .set({
        videoCount: newVideoCount,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(playlists.id, playlistId));

    return NextResponse.json(
      {
        message: 'Video removed from playlist successfully',
        playlistId,
        videoId: videoIdNum,
        newVideoCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}