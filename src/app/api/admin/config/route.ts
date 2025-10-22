import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adminConfig } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const configs = await db.select()
      .from(adminConfig)
      .orderBy(asc(adminConfig.key));

    return NextResponse.json(configs, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message,
        code: 'DATABASE_ERROR'
      },
      { status: 500 }
    );
  }
}