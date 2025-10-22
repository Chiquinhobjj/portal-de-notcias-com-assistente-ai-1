import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ads } from '@/db/schema';
import { eq, and, lte, gte, or, isNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    
    const currentDate = new Date().toISOString();
    
    // Build the query conditions
    const conditions = [eq(ads.status, 'active')];
    
    // Add position filter if provided
    if (position) {
      conditions.push(eq(ads.position, position));
    }
    
    // Date range conditions: current date should be between startDate and endDate
    // If startDate is null or current date >= startDate
    // If endDate is null or current date <= endDate
    conditions.push(
      or(
        isNull(ads.startDate),
        lte(ads.startDate, currentDate)
      )!
    );
    
    conditions.push(
      or(
        isNull(ads.endDate),
        gte(ads.endDate, currentDate)
      )!
    );
    
    // Execute query with all conditions
    const activeAds = await db
      .select()
      .from(ads)
      .where(and(...conditions))
      .orderBy(ads.position);
    
    return NextResponse.json(activeAds, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}