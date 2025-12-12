import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Simple Finance - Gestión de Finanzas Personales',
    short_name: 'Simple Finance',
    description: 'Aplicación moderna para gestionar tus finanzas personales de forma inteligente y eficiente.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    theme_color: '#0A2A54',
    background_color: '#ffffff',
    prefer_related_applications: false,
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-120x120.png',
        sizes: '120x120',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-167x167.png',
        sizes: '167x167',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192x192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['finance', 'productivity'],
    screenshots: [
      {
        src: '/icon-192x192.png',
        type: 'image/png',
        sizes: '192x192',
        form_factor: 'narrow',
      },
      {
        src: '/icon-512x512.png',
        type: 'image/png',
        sizes: '512x512',
        form_factor: 'wide',
      },
    ],
  };
}
