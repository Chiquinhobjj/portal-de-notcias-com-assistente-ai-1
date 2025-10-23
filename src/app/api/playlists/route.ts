import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { playlists } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const allPlaylists = await db.select()
      .from(playlists)
      .orderBy(desc(playlists.createdAt));

    return NextResponse.json(allPlaylists, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}