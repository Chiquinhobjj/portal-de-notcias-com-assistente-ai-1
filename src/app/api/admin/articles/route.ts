import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq, like, and, or, desc, asc, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single article fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const article = await db.select()
        .from(articles)
        .where(eq(articles.id, parseInt(id)))
        .limit(1);

      if (article.length === 0) {
        return NextResponse.json(
          { error: 'Article not found', code: 'ARTICLE_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(article[0], { status: 200 });
    }

    // List articles with filtering, search, and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const sortField = searchParams.get('sort') ?? 'createdAt';
    const sortOrder = searchParams.get('order') ?? 'desc';

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(articles.title, `%${search}%`),
          like(articles.description, `%${search}%`),
          like(articles.content, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(articles.status, status));
    }

    if (category) {
      conditions.push(eq(articles.category, category));
    }

    if (featured !== null && featured !== undefined) {
      const featuredBool = featured === 'true' || featured === '1';
      conditions.push(eq(articles.featured, featuredBool));
    }

    // Build query
    let query = db.select().from(articles);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    // Apply sorting
    const orderColumn = sortField === 'title' ? articles.title :
                       sortField === 'publishedAt' ? articles.publishedAt :
                       sortField === 'views' ? articles.views :
                       articles.createdAt;

    query = sortOrder === 'asc' 
      ? query.orderBy(asc(orderColumn)) as typeof query
      : query.orderBy(desc(orderColumn)) as typeof query;

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    // Get total count for pagination
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(articles);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions)) as typeof countQuery;
    }
    const totalResult = await countQuery;
    const total = totalResult[0]?.count ?? 0;

    return NextResponse.json({
      articles: results,
      total,
      limit,
      offset
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const { title, slug, description, content, imageUrl, category, source } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!slug || !slug.trim()) {
      return NextResponse.json(
        { error: 'Slug is required', code: 'MISSING_SLUG' },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: 'Description is required', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    if (!imageUrl || !imageUrl.trim()) {
      return NextResponse.json(
        { error: 'Image URL is required', code: 'MISSING_IMAGE_URL' },
        { status: 400 }
      );
    }

    if (!category || !category.trim()) {
      return NextResponse.json(
        { error: 'Category is required', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    if (!source || !source.trim()) {
      return NextResponse.json(
        { error: 'Source is required', code: 'MISSING_SOURCE' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingArticle = await db.select()
      .from(articles)
      .where(eq(articles.slug, slug.trim()))
      .limit(1);

    if (existingArticle.length > 0) {
      return NextResponse.json(
        { error: 'Slug already exists', code: 'SLUG_EXISTS' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const now = new Date().toISOString();
    const insertData = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim(),
      category: category.trim(),
      source: source.trim(),
      author: body.author ? body.author.trim() : null,
      tags: body.tags ? body.tags.trim() : null,
      status: body.status ? body.status.trim() : 'draft',
      featured: body.featured === true || body.featured === 'true' || body.featured === 1 ? true : false,
      views: 0,
      publishedAt: body.publishedAt || null,
      createdAt: now,
      updatedAt: now
    };

    const newArticle = await db.insert(articles)
      .values(insertData)
      .returning();

    return NextResponse.json(newArticle[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if article exists
    const existingArticle = await db.select()
      .from(articles)
      .where(eq(articles.id, parseInt(id)))
      .limit(1);

    if (existingArticle.length === 0) {
      return NextResponse.json(
        { error: 'Article not found', code: 'ARTICLE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and prepare updates
    if (body.title !== undefined) {
      if (!body.title.trim()) {
        return NextResponse.json(
          { error: 'Title cannot be empty', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updates.title = body.title.trim();
    }

    if (body.slug !== undefined) {
      if (!body.slug.trim()) {
        return NextResponse.json(
          { error: 'Slug cannot be empty', code: 'INVALID_SLUG' },
          { status: 400 }
        );
      }

      // Check if new slug conflicts with existing articles
      if (body.slug.trim() !== existingArticle[0].slug) {
        const slugExists = await db.select()
          .from(articles)
          .where(eq(articles.slug, body.slug.trim()))
          .limit(1);

        if (slugExists.length > 0) {
          return NextResponse.json(
            { error: 'Slug already exists', code: 'SLUG_EXISTS' },
            { status: 400 }
          );
        }
      }

      updates.slug = body.slug.trim();
    }

    if (body.description !== undefined) {
      if (!body.description.trim()) {
        return NextResponse.json(
          { error: 'Description cannot be empty', code: 'INVALID_DESCRIPTION' },
          { status: 400 }
        );
      }
      updates.description = body.description.trim();
    }

    if (body.content !== undefined) {
      if (!body.content.trim()) {
        return NextResponse.json(
          { error: 'Content cannot be empty', code: 'INVALID_CONTENT' },
          { status: 400 }
        );
      }
      updates.content = body.content.trim();
    }

    if (body.imageUrl !== undefined) {
      if (!body.imageUrl.trim()) {
        return NextResponse.json(
          { error: 'Image URL cannot be empty', code: 'INVALID_IMAGE_URL' },
          { status: 400 }
        );
      }
      updates.imageUrl = body.imageUrl.trim();
    }

    if (body.category !== undefined) {
      if (!body.category.trim()) {
        return NextResponse.json(
          { error: 'Category cannot be empty', code: 'INVALID_CATEGORY' },
          { status: 400 }
        );
      }
      updates.category = body.category.trim();
    }

    if (body.source !== undefined) {
      if (!body.source.trim()) {
        return NextResponse.json(
          { error: 'Source cannot be empty', code: 'INVALID_SOURCE' },
          { status: 400 }
        );
      }
      updates.source = body.source.trim();
    }

    if (body.author !== undefined) {
      updates.author = body.author ? body.author.trim() : null;
    }

    if (body.tags !== undefined) {
      updates.tags = body.tags ? body.tags.trim() : null;
    }

    if (body.status !== undefined) {
      updates.status = body.status.trim();
    }

    if (body.featured !== undefined) {
      updates.featured = body.featured === true || body.featured === 'true' || body.featured === 1 ? true : false;
    }

    if (body.views !== undefined) {
      updates.views = parseInt(body.views);
    }

    if (body.publishedAt !== undefined) {
      updates.publishedAt = body.publishedAt;
    }

    // Always update the updatedAt timestamp
    updates.updatedAt = new Date().toISOString();

    const updatedArticle = await db.update(articles)
      .set(updates)
      .where(eq(articles.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedArticle[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if article exists
    const existingArticle = await db.select()
      .from(articles)
      .where(eq(articles.id, parseInt(id)))
      .limit(1);

    if (existingArticle.length === 0) {
      return NextResponse.json(
        { error: 'Article not found', code: 'ARTICLE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedArticle = await db.delete(articles)
      .where(eq(articles.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Article deleted successfully',
      article: deletedArticle[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}