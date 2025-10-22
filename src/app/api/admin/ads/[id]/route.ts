import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ads } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
        { error: 'Ad not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(ad[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
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
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check if ad exists
    const existingAd = await db
      .select()
      .from(ads)
      .where(eq(ads.id, parseInt(id)))
      .limit(1);

    if (existingAd.length === 0) {
      return NextResponse.json(
        { error: 'Ad not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Remove id from update data if present
    delete updateData.id;
    delete updateData.createdAt;

    // Validate required fields if they are being updated
    if ('title' in body && !body.title?.trim()) {
      return NextResponse.json(
        { error: 'Title cannot be empty', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    if ('type' in body && !body.type?.trim()) {
      return NextResponse.json(
        { error: 'Type cannot be empty', code: 'INVALID_TYPE' },
        { status: 400 }
      );
    }

    if ('variant' in body && !body.variant?.trim()) {
      return NextResponse.json(
        { error: 'Variant cannot be empty', code: 'INVALID_VARIANT' },
        { status: 400 }
      );
    }

    if ('size' in body && !body.size?.trim()) {
      return NextResponse.json(
        { error: 'Size cannot be empty', code: 'INVALID_SIZE' },
        { status: 400 }
      );
    }

    if ('contentUrl' in body && !body.contentUrl?.trim()) {
      return NextResponse.json(
        { error: 'Content URL cannot be empty', code: 'INVALID_CONTENT_URL' },
        { status: 400 }
      );
    }

    if ('position' in body && !body.position?.trim()) {
      return NextResponse.json(
        { error: 'Position cannot be empty', code: 'INVALID_POSITION' },
        { status: 400 }
      );
    }

    // Sanitize string fields
    if ('title' in updateData) updateData.title = (updateData.title as string).trim();
    if ('type' in updateData) updateData.type = (updateData.type as string).trim();
    if ('variant' in updateData) updateData.variant = (updateData.variant as string).trim();
    if ('size' in updateData) updateData.size = (updateData.size as string).trim();
    if ('contentUrl' in updateData) updateData.contentUrl = (updateData.contentUrl as string).trim();
    if ('linkUrl' in updateData && updateData.linkUrl) updateData.linkUrl = (updateData.linkUrl as string).trim();
    if ('position' in updateData) updateData.position = (updateData.position as string).trim();
    if ('status' in updateData) updateData.status = (updateData.status as string).trim();

    const updated = await db
      .update(ads)
      .set(updateData)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
        { error: 'Ad not found', code: 'NOT_FOUND' },
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