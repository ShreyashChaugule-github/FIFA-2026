import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'digitalhub.fifa.com',
      },
      {
        protocol: 'https',
        hostname: 'www.fifa.com',
      },
      {
        protocol: 'https',
        hostname: 'images.lumacdn.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sketchfab.com https://static.sketchfab.com https://media.sketchfab.com https://apis.google.com https://www.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "media-src 'self' blob: https://sketchfab.com https://media.sketchfab.com",
              "connect-src 'self' https: wss:",
              "frame-src 'self' https://sketchfab.com https://www.sketchfab.com https://fifa-2026-502710.firebaseapp.com https://*.firebaseapp.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
