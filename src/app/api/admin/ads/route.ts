import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ads } from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single ad fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const ad = await db
        .select()
        .from(ads)
        .where(eq(ads.id, parseInt(id)))
        .limit(1);

      if (ad.length === 0) {
        return NextResponse.json(
          { error: 'Ad not found', code: 'AD_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(ad[0], { status: 200 });
    }

    // List ads with pagination, filtering, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const sortField = searchParams.get('sort') ?? 'createdAt';
    const sortOrder = searchParams.get('order') ?? 'desc';

    // Build filters
    const filters = [];
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const position = searchParams.get('position');
    const variant = searchParams.get('variant');

    if (type) filters.push(eq(ads.type, type));
    if (status) filters.push(eq(ads.status, status));
    if (position) filters.push(eq(ads.position, position));
    if (variant) filters.push(eq(ads.variant, variant));

    let query = db.select().from(ads);

    if (filters.length > 0) {
      query = query.where(and(...filters)) as typeof query;
    }

    // Apply sorting - use createdAt as default
    query = query.orderBy(sortOrder === 'asc' ? asc(ads.createdAt) : desc(ads.createdAt)) as typeof query;

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, type, variant, size, contentUrl, linkUrl, position, status, startDate, endDate } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required', code: 'MISSING_TYPE' },
        { status: 400 }
      );
    }

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant is required', code: 'MISSING_VARIANT' },
        { status: 400 }
      );
    }

    if (!size) {
      return NextResponse.json(
        { error: 'Size is required', code: 'MISSING_SIZE' },
        { status: 400 }
      );
    }

    if (!contentUrl) {
      return NextResponse.json(
        { error: 'Content URL is required', code: 'MISSING_CONTENT_URL' },
        { status: 400 }
      );
    }

    if (!position) {
      return NextResponse.json(
        { error: 'Position is required', code: 'MISSING_POSITION' },
        { status: 400 }
      );
    }

    // Prepare ad data with defaults
    const now = new Date().toISOString();
    const adData = {
      title: title.trim(),
      type: type.trim(),
      variant: variant.trim(),
      size: size.trim(),
      contentUrl: contentUrl.trim(),
      linkUrl: linkUrl ? linkUrl.trim() : null,
      position: position.trim(),
      status: status ? status.trim() : 'active',
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      clicks: 0,
      impressions: 0,
      createdAt: now,
      updatedAt: now,
    };

    const newAd = await db.insert(ads).values(adData).returning();

    return NextResponse.json(newAd[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if ad exists
    const existingAd = await db
      .select()
      .from(ads)
      .where(eq(ads.id, parseInt(id)))
      .limit(1);

    if (existingAd.length === 0) {
      return NextResponse.json(
        { error: 'Ad not found', code: 'AD_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: Record<string, any> = {};

    // Build update object with only provided fields
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.type !== undefined) updates.type = body.type.trim();
    if (body.variant !== undefined) updates.variant = body.variant.trim();
    if (body.size !== undefined) updates.size = body.size.trim();
    if (body.contentUrl !== undefined) updates.contentUrl = body.contentUrl.trim();
    if (body.linkUrl !== undefined) updates.linkUrl = body.linkUrl ? body.linkUrl.trim() : null;
    if (body.position !== undefined) updates.position = body.position.trim();
    if (body.status !== undefined) updates.status = body.status.trim();
    if (body.startDate !== undefined) updates.startDate = body.startDate;
    if (body.endDate !== undefined) updates.endDate = body.endDate;
    if (body.clicks !== undefined) updates.clicks = body.clicks;
    if (body.impressions !== undefined) updates.impressions = body.impressions;

    // Always update timestamp
    updates.updatedAt = new Date().toISOString();

    const updated = await db
      .update(ads)
      .set(updates)
      .where(eq(ads.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if ad exists before deleting
    const existingAd = await db
      .select()
      .from(ads)
      .where(eq(ads.id, parseInt(id)))
      .limit(1);

    if (existingAd.length === 0) {
      return NextResponse.json(
        { error: 'Ad not found', code: 'AD_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(ads)
      .where(eq(ads.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Ad deleted successfully',
        ad: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}