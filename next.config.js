/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // никаких редиректов под /demo — этим занимается middleware
    return [];
  },
  async rewrites() {
    // никаких rewrite под /demo
    return [];
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
