import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles, videos, ads, user } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get basic counts
    const [articlesCount] = await db.select({ count: sql<number>`count(*)` }).from(articles);
    const [videosCount] = await db.select({ count: sql<number>`count(*)` }).from(videos);
    const [adsCount] = await db.select({ count: sql<number>`count(*)` }).from(ads);
    const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(user);

    // Get total views and clicks
    const [totalViews] = await db.select({ 
      total: sql<number>`sum(${articles.views}) + sum(${videos.views})` 
    }).from(articles);
    
    const [totalClicks] = await db.select({ 
      total: sql<number>`sum(${ads.clicks})` 
    }).from(ads);

    // Get top content
    const topArticles = await db
      .select({
        title: articles.title,
        views: articles.views,
        type: sql<string>`'article'`,
      })
      .from(articles)
      .orderBy(desc(articles.views))
      .limit(5);

    const topVideos = await db
      .select({
        title: videos.title,
        views: videos.views,
        type: sql<string>`'video'`,
      })
      .from(videos)
      .orderBy(desc(videos.views))
      .limit(5);

    const topContent = [...topArticles, ...topVideos]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10);

    // Get content by category
    const articlesByCategory = await db
      .select({
        category: articles.category,
        count: sql<number>`count(*)`,
      })
      .from(articles)
      .groupBy(articles.category);

    const videosByCategory = await db
      .select({
        category: videos.category,
        count: sql<number>`count(*)`,
      })
      .from(videos)
      .groupBy(videos.category);

    // Combine categories
    const categoryMap = new Map<string, number>();
    [...articlesByCategory, ...videosByCategory].forEach(item => {
      const current = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, current + item.count);
    });

    const contentByCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
    }));

    // Content type distribution
    const contentTypeDistribution = [
      { type: "Artigos", count: articlesCount.count },
      { type: "Vídeos", count: videosCount.count },
      { type: "Anúncios", count: adsCount.count },
    ];

    // Mock data for views over time (in a real app, you'd query actual time-series data)
    const viewsOverTime = [
      { date: "2024-01", views: 1200 },
      { date: "2024-02", views: 1500 },
      { date: "2024-03", views: 1800 },
      { date: "2024-04", views: 2100 },
      { date: "2024-05", views: 2400 },
      { date: "2024-06", views: 2700 },
    ];

    // Mock growth calculations
    const viewsGrowth = 12.5; // 12.5% growth
    const clicksGrowth = 8.3; // 8.3% growth

    const analytics = {
      totalViews: totalViews.total || 0,
      totalClicks: totalClicks.total || 0,
      totalArticles: articlesCount.count,
      totalVideos: videosCount.count,
      totalUsers: usersCount.count,
      viewsGrowth,
      clicksGrowth,
      topContent,
      viewsOverTime,
      contentByCategory,
      contentTypeDistribution,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
