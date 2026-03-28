'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * EXPOSES NEXT.JS ROUTER AND SYNC EVENTS TO WINDOW
 * Enhanced V31: Now signals 'routeReady' when the path actually changes.
 */
export function VoxelRouterBridge() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.nextRouter = router;
            
            // Signal the engine that the NEW page is now rendered
            // Using a small delay to ensure React has finished painting
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('voxel-route-ready', { detail: { pathname } }));
            }, 100);
        }
    }, [router, pathname]);

    return null;
}
