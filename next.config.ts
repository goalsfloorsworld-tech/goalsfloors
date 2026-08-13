import type { NextConfig } from "next";
import fs from "fs";
import path from "path";
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
  // Removed serverExternalPackages to fix Hostinger 500 errors with Turbopack hashed module names
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lime-hummingbird-549929.hostingersite.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.zyrosite.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*\\.(?:png|jpg|jpeg|gif|webp|avif|ico|svg|woff|woff2|ttf|eot))$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/why-goals-floors',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/products-showcase',
        destination: '/products',
        permanent: true,
      },
      { source: '/tokyo-moulding', destination: '/products/tokyo-charcoal-moulding', permanent: true },
      { source: '/wpc-decking', destination: '/products/wpc-decking', permanent: true },
      { source: '/17mm-wpc-louvers-imageclad', destination: '/products/wpc-exterior-louvers', permanent: true },
      { source: '/cobra-wpc-louvers', destination: '/products/wpc-exterior-louvers', permanent: true },
      { source: '/cobra-wpc-fluted-panel', destination: '/products/wall-panels', permanent: true },
      { source: '/wpc-exterior-louvers', destination: '/products/wpc-exterior-louvers', permanent: true },
      { source: '/17mm-wpc-louvers', destination: '/products/wpc-exterior-louvers', permanent: true },
      { source: '/artificial-grass-and-vertical-garden', destination: '/products/artificial-grass', permanent: true },
      { source: '/cobra-spc-flooring', destination: '/products/spc-flooring', permanent: true },
      { source: '/cobra-herringbone-laminate-flooring', destination: '/products/laminate-flooring', permanent: true },
      { source: '/goslo-decking', destination: '/products/wpc-decking', permanent: true },
      { source: '/laminate-flooring', destination: '/products/laminate-flooring', permanent: true },
      { source: '/wpc-baffle-ceiling', destination: '/products/wpc-baffle-ceiling', permanent: true },
      { source: '/vertical-garden', destination: '/products/artificial-grass', permanent: true },
      { source: '/spc-flooring-price', destination: '/products/spc-flooring', permanent: true },
      { source: '/goals-floors-company-registration-details-and-trust-factors', destination: '/about', permanent: true },
      { source: '/about-goals-floors-indias-trusted-brand-for-flooring-and-pvc-since-2005', destination: '/about', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/multiverse/wall-panels/charcoal-moulding', destination: '/products/tokyo-charcoal-moulding', permanent: true },
      { source: '/compare/wpc-fluted-panel-vs-pu-stone', destination: '/compare', permanent: true },
      { source: '/products/undefined', destination: '/products', permanent: true },
      { source: '/artificial-grass', destination: '/products/artificial-grass', permanent: true },
      { source: '/why-choose-cobra-artificial-grass', destination: '/products/artificial-grass', permanent: true },
      { source: '/wpc-decking-in-gurugram-and-delhi-ncr', destination: '/products/wpc-decking', permanent: true },
    ];
  },
};

export default nextConfig;
