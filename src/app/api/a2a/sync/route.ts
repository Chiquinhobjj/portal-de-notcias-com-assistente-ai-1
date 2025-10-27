import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { articles, ads, categories } from '@/db/schema';
import { desc, gte, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

type SyncType = 'push' | 'pull';
type Resource = 'articles' | 'ads' | 'categories';

interface A2ASyncRequest {
  agent_id: string;
  sync_type: SyncType;
  resource: Resource;
  data?: any[];
  timestamp?: string;
}

interface A2ASuccessResponse {
  success: true;
  agent_id: string;
  sync_id: string;
  timestamp: string;
  data?: any[];
  message?: string;
}

interface A2AErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    agent_id: string;
  };
}

const AGENT_ID = 'cms_server';

function generateSyncId(): string {
  return `sync_${Date.now()}_${randomUUID().substring(0, 8)}`;
}

function getTableByResource(resource: Resource) {
  switch (resource) {
    case 'articles':
      return articles;
    case 'ads':
      return ads;
    case 'categories':
      return categories;
    default:
      return null;
  }
}

function validateArticleData(data: any): boolean {
  return !!(
    data.title &&
    data.slug &&
    data.description &&
    data.content &&
    data.imageUrl &&
    data.category &&
    data.source
  );
}

function validateAdData(data: any): boolean {
  return !!(
    data.title &&
    data.type &&
    data.variant &&
    data.size &&
    data.contentUrl &&
    data.position
  );
}

function validateCategoryData(data: any): boolean {
  return !!(data.name && data.slug);
}

function validateResourceData(resource: Resource, data: any): boolean {
  switch (resource) {
    case 'articles':
      return validateArticleData(data);
    case 'ads':
      return validateAdData(data);
    case 'categories':
      return validateCategoryData(data);
    default:
      return false;
  }
}

