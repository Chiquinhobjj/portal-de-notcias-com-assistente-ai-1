import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = parseInt(params.id);
    const body = await request.json();
    const { status } = body;

    if (!status || !["published", "draft"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'published' or 'draft'" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const publishedAt = status === "published" ? now : null;

    const updatedVideo = await db
      .update(videos)
      .set({
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
      message: `Video ${status === "published" ? "published" : "moved to draft"} successfully`,
    });
  } catch (error) {
    console.error("Error updating video status:", error);
    return NextResponse.json(
      { error: "Failed to update video status" },
      { status: 500 }
    );
  }
}
