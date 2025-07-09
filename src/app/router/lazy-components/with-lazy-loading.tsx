import  {lazy, Suspense, type ComponentType} from 'react'
import { ErrorBoundary } from '@/app/providers/error-boundary'
import {LoadingSpinner} from "@/components/loading-spinner.tsx";
import {LoadingFallback} from "@/components/loading-fallback.tsx";

export const withLazyLoading = <T extends Record<string, any> = object>(
    importFunc: () => Promise<{ default: ComponentType<T> }>,
    fallback?: ComponentType
) => {
    const LazyComponent = lazy(importFunc)

    return (props: T) => (
        <ErrorBoundary>
            <Suspense fallback={fallback ? <LoadingFallback/> : <LoadingSpinner />}>
                <LazyComponent {...props} />
            </Suspense>
        </ErrorBoundary>
    )
}