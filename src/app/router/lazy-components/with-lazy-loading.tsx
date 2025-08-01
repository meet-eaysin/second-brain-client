import { lazy, Suspense, type ComponentType } from 'react'

const SimpleLoader = () => (
    <div className="flex items-center justify-center min-h-[100px]">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
    </div>
)

export const withLazyLoading = (
    importFunc: () => Promise<{ default: ComponentType<any> }>
) => {
    const LazyComponent = lazy(importFunc)

    return (props: any) => (
        <Suspense fallback={<SimpleLoader />}>
            <LazyComponent {...props} />
        </Suspense>
    )
}