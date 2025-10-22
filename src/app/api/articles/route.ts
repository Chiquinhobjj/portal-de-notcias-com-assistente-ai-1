import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq, and, like, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    
    // Filter parameters
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    
    // Sort parameters
    const sortField = searchParams.get('sort') ?? 'publishedAt';
    const sortOrder = searchParams.get('order') ?? 'desc';
    
    // Build query conditions
    const conditions = [eq(articles.status, 'published')];
    
    // Add category filter
    if (category) {
      conditions.push(eq(articles.category, category));
    }
    
    // Add featured filter
    if (featured !== null && featured !== undefined) {
      const isFeatured = featured === 'true' || featured === '1';
      conditions.push(eq(articles.featured, isFeatured));
    }
    
    // Add search condition
    if (search) {
      const searchCondition = or(
        like(articles.title, `%${search}%`),
        like(articles.description, `%${search}%`)
      );
      conditions.push(searchCondition);
    }
    
    // Build the query
    let query = db.select().from(articles);
    
    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    const sortColumn = sortField === 'publishedAt' ? articles.publishedAt :
                      sortField === 'createdAt' ? articles.createdAt :
                      sortField === 'views' ? articles.views :
                      sortField === 'title' ? articles.title :
                      articles.publishedAt;
    
    query = query.orderBy(
      sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn)
    );
    
    // Apply pagination
    const results = await query.limit(limit).offset(offset);
    
    return NextResponse.json(results, { status: 200 });
    
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}