'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

/**
 * EXPOSES NEXT.JS ROUTER AND SYNC EVENTS TO WINDOW
 * Enhanced V32: Signals 'routeReady' for both pathname and query changes.
 */
function VoxelRouterContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.nextRouter = router;
            
            // Signal the engine that the NEW page (or new filter state) is now rendered
            // Using a small delay to ensure React has finished painting
            setTimeout(() => {
                const searchString = searchParams.toString();
                const fullUrl = pathname + (searchString ? '?' + searchString : '');
                window.dispatchEvent(new CustomEvent('voxel-route-ready', { 
                    detail: { pathname, fullUrl } 
                }));
            }, 100);
        }
    }, [router, pathname, searchParams]);

    return null;
}

export function VoxelRouterBridge() {
  return (
    <Suspense fallback={null}>
      <VoxelRouterContent />
    </Suspense>
  );
}
