const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable HTTP compression for all responses
  compress: true,

  // Reduce unnecessary headers on API routes
  poweredByHeader: false,

  // Fix: Set workspace root to silence multiple lockfiles warning and stabilize port
  outputFileTracingRoot: path.join(__dirname, '../'),

  // Allow direct fetch to local FastAPI backend from client-side
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'Connection', value: 'keep-alive' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
