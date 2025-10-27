import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { articles, ads, categories, adminConfig } from '@/db/schema';
import { eq, and, desc, like } from 'drizzle-orm';

type MCPAction = 'query' | 'get' | 'search';
type MCPResource = 'articles' | 'ads' | 'categories' | 'config';

interface MCPRequest {
  action: MCPAction;
  resource: MCPResource;
  filters?: Record<string, any>;
  limit?: number;
  id?: number;
  search?: string;
}

interface MCPResponse {
  success: boolean;
  data?: any;
  meta?: {
    count: number;
    resource: string;
    action: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: MCPRequest = await request.json();
    const { action, resource, filters = {}, limit = 10, id, search } = body;

    // Validate action
    const validActions: MCPAction[] = ['query', 'get', 'search'];
    if (!action || !validActions.includes(action)) {
      const response: MCPResponse = {
        success: false,
        error: {
          code: 'INVALID_ACTION',
          message: `Invalid action. Supported actions: ${validActions.join(', ')}`
        }
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate resource
    const validResources: MCPResource[] = ['articles', 'ads', 'categories', 'config'];
    if (!resource || !validResources.includes(resource)) {
      const response: MCPResponse = {
        success: false,
        error: {
          code: 'INVALID_RESOURCE',
          message: `Invalid resource. Supported resources: ${validResources.join(', ')}`
        }
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate limit
    const queryLimit = Math.min(Math.max(parseInt(String(limit)), 1), 100);

    let data: any[] = [];
    let count = 0;

    // Handle different resources
    switch (resource) {
      case 'articles': {
        if (action === 'get' && id) {
          // Get single article by ID
          const result = await db.select()
            .from(articles)
            .where(eq(articles.id, id))
            .limit(1);
          data = result;
          count = result.length;
        } else if (action === 'search' && search) {
          // Search articles by title or description
          const searchConditions = like(articles.title, `%${search}%`);
          const result = await db.select()
            .from(articles)
            .where(searchConditions)
            .orderBy(desc(articles.publishedAt))
            .limit(queryLimit);
          data = result;
          count = result.length;
        } else {
          // Query articles with filters
          const conditions = [];
          
          if (filters.status) {
            conditions.push(eq(articles.status, filters.status));
          }
          if (filters.category) {
            conditions.push(eq(articles.category, filters.category));
          }
          if (filters.featured !== undefined) {
            conditions.push(eq(articles.featured, Boolean(filters.featured)));
          }

          let query = db.select().from(articles);
          
          if (conditions.length > 0) {
            query = query.where(and(...conditions)) as typeof query;
          }
          
          const result = await query
            .orderBy(desc(articles.publishedAt))
            .limit(queryLimit);
          
          data = result;
          count = result.length;
        }
        break;
      }

      case 'ads': {
        if (action === 'get' && id) {
          // Get single ad by ID
          const result = await db.select()
            .from(ads)
            .where(eq(ads.id, id))
            .limit(1);
          data = result;
          count = result.length;
        } else if (action === 'search' && search) {
          // Search ads by title
          const searchConditions = like(ads.title, `%${search}%`);
          const result = await db.select()
            .from(ads)
            .where(searchConditions)
            .orderBy(desc(ads.createdAt))
            .limit(queryLimit);
          data = result;
          count = result.length;
        } else {
          // Query ads with filters
          const conditions = [];
          
          if (filters.status) {
            conditions.push(eq(ads.status, filters.status));
          }
          if (filters.position) {
            conditions.push(eq(ads.position, filters.position));
          }
          if (filters.type) {
            conditions.push(eq(ads.type, filters.type));
          }

          let query = db.select().from(ads);
          
          if (conditions.length > 0) {
            query = query.where(and(...conditions)) as typeof query;
          }
          
          const result = await query
            .orderBy(desc(ads.createdAt))
            .limit(queryLimit);
          
          data = result;
          count = result.length;
        }
        break;
      }

      case 'categories': {
        if (action === 'get' && id) {
          // Get single category by ID
          const result = await db.select()
            .from(categories)
            .where(eq(categories.id, id))
            .limit(1);
          data = result;
          count = result.length;
        } else if (action === 'search' && search) {
          // Search categories by name
          const searchConditions = like(categories.name, `%${search}%`);
          const result = await db.select()
            .from(categories)
            .where(searchConditions)
            .limit(queryLimit);
          data = result;
          count = result.length;
        } else {
          // Query categories with filters
          const conditions = [];
          
          if (filters.active !== undefined) {
            conditions.push(eq(categories.active, Boolean(filters.active)));
          }

          let query = db.select().from(categories);
          
          if (conditions.length > 0) {
            query = query.where(and(...conditions)) as typeof query;
          }
          
          const result = await query.limit(queryLimit);
          
          data = result;
          count = result.length;
        }
        break;
      }

      case 'config': {
        if (action === 'get' && filters.key) {
          // Get single config by key
          const result = await db.select()
            .from(adminConfig)
            .where(eq(adminConfig.key, filters.key))
            .limit(1);
          data = result;
          count = result.length;
        } else if (action === 'search' && search) {
          // Search config by key
          const searchConditions = like(adminConfig.key, `%${search}%`);
          const result = await db.select()
            .from(adminConfig)
            .where(searchConditions)
            .limit(queryLimit);
          data = result;
          count = result.length;
        } else {
          // Query all config
          const result = await db.select()
            .from(adminConfig)
            .limit(queryLimit);
          
          data = result;
          count = result.length;
        }
        break;
      }
    }

    const response: MCPResponse = {
      success: true,
      data,
      meta: {
        count,
        resource,
        action
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('MCP POST error:', error);
    const response: MCPResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      }
    };
    return NextResponse.json(response, { status: 500 });
  }
}