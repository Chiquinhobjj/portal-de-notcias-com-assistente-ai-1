import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { 
          error: 'Slug is required',
          code: 'MISSING_SLUG'
        },
        { status: 400 }
      );
    }

    // Fetch the article by slug, filtering for published status
    const article = await db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.slug, slug),
          eq(articles.status, 'published')
        )
      )
      .limit(1);

    if (article.length === 0) {
      return NextResponse.json(
        { 
          error: 'Article not found or not published',
          code: 'ARTICLE_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Increment views count
    await db
      .update(articles)
      .set({
        views: (article[0].views || 0) + 1,
        updatedAt: new Date().toISOString()
      })
      .where(eq(articles.id, article[0].id));

    // Return the article with incremented views count
    const updatedArticle = {
      ...article[0],
      views: (article[0].views || 0) + 1
    };

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error('GET article by slug error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}