import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Experimental feature
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wiftstorage.blob.core.windows.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagsapi.com",
        port: "",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:3001/api/v1/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com;
              img-src 'self' blob: data: https://api.dicebear.com https://images.unsplash.com https://lh3.googleusercontent.com https://wiftstorage.blob.core.windows.net https://flagsapi.com;
              media-src 'self' blob: data: https://wiftstorage.blob.core.windows.net;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' http://localhost:3001 ws://localhost:3001 https://api.dicebear.com https://accounts.google.com https://wiftafricabackend-test.azurewebsites.net wss://wiftafricabackend-test.azurewebsites.net;
              frame-src 'self' https://accounts.google.com https://wiftstorage.blob.core.windows.net;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
