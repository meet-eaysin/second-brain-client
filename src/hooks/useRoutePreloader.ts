import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Route preloading map
const routePreloadMap: Record<string, () => Promise<any>> = {
    '/': () => import('@/modules/home'),
    '/auth/sign-in': () => import('@/modules/auth/pages/sign-in-page'),
    '/auth/sign-up': () => import('@/modules/auth/pages/sign-up-page'),
    '/app/dashboard': () => import('@/modules/dashboard'),
    '/app/data-tables': () => import('@/modules/data-table'),
    '/app/databases': () => import('@/modules/databases'),
    '/app/users': () => import('@/modules/users'),
};

// Routes that should trigger preloading of other routes
const preloadTriggers: Record<string, string[]> = {
    '/': ['/auth/sign-in', '/auth/sign-up'], // From home, likely to go to auth
    '/auth/sign-in': ['/app/dashboard'], // From sign-in, likely to go to dashboard
    '/auth/sign-up': ['/app/dashboard'], // From sign-up, likely to go to dashboard
    '/app/dashboard': ['/app/databases', '/app/data-tables'], // From dashboard, likely to explore
    '/app': ['/app/dashboard'], // From app root, likely to go to dashboard
};

export const useRoutePreloader = () => {
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname;
        const routesToPreload = preloadTriggers[currentPath] || [];

        // Preload routes after a short delay
        const timeoutId = setTimeout(() => {
            routesToPreload.forEach(route => {
                const preloadFunc = routePreloadMap[route];
                if (preloadFunc) {
                    preloadFunc().catch(() => {
                        // Ignore preload errors
                    });
                }
            });
        }, 500); // Wait 500ms before preloading

        return () => clearTimeout(timeoutId);
    }, [location.pathname]);

    // Preload on hover for navigation links
    const preloadOnHover = (targetRoute: string) => {
        const preloadFunc = routePreloadMap[targetRoute];
        if (preloadFunc) {
            preloadFunc().catch(() => {
                // Ignore preload errors
            });
        }
    };

    return { preloadOnHover };
};

// Hook for navigation links to preload on hover
export const useNavLinkPreloader = () => {
    const { preloadOnHover } = useRoutePreloader();

    const getLinkProps = (to: string) => ({
        onMouseEnter: () => preloadOnHover(to),
        onFocus: () => preloadOnHover(to),
    });

    return { getLinkProps };
};
