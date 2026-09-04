/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Bu alan tamamen index'e kapalı: hem panolar hem de gizli müşteri
    // linkleri arama motorlarında görünmemeli.
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
