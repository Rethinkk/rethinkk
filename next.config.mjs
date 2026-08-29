const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/index/democracy-direction",
        destination: "/democracy-direction-index"
      },
      {
        source: "/index/democracy-direction/methodology",
        destination: "/democracy-direction-index/methodology"
      },
      {
        source: "/index/democracy-direction/:path*",
        destination: "/democracy-direction-index/:path*"
      }
    ];
  }
};

export default nextConfig;
