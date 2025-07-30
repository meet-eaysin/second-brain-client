import { lazy, Suspense, type ComponentType } from 'react';
import { ErrorBoundary } from '@/app/providers/error-boundary';

// Lightweight loading fallback for fast transitions
const QuickLoader = () => (
    <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

// Heavy loading fallback for major page loads
const FullLoader = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
        </div>
    </div>
);

// Smart lazy loading with different strategies
export const createLazyComponent = <T extends Record<string, any> = object>(
    importFunc: () => Promise<{ default: ComponentType<T> }>,
    options: {
        fallback?: 'quick' | 'full' | 'none';
        preload?: boolean;
        errorBoundary?: boolean;
    } = {}
) => {
    const {
        fallback = 'quick',
        preload = false,
        errorBoundary = true
    } = options;

    const LazyComponent = lazy(importFunc);

    // Preload the component if requested
    if (preload && typeof window !== 'undefined') {
        // Preload after a short delay to not block initial render
        setTimeout(() => {
            importFunc().catch(() => {
                // Ignore preload errors
            });
        }, 100);
    }

    const getFallback = () => {
        switch (fallback) {
            case 'full':
                return <FullLoader />;
            case 'quick':
                return <QuickLoader />;
            case 'none':
                return null;
            default:
                return <QuickLoader />;
        }
    };

    const WrappedComponent = (props: T) => (
        <Suspense fallback={getFallback()}>
            <LazyComponent {...props} />
        </Suspense>
    );

    if (errorBoundary) {
        return (props: T) => (
            <ErrorBoundary>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    }

    return WrappedComponent;
};

// Preload strategy for route prefetching
export const preloadRoute = (importFunc: () => Promise<any>) => {
    if (typeof window !== 'undefined') {
        // Use requestIdleCallback if available, otherwise setTimeout
        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => {
                importFunc().catch(() => {
                    // Ignore preload errors
                });
            });
        } else {
            setTimeout(() => {
                importFunc().catch(() => {
                    // Ignore preload errors
                });
            }, 100);
        }
    }
};

// Route-specific lazy loading configurations
export const routeConfigs = {
    // Critical routes - preload and quick fallback
    auth: {
        fallback: 'quick' as const,
        preload: true,
        errorBoundary: true,
    },
    // Main app routes - quick fallback
    app: {
        fallback: 'quick' as const,
        preload: false,
        errorBoundary: true,
    },
    // Heavy modules - full fallback
    modules: {
        fallback: 'full' as const,
        preload: false,
        errorBoundary: true,
    },
    // Layout components - no fallback (should be fast)
    layout: {
        fallback: 'none' as const,
        preload: true,
        errorBoundary: true,
    },
} as const;
