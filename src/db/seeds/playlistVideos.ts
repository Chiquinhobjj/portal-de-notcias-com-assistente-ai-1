import { db } from '@/db';
import { playlistVideos, playlists } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const samplePlaylistVideos = [
        // Playlist 1 (Destaques da Semana) - 4 videos
        {
            playlistId: 1,
            videoId: 1,
            position: 0,
            createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        },
        {
            playlistId: 1,
            videoId: 4,
            position: 1,
            createdAt: new Date('2024-01-15T10:05:00Z').toISOString(),
        },
        {
            playlistId: 1,
            videoId: 7,
            position: 2,
            createdAt: new Date('2024-01-15T10:10:00Z').toISOString(),
        },
        {
            playlistId: 1,
            videoId: 10,
            position: 3,
            createdAt: new Date('2024-01-15T10:15:00Z').toISOString(),
        },
        // Playlist 2 (Brasil em Foco) - 3 videos
        {
            playlistId: 2,
            videoId: 5,
            position: 0,
            createdAt: new Date('2024-01-16T09:00:00Z').toISOString(),
        },
        {
            playlistId: 2,
            videoId: 6,
            position: 1,
            createdAt: new Date('2024-01-16T09:05:00Z').toISOString(),
        },
        {
            playlistId: 2,
            videoId: 9,
            position: 2,
            createdAt: new Date('2024-01-16T09:10:00Z').toISOString(),
        },
        // Playlist 3 (Tecnologia e Inovação) - 3 videos
        {
            playlistId: 3,
            videoId: 2,
            position: 0,
            createdAt: new Date('2024-01-17T08:00:00Z').toISOString(),
        },
        {
            playlistId: 3,
            videoId: 8,
            position: 1,
            createdAt: new Date('2024-01-17T08:05:00Z').toISOString(),
        },
        {
            playlistId: 3,
            videoId: 11,
            position: 2,
            createdAt: new Date('2024-01-17T08:10:00Z').toISOString(),
        },
    ];

    await db.insert(playlistVideos).values(samplePlaylistVideos);

    // Update playlist video counts
    const currentTimestamp = new Date().toISOString();

    await db.update(playlists)
        .set({ videoCount: 4, updatedAt: currentTimestamp })
        .where(eq(playlists.id, 1));

    await db.update(playlists)
        .set({ videoCount: 3, updatedAt: currentTimestamp })
        .where(eq(playlists.id, 2));

    await db.update(playlists)
        .set({ videoCount: 3, updatedAt: currentTimestamp })
        .where(eq(playlists.id, 3));

    console.log('✅ Playlist videos seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});