import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adminConfig } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await context.params;

    if (!key) {
      return NextResponse.json(
        { error: 'Config key is required', code: 'MISSING_KEY' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { value, description } = body;

    if (!value) {
      return NextResponse.json(
        { error: 'Value is required', code: 'MISSING_VALUE' },
        { status: 400 }
      );
    }

    // Check if config exists
    const existingConfig = await db
      .select()
      .from(adminConfig)
      .where(eq(adminConfig.key, key))
      .limit(1);

    let updatedConfig;

    if (existingConfig.length === 0) {
      // Create new config if it doesn't exist
      updatedConfig = await db
        .insert(adminConfig)
        .values({
          key,
          value,
          description: description || null,
          updatedAt: new Date().toISOString(),
        })
        .returning();
    } else {
      // Update existing config
      const updateData: {
        value: string;
        description?: string | null;
        updatedAt: string;
      } = {
        value,
        updatedAt: new Date().toISOString(),
      };

      if (description !== undefined) {
        updateData.description = description;
      }

      updatedConfig = await db
        .update(adminConfig)
        .set(updateData)
        .where(eq(adminConfig.key, key))
        .returning();
    }

    return NextResponse.json(updatedConfig[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}