import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
    const sampleCategories = [
        {
            name: 'Tecnologia',
            slug: 'tecnologia',
            description: 'Notícias sobre inovação, gadgets, inteligência artificial e o mundo digital',
            color: '#3B82F6',
            icon: '💻',
            displayOrder: 1,
            active: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Finanças',
            slug: 'financas',
            description: 'Economia, mercado financeiro, investimentos e análises econômicas',
            color: '#10B981',
            icon: '💰',
            displayOrder: 2,
            active: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Ciência',
            slug: 'ciencia',
            description: 'Descobertas científicas, pesquisas, astronomia e avanços tecnológicos',
            color: '#8B5CF6',
            icon: '🔬',
            displayOrder: 3,
            active: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Esportes',
            slug: 'esportes',
            description: 'Futebol, olimpíadas, campeonatos e todas as modalidades esportivas',
            color: '#EF4444',
            icon: '⚽',
            displayOrder: 4,
            active: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Entretenimento',
            slug: 'entretenimento',
            description: 'Cinema, música, séries, cultura pop e novidades do mundo artístico',
            color: '#F59E0B',
            icon: '🎬',
            displayOrder: 5,
            active: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Saúde',
            slug: 'saude',
            description: 'Bem-estar, medicina, dicas de saúde e qualidade de vida',
            color: '#EC4899',
            icon: '🏥',
            displayOrder: 6,
            active: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Negócios',
            slug: 'negocios',
            description: 'Empreendedorismo, startups, corporações e mundo dos negócios',
            color: '#6366F1',
            icon: '📈',
            displayOrder: 7,
            active: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Política',
            slug: 'politica',
            description: 'Notícias políticas, governos, eleições e análises políticas',
            color: '#14B8A6',
            icon: '🏛️',
            displayOrder: 8,
            active: true,
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(categories).values(sampleCategories);
    
    console.log('✅ Categories seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});