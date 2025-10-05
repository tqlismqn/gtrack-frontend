/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/demo',
        destination: '/demo/',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/demo/:path*',
        destination: '/demo/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/demo/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