function sanitizeArticleData(data: any) {
  return {
    title: data.title.trim(),
    slug: data.slug.trim().toLowerCase(),
    description: data.description.trim(),
    content: data.content,
    imageUrl: data.imageUrl.trim(),
    category: data.category.trim(),
    source: data.source.trim(),
    author: data.author?.trim() || null,
    tags: data.tags?.trim() || null,
    status: data.status || 'draft',
    featured: data.featured || false,
    views: data.views || 0,
    publishedAt: data.publishedAt || null,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function sanitizeAdData(data: any) {
  return {
    title: data.title.trim(),
    type: data.type.trim(),
    variant: data.variant.trim(),
    size: data.size.trim(),
    contentUrl: data.contentUrl.trim(),
    linkUrl: data.linkUrl?.trim() || null,
    position: data.position.trim(),
    status: data.status || 'active',
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    clicks: data.clicks || 0,
    impressions: data.impressions || 0,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function sanitizeCategoryData(data: any) {
  return {
    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase(),
    description: data.description?.trim() || null,
    color: data.color?.trim() || null,
    icon: data.icon?.trim() || null,
    displayOrder: data.displayOrder || 0,
    active: data.active !== undefined ? data.active : true,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

function sanitizeResourceData(resource: Resource, data: any) {
  switch (resource) {
    case 'articles':
      return sanitizeArticleData(data);
    case 'ads':
      return sanitizeAdData(data);
    case 'categories':
      return sanitizeCategoryData(data);
    default:
      return data;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: A2ASyncRequest = await request.json();

    // Validate agent_id
    if (!body.agent_id) {
      const errorResponse: A2AErrorResponse = {
        success: false,
        error: {
          code: 'MISSING_AGENT_ID',
          message: 'Agent ID is required for A2A synchronization',
          agent_id: AGENT_ID,
        },
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Validate sync_type
    if (!body.sync_type || !['push', 'pull'].includes(body.sync_type)) {
      const errorResponse: A2AErrorResponse = {
        success: false,
        error: {
          code: 'INVALID_SYNC_TYPE',
          message: 'Sync type must be either "push" or "pull"',
          agent_id: AGENT_ID,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate resource
    if (!body.resource || !['articles', 'ads', 'categories'].includes(body.resource)) {
      const errorResponse: A2AErrorResponse = {
        success: false,
        error: {
          code: 'INVALID_RESOURCE',
          message: 'Resource must be one of: articles, ads, categories',
          agent_id: AGENT_ID,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const syncId = generateSyncId();
    const timestamp = new Date().toISOString();
    const table = getTableByResource(body.resource);

    if (!table) {
      const errorResponse: A2AErrorResponse = {
        success: false,
        error: {
          code: 'UNKNOWN_RESOURCE',
          message: `Unknown resource: ${body.resource}`,
          agent_id: AGENT_ID,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Log sync operation
    console.log(`[A2A SYNC] ${body.sync_type.toUpperCase()} - Agent: ${body.agent_id}, Resource: ${body.resource}, Sync ID: ${syncId}, Timestamp: ${timestamp}`);

    if (body.sync_type === 'push') {
      // Handle PUSH: receive and validate data
      if (!body.data || !Array.isArray(body.data)) {
        const errorResponse: A2AErrorResponse = {
          success: false,
          error: {
            code: 'INVALID_DATA',
            message: 'Data array is required for push operations',
            agent_id: AGENT_ID,
          },
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      if (body.data.length === 0) {
        const successResponse: A2ASuccessResponse = {
          success: true,
          agent_id: AGENT_ID,
          sync_id: syncId,
          timestamp,
          message: 'No data to sync',
        };
        console.log(`[A2A SYNC] ${syncId} - No data received`);
        return NextResponse.json(successResponse, { status: 200 });
      }

      // Validate all records
      const invalidRecords: number[] = [];
      body.data.forEach((record, index) => {
        if (!validateResourceData(body.resource, record)) {
          invalidRecords.push(index);
        }
      });

      if (invalidRecords.length > 0) {
        const errorResponse: A2AErrorResponse = {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: `Validation failed for records at indices: ${invalidRecords.join(', ')}`,
            agent_id: AGENT_ID,
          },
        };
        console.error(`[A2A SYNC] ${syncId} - Validation failed for ${invalidRecords.length} records`);
        return NextResponse.json(errorResponse, { status: 400 });
      }

      // Sanitize and insert records
      const sanitizedData = body.data.map((record) =>
        sanitizeResourceData(body.resource, record)
      );

      try {
        const insertedRecords = await db.insert(table).values(sanitizedData).returning();

        const successResponse: A2ASuccessResponse = {
          success: true,
          agent_id: AGENT_ID,
          sync_id: syncId,
          timestamp,
          data: insertedRecords,
          message: `Successfully synced ${insertedRecords.length} ${body.resource}`,
        };

        console.log(`[A2A SYNC] ${syncId} - Successfully pushed ${insertedRecords.length} ${body.resource}`);
        return NextResponse.json(successResponse, { status: 200 });
      } catch (dbError: any) {
        console.error(`[A2A SYNC] ${syncId} - Database error:`, dbError);

        const errorResponse: A2AErrorResponse = {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: `Failed to insert ${body.resource}: ${dbError.message}`,
            agent_id: AGENT_ID,
          },
        };
        return NextResponse.json(errorResponse, { status: 500 });
      }
    } else if (body.sync_type === 'pull') {
      // Handle PULL: send latest updates since timestamp
      try {
        let query = db.select().from(table);

        if (body.timestamp) {
          // Validate timestamp
          const sinceDate = new Date(body.timestamp);
          if (isNaN(sinceDate.getTime())) {
            const errorResponse: A2AErrorResponse = {
              success: false,
              error: {
                code: 'INVALID_TIMESTAMP',
                message: 'Invalid ISO timestamp format',
                agent_id: AGENT_ID,
              },
            };
            return NextResponse.json(errorResponse, { status: 400 });
          }

          // Filter by updatedAt or createdAt depending on resource
          if (body.resource === 'categories') {
            query = query.where(gte(table.createdAt, body.timestamp)) as typeof query;
          } else {
            // For articles and ads, use updatedAt if available, otherwise createdAt
            const dateField = 'updatedAt' in table ? table.updatedAt : table.createdAt;
            query = query.where(gte(dateField, body.timestamp)) as typeof query;
          }
        }

        const results = await query.orderBy(desc(table.id));

        const successResponse: A2ASuccessResponse = {
          success: true,
          agent_id: AGENT_ID,
          sync_id: syncId,
          timestamp,
          data: results,
          message: `Retrieved ${results.length} ${body.resource}`,
        };

        console.log(`[A2A SYNC] ${syncId} - Successfully pulled ${results.length} ${body.resource} since ${body.timestamp || 'beginning'}`);
        return NextResponse.json(successResponse, { status: 200 });
      } catch (dbError: any) {
        console.error(`[A2A SYNC] ${syncId} - Database error:`, dbError);

        const errorResponse: A2AErrorResponse = {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: `Failed to retrieve ${body.resource}: ${dbError.message}`,
            agent_id: AGENT_ID,
          },
        };
        return NextResponse.json(errorResponse, { status: 500 });
      }
    }

    // This should never be reached due to earlier validation
    const errorResponse: A2AErrorResponse = {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        agent_id: AGENT_ID,
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  } catch (error: any) {
    console.error('[A2A SYNC] Error:', error);

    const errorResponse: A2AErrorResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: `Internal server error: ${error.message}`,
        agent_id: AGENT_ID,
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}