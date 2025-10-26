import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const allMedia = await db
      .select()
      .from(media)
      .orderBy(desc(media.createdAt));

    return NextResponse.json({
      media: allMedia,
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, type } = body;

    if (!title || !url || !type) {
      return NextResponse.json(
        { error: "Title, URL, and type are required" },
        { status: 400 }
      );
    }

    if (!["image", "video"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be 'image' or 'video'" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const newMedia = await db
      .insert(media)
      .values({
        title,
        url,
        type,
        uploadedBy: "admin", // TODO: Get from session
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({
      media: newMedia[0],
      message: "Media added successfully",
    });
  } catch (error) {
    console.error("Error adding media:", error);
    return NextResponse.json(
      { error: "Failed to add media" },
      { status: 500 }
    );
  }
}
