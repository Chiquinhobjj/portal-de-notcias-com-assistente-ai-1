import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { videos } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    
    // Filter parameters
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Sorting parameters
    const sortBy = searchParams.get('sort') ?? 'createdAt';
    const order = searchParams.get('order') ?? 'desc';
    
    // Validate sort field
    const validSortFields = ['views', 'createdAt', 'likes'];
    if (!validSortFields.includes(sortBy)) {
      return NextResponse.json({
        error: 'Invalid sort field. Valid options: views, createdAt, likes',
        code: 'INVALID_SORT_FIELD'
      }, { status: 400 });
    }
    
    // Validate order direction
    if (order !== 'asc' && order !== 'desc') {
      return NextResponse.json({
        error: 'Invalid order direction. Valid options: asc, desc',
        code: 'INVALID_ORDER'
      }, { status: 400 });
    }
    
    // Build query
    let query = db.select().from(videos);
    
    // Build where conditions
    const conditions = [];
    
    // Category filter removed - videos now use many-to-many relationship
    // if (category) {
    //   conditions.push(eq(videos.category, category));
    // }
    
    // Add search filter (case-insensitive on title and description)
    if (search) {
      const searchLower = search.toLowerCase();
      conditions.push(
        or(
          like(videos.title, `%${searchLower}%`),
          like(videos.description, `%${searchLower}%`)
        )
      );
    }
    
    // Apply where conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions)) as typeof query;
    }
    
    // Apply sorting
    const sortColumn = sortBy === 'views' 
      ? videos.views 
      : sortBy === 'likes' 
        ? videos.likes 
        : videos.createdAt;
    
    query = query.orderBy(order === 'asc' ? asc(sortColumn) : desc(sortColumn)) as typeof query;
    
    // Apply pagination
    query = query.limit(limit).offset(offset) as typeof query;
    
    // Execute query
    const results = await query;
    
    return NextResponse.json(results, { status: 200 });
    
  } catch (error) {
    console.error('GET videos error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}