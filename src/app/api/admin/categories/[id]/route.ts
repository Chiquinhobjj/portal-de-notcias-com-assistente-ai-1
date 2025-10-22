import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';

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

    const categoryId = parseInt(id);
    const updates = await request.json();

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: 'Category not found', code: 'CATEGORY_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate uniqueness for name or slug if being updated
    if (updates.name || updates.slug) {
      const conditions = [];
      
      if (updates.name) {
        conditions.push(eq(categories.name, updates.name.trim()));
      }
      
      if (updates.slug) {
        conditions.push(eq(categories.slug, updates.slug.trim()));
      }

      const duplicates = await db
        .select()
        .from(categories)
        .where(
          and(
            or(...conditions),
            // Exclude the current category from the check
            eq(categories.id, categoryId)
          )
        )
        .limit(1);

      // Check if any duplicate exists that is NOT the current category
      const allDuplicates = await db
        .select()
        .from(categories)
        .where(or(...conditions));

      const otherDuplicates = allDuplicates.filter(cat => cat.id !== categoryId);

      if (otherDuplicates.length > 0) {
        const duplicate = otherDuplicates[0];
        if (updates.name && duplicate.name === updates.name.trim()) {
          return NextResponse.json(
            { error: 'Category name already exists', code: 'DUPLICATE_NAME' },
            { status: 400 }
          );
        }
        if (updates.slug && duplicate.slug === updates.slug.trim()) {
          return NextResponse.json(
            { error: 'Category slug already exists', code: 'DUPLICATE_SLUG' },
            { status: 400 }
          );
        }
      }
    }

    // Sanitize string inputs
    const sanitizedUpdates: any = {};
    
    if (updates.name !== undefined) {
      sanitizedUpdates.name = updates.name.trim();
    }
    
    if (updates.slug !== undefined) {
      sanitizedUpdates.slug = updates.slug.trim();
    }
    
    if (updates.description !== undefined) {
      sanitizedUpdates.description = updates.description?.trim() || null;
    }
    
    if (updates.color !== undefined) {
      sanitizedUpdates.color = updates.color?.trim() || null;
    }
    
    if (updates.icon !== undefined) {
      sanitizedUpdates.icon = updates.icon?.trim() || null;
    }
    
    if (updates.displayOrder !== undefined) {
      sanitizedUpdates.displayOrder = updates.displayOrder;
    }
    
    if (updates.active !== undefined) {
      sanitizedUpdates.active = updates.active;
    }

    const updatedCategory = await db
      .update(categories)
      .set(sanitizedUpdates)
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json(updatedCategory[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
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

    const categoryId = parseInt(id);

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: 'Category not found', code: 'CATEGORY_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedCategory = await db
      .delete(categories)
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json(
      {
        message: 'Category deleted successfully',
        category: deletedCategory[0]
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}