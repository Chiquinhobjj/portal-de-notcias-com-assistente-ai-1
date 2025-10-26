import { NextRequest, NextResponse } from "next/server";

// GET - Fetch comments for a video
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const videoId = parseInt(id);

    if (isNaN(videoId)) {
      return NextResponse.json(
        { error: "Invalid video ID" },
        { status: 400 }
      );
    }

    // TODO: Implement actual comment fetching with database
    // For now, return mock comments
    const mockComments = [
      {
        id: 1,
        author: "Usuário123",
        text: "Muito bom esse vídeo! 👏",
        timestamp: Date.now() - 3600000
      },
      {
        id: 2,
        author: "Maria_Silva",
        text: "Adorei a explicação, muito clara!",
        timestamp: Date.now() - 1800000
      },
      {
        id: 3,
        author: "João_Pedro",
        text: "Quando sai a próxima parte?",
        timestamp: Date.now() - 900000
      }
    ];

    return NextResponse.json(mockComments);

  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const videoId = parseInt(id);
    const body = await request.json();
    const { text } = body;

    if (isNaN(videoId)) {
      return NextResponse.json(
        { error: "Invalid video ID" },
        { status: 400 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 }
      );
    }

    if (text.length > 240) {
      return NextResponse.json(
        { error: "Comment too long (max 240 characters)" },
        { status: 400 }
      );
    }

    // TODO: Implement actual comment saving with database
    // For now, return success with mock comment
    const newComment = {
      id: Date.now(),
      author: "Você",
      text: text.trim(),
      timestamp: Date.now()
    };

    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
