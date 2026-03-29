'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * EXPOSES NEXT.JS ROUTER AND SYNC EVENTS TO WINDOW
 * Enhanced V33: Signals 'voxel-route-ready' when the pathname actually updates.
 */
export function VoxelRouterBridge() {
    const router = useRouter();
    const pathname = usePathname();
    const prevPathname = useRef(pathname);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.nextRouter = router;
            
            // If the pathname has changed, signal the engine
            if (prevPathname.current !== pathname) {
                // Short delay to allow React to finish rendering the new page
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('voxel-route-ready', { 
                        detail: { pathname } 
                    }));
                }, 150);
                prevPathname.current = pathname;
            } else {
                // Same-page navigation still needs to signal readiness if engine is waiting
                window.dispatchEvent(new CustomEvent('voxel-route-ready', { 
                    detail: { pathname, samePage: true } 
                }));
            }
        }
    }, [router, pathname]);

    return null;
}
