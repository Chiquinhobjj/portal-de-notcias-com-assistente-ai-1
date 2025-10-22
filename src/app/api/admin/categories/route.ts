import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { asc, eq, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.displayOrder));

    return NextResponse.json(allCategories, { status: 200 });
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
    const { name, slug, description, color, icon, displayOrder, active } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        {
          error: 'Name and slug are required',
          code: 'MISSING_REQUIRED_FIELDS',
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedSlug = slug.trim().toLowerCase();

    // Check for duplicate name or slug
    const existingCategories = await db
      .select()
      .from(categories)
      .where(
        or(
          eq(categories.name, sanitizedName),
          eq(categories.slug, sanitizedSlug)
        )
      )
      .limit(1);

    if (existingCategories.length > 0) {
      const existingCategory = existingCategories[0];
      if (existingCategory.name === sanitizedName) {
        return NextResponse.json(
          {
            error: 'Category name already exists',
            code: 'DUPLICATE_NAME',
          },
          { status: 400 }
        );
      }
      if (existingCategory.slug === sanitizedSlug) {
        return NextResponse.json(
          {
            error: 'Category slug already exists',
            code: 'DUPLICATE_SLUG',
          },
          { status: 400 }
        );
      }
    }

    // Prepare data for insertion
    const newCategoryData: {
      name: string;
      slug: string;
      description?: string | null;
      color?: string | null;
      icon?: string | null;
      displayOrder: number;
      active: boolean;
      createdAt: string;
    } = {
      name: sanitizedName,
      slug: sanitizedSlug,
      displayOrder: displayOrder !== undefined ? displayOrder : 0,
      active: active !== undefined ? active : true,
      createdAt: new Date().toISOString(),
    };

    // Add optional fields if provided
    if (description !== undefined) {
      newCategoryData.description = description ? description.trim() : null;
    }
    if (color !== undefined) {
      newCategoryData.color = color ? color.trim() : null;
    }
    if (icon !== undefined) {
      newCategoryData.icon = icon ? icon.trim() : null;
    }

    // Insert new category
    const newCategory = await db
      .insert(categories)
      .values(newCategoryData)
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}