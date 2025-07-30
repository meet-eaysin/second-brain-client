import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const usePerformanceMonitor = (componentName?: string) => {
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

// Global performance monitoring
export const initPerformanceMonitoring = () => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
        return;
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 50) {
                        console.warn(`🐌 Long task detected: ${entry.duration.toFixed(2)}ms`);
                    }
                });
            });

            // Check if longtask is supported before observing
            try {
                observer.observe({ entryTypes: ['longtask'] });
            } catch (observeError) {
                // longtask not supported in this browser
                console.log('📊 Long task monitoring not supported in this browser');
            }
        } catch (error) {
            // PerformanceObserver not supported
            console.log('📊 PerformanceObserver not supported in this browser');
        }
    }

    // Monitor navigation timing
    window.addEventListener('load', () => {
        setTimeout(() => {
            try {
                const navigationEntries = performance.getEntriesByType('navigation');
                if (navigationEntries.length > 0) {
                    const navigation = navigationEntries[0] as PerformanceNavigationTiming;

                    // Check if all required properties exist
                    if (navigation.domainLookupEnd && navigation.domainLookupStart &&
                        navigation.connectEnd && navigation.connectStart &&
                        navigation.responseStart && navigation.requestStart &&
                        navigation.responseEnd && navigation.domContentLoadedEventEnd &&
                        navigation.loadEventEnd && navigation.fetchStart) {

                        console.log('📊 Navigation Timing:', {
                            'DNS Lookup': `${(navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2)}ms`,
                            'TCP Connection': `${(navigation.connectEnd - navigation.connectStart).toFixed(2)}ms`,
                            'Request': `${(navigation.responseStart - navigation.requestStart).toFixed(2)}ms`,
                            'Response': `${(navigation.responseEnd - navigation.responseStart).toFixed(2)}ms`,
                            'DOM Processing': `${(navigation.domContentLoadedEventEnd - navigation.responseEnd).toFixed(2)}ms`,
                            'Total': `${(navigation.loadEventEnd - navigation.fetchStart).toFixed(2)}ms`,
                        });
                    }
                }
            } catch (error) {
                // Navigation timing not available or supported
                console.log('📊 Navigation timing not available');
            }
        }, 0);
    });
};
