import { db } from '@/db';
import { playlists } from '@/db/schema';

async function main() {
    const samplePlaylists = [
        {
            title: 'Destaques da Semana',
            description: 'Os principais acontecimentos e notícias mais importantes da semana reunidos em uma playlist especial. Fique por dentro dos eventos que marcaram os últimos dias no Brasil e no mundo.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600',
            videoCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Brasil em Foco',
            description: 'Notícias exclusivas sobre o Brasil, cobrindo política, economia, cultura e sociedade. Acompanhe os principais debates e transformações que afetam o dia a dia dos brasileiros.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=800&h=600',
            videoCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Tecnologia e Inovação',
            description: 'Descubra as últimas tendências em tecnologia, startups, inteligência artificial e inovação digital. Uma curadoria especial de conteúdos sobre o futuro da tecnologia no Brasil e no mundo.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600',
            videoCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(playlists).values(samplePlaylists);
    
    console.log('✅ Playlists seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});