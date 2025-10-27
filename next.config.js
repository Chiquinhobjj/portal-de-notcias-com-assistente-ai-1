/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@copilotkit/runtime'],
  eslint: {
    // Ignorar erros de ESLint durante o build (já configurado no package.json)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar erros de TypeScript durante o build (já configurado no package.json)
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@copilotkit/runtime');
    }
    return config;
  },
  // Configurações adicionais para otimização
  images: {
    domains: [
      'images.unsplash.com',
      'img.youtube.com',
      'i.ytimg.com',
      'slelguoygbfzlpylpxfs.supabase.co'
    ],
  },
  // Configuração para Edge Runtime quando necessário
  async headers() {
    return [
      {
        source: '/api/copilotkit',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
