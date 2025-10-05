/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      // Явно запрещаем перехват клиентским роутером всего под /demo
      {
        source: "/demo/:path*",
        headers: [
          { key: "x-robots-tag", value: "noindex" }
        ]
      }
    ];
  },
  async redirects() {
    return [
      { source: "/demo", destination: "/demo/", permanent: true }
    ];
  },
  async rewrites() {
    return [
      // Любой запрос под /demo/* должен идти к статике в public
      // (для Next/Vercel public/ — это корень, потому просто «сквозной» rewrite)
      { source: "/demo/:path*", destination: "/demo/:path*" }
    ];
  },
  // (если используется basePath/i18n — не трогать)
};

module.exports = nextConfig;
