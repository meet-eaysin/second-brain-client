import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useSimplePerformanceMonitor = (componentName?: string) => {
    const location = useLocation();
    const navigationStartTime = useRef<number>(0);
    const componentMountTime = useRef<number>(0);

    // Track route changes
    useEffect(() => {
        navigationStartTime.current = performance.now();
        
        // Log route change start
        if (process.env.NODE_ENV === 'development') {
            console.log(`🚀 Navigation started to: ${location.pathname}`);
        }
    }, [location.pathname]);

    // Track component mount
    useEffect(() => {
        componentMountTime.current = performance.now();
        
        if (navigationStartTime.current > 0) {
            const totalTime = componentMountTime.current - navigationStartTime.current;
            
            if (process.env.NODE_ENV === 'development') {
                console.log(`✅ ${componentName || 'Component'} loaded in ${totalTime.toFixed(2)}ms`);
                
                // Warn if loading is slow
                if (totalTime > 1000) {
                    console.warn(`⚠️ Slow navigation detected: ${totalTime.toFixed(2)}ms`);
                }
            }
        }
    }, [componentName]);

    // Performance measurement utilities
    const measureAsync = async <T>(
        operation: () => Promise<T>,
        operationName: string
    ): Promise<T> => {
        const start = performance.now();
        try {
            const result = await operation();
            const end = performance.now();
            
            if (process.env.NODE_ENV === 'development') {
                console.log(`⏱️ ${operationName}: ${(end - start).toFixed(2)}ms`);
            }
            
            return result;
        } catch (error) {
            const end = performance.now();
            
            if (process.env.NODE_ENV === 'development') {
                console.error(`❌ ${operationName} failed after ${(end - start).toFixed(2)}ms:`, error);
            }
            
            throw error;
        }
    };

    return {
        measureAsync,
        getNavigationTime: () => {
            if (navigationStartTime.current > 0 && componentMountTime.current > 0) {
                return componentMountTime.current - navigationStartTime.current;
            }
            return 0;
        }
    };
};

// Simple performance monitoring initialization
export const initSimplePerformanceMonitoring = () => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
        return;
    }

    console.log('📊 Performance monitoring initialized');

    // Simple page load timing
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadTime = performance.now();
            console.log(`📊 Page loaded in ${loadTime.toFixed(2)}ms`);
        }, 0);
    });
};
