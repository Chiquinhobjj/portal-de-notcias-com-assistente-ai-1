import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = parseInt(params.id);
    
    const video = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    if (video.length === 0) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ video: video[0] });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = parseInt(params.id);
    const body = await request.json();
    const {
      title,
      description,
      youtubeUrl,
      thumbnailUrl,
      category,
      duration,
      status,
    } = body;

    const now = new Date().toISOString();
    const publishedAt = status === "published" ? now : null;

    const updatedVideo = await db
      .update(videos)
      .set({
        title,
        description,
        youtubeUrl,
        thumbnailUrl,
        category,
        duration,
        status,
        publishedAt,
        updatedAt: now,
      })
      .where(eq(videos.id, videoId))
      .returning();

    if (updatedVideo.length === 0) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      video: updatedVideo[0],
      message: "Video updated successfully",
    });
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = parseInt(params.id);

    const deletedVideo = await db
      .delete(videos)
      .where(eq(videos.id, videoId))
      .returning();

    if (deletedVideo.length === 0) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}