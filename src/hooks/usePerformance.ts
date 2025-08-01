import { useEffect } from 'react';

export const usePerformance = (componentName: string) => {
    useEffect(() => {
        if (import.meta.env.DEV) {
            const startTime = performance.now();
            
            return () => {
                const endTime = performance.now();
                const renderTime = endTime - startTime;
                
                if (renderTime > 100) {
                    console.warn(`⚠️ Slow component: ${componentName} took ${renderTime.toFixed(2)}ms to render`);
                } else if (renderTime > 50) {
                    console.log(`⏱️ ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
                }
            };
        }
    }, [componentName]);
};

export const measureAsync = async <T>(
    operation: () => Promise<T>,
    operationName: string
): Promise<T> => {
    if (import.meta.env.DEV) {
        const startTime = performance.now();
        try {
            const result = await operation();
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            if (duration > 1000) {
                console.warn(`⚠️ Slow operation: ${operationName} took ${duration.toFixed(2)}ms`);
            } else if (duration > 500) {
                console.log(`⏱️ ${operationName} completed in ${duration.toFixed(2)}ms`);
            }
            
            return result;
        } catch (error) {
            const endTime = performance.now();
            const duration = endTime - startTime;
            console.error(`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
            throw error;
        }
    } else {
        return operation();
    }
};
