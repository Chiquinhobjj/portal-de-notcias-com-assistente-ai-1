import { db } from '@/db';
import { adminConfig } from '@/db/schema';

async function main() {
    const sampleConfig = [
        {
            key: 'site_name',
            value: '{"name":"Portal de Notícias","domain":"portal.example.com"}',
            description: 'Site name and domain configuration',
            updatedAt: new Date().toISOString(),
        },
        {
            key: 'site_settings',
            value: '{"itemsPerPage":20,"enableComments":true,"enableAds":true}',
            description: 'General site settings and features',
            updatedAt: new Date().toISOString(),
        },
        {
            key: 'seo_config',
            value: '{"defaultTitle":"Portal de Notícias - Últimas Notícias","defaultDescription":"Seu portal de notícias com cobertura completa","keywords":"notícias, brasil, tecnologia, esportes"}',
            description: 'SEO meta tags configuration',
            updatedAt: new Date().toISOString(),
        },
        {
            key: 'social_media',
            value: '{"facebook":"https://facebook.com/portal","twitter":"https://twitter.com/portal","instagram":"https://instagram.com/portal"}',
            description: 'Social media links',
            updatedAt: new Date().toISOString(),
        },
        {
            key: 'analytics',
            value: '{"googleAnalyticsId":"GA-XXXXXXXXX","enableTracking":true,"trackEvents":true}',
            description: 'Analytics and tracking configuration',
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(adminConfig).values(sampleConfig);
    
    console.log('✅ Admin configuration seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});