"use client";

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import FloatingWidgets from '@/components/FloatingWidgets';
import Navbar from '@/components/Navbar';
import SmoothScrolling from '@/components/SmoothScrolling';

const Footer = dynamic(() => import('@/components/Footer'));

export default function RouteChrome({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname() || '';
  const isAdminPath = pathname.startsWith('/admin');

  if (isAdminPath) {
    return <div className="relative min-h-screen">{children}</div>;
  }

  return (
    <SmoothScrolling>
      <div className="relative pt-14">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </div>
      <FloatingWidgets />
    </SmoothScrolling>
  );
}
