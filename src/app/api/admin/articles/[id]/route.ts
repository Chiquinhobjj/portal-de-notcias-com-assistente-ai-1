import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid article ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const article = await db.select()
      .from(articles)
      .where(eq(articles.id, parseInt(id)))
      .limit(1);

    if (article.length === 0) {
      return NextResponse.json(
        { 
          error: 'Article not found',
          code: 'ARTICLE_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(article[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
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
          error: 'Valid article ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check if article exists
    const existingArticle = await db.select()
      .from(articles)
      .where(eq(articles.id, parseInt(id)))
      .limit(1);

    if (existingArticle.length === 0) {
      return NextResponse.json(
        { 
          error: 'Article not found',
          code: 'ARTICLE_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // If slug is being updated, check for uniqueness
    if (body.slug && body.slug !== existingArticle[0].slug) {
      const slugExists = await db.select()
        .from(articles)
        .where(
          and(
            eq(articles.slug, body.slug),
            or(
              eq(articles.id, parseInt(id))
            )
          )
        )
        .limit(1);

      if (slugExists.length > 0 && slugExists[0].id !== parseInt(id)) {
        return NextResponse.json(
          { 
            error: 'Article with this slug already exists',
            code: 'SLUG_EXISTS' 
          },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      ...body,
      updatedAt: new Date().toISOString()
    };

    // Update the article
    const updatedArticle = await db.update(articles)
      .set(updateData)
      .where(eq(articles.id, parseInt(id)))
      .returning();

    if (updatedArticle.length === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to update article',
          code: 'UPDATE_FAILED' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedArticle[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
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
          error: 'Valid article ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    // Check if article exists before deletion
    const existingArticle = await db.select()
      .from(articles)
      .where(eq(articles.id, parseInt(id)))
      .limit(1);

    if (existingArticle.length === 0) {
      return NextResponse.json(
        { 
          error: 'Article not found',
          code: 'ARTICLE_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Delete the article
    const deletedArticle = await db.delete(articles)
      .where(eq(articles.id, parseInt(id)))
      .returning();

    if (deletedArticle.length === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to delete article',
          code: 'DELETE_FAILED' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Article deleted successfully',
        article: deletedArticle[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}