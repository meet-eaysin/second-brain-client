import { useEffect } from 'react';
import {AppProviders} from "@/app/providers";
import {AppRouter} from "@/app/router";
import { initSimplePerformanceMonitoring } from '@/hooks/useSimplePerformanceMonitor';

export const App = () => {
    useEffect(() => {
        // Initialize performance monitoring in development
        initSimplePerformanceMonitoring();
    }, []);

    return (
        <AppProviders>
            <AppRouter />
        </AppProviders>
    )
}
