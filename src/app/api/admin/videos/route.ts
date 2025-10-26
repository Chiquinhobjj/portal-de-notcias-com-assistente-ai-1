import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { videos, videoCategories, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Buscar vídeos com suas categorias
    const allVideos = await db
      .select({
        id: videos.id,
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
        categoryId: categories.id,
        categoryName: categories.name,
      })
      .from(videos)
      .leftJoin(videoCategories, eq(videos.id, videoCategories.videoId))
      .leftJoin(categories, eq(videoCategories.categoryId, categories.id))
      .orderBy(desc(videos.createdAt))
      .limit(limit)
      .offset(offset);

    // Agrupar vídeos por ID e combinar categorias
    const videosWithCategories = allVideos.reduce((acc, row) => {
      const existingVideo = acc.find(v => v.id === row.id);
      if (existingVideo) {
        if (row.categoryId && !existingVideo.categories.find(c => c.id === row.categoryId)) {
          existingVideo.categories.push({
            id: row.categoryId,
            name: row.categoryName
          });
        }
      } else {
        acc.push({
          id: row.id,
          title: row.title,
          description: row.description,
          youtubeUrl: row.youtubeUrl,
          thumbnailUrl: row.thumbnailUrl,
          duration: row.duration,
          views: row.views,
          likes: row.likes,
          source: row.source,
          publishedAt: row.publishedAt,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          categories: row.categoryId ? [{ id: row.categoryId, name: row.categoryName }] : []
        });
      }
      return acc;
    }, [] as any[]);

    return NextResponse.json({
      videos: videosWithCategories,
      pagination: {
        page,
        limit,
        total: videosWithCategories.length,
      },
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      youtubeUrl,
      thumbnailUrl,
      categories: categoryIds, // Array de IDs das categorias
      duration,
      status = "draft",
    } = body;

    if (!title || !youtubeUrl || !categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json(
        { error: "Title, YouTube URL, and at least one category are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const publishedAt = status === "published" ? now : null;

    // Criar o vídeo
    const newVideo = await db
      .insert(videos)
      .values({
        title,
        description: description || "",
        youtubeUrl,
        thumbnailUrl: thumbnailUrl || "",
        duration: duration || "",
        source: "YouTube",
        status,
        publishedAt,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const videoId = newVideo[0].id;

    // Associar categorias ao vídeo
    const videoCategoryInserts = categoryIds.map((categoryId: number) => ({
      videoId,
      categoryId,
      createdAt: now,
    }));

    await db.insert(videoCategories).values(videoCategoryInserts);

    // Buscar o vídeo criado com suas categorias
    const videoWithCategories = await db
      .select({
        id: videos.id,
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
        categoryId: categories.id,
        categoryName: categories.name,
      })
      .from(videos)
      .leftJoin(videoCategories, eq(videos.id, videoCategories.videoId))
      .leftJoin(categories, eq(videoCategories.categoryId, categories.id))
      .where(eq(videos.id, videoId));

    // Agrupar categorias
    const categoriesList = videoWithCategories
      .filter(row => row.categoryId)
      .map(row => ({
        id: row.categoryId,
        name: row.categoryName
      }));

    const result = {
      ...newVideo[0],
      categories: categoriesList
    };

    return NextResponse.json({
      video: result,
      message: "Video created successfully",
    });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}