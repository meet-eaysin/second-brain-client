import { lazy, Suspense, type ComponentType } from 'react'
import {LoadingSpinner} from "@/components/loading-spinner.tsx";

export const withLazyLoading = (
    importFunc: () => Promise<{ default: ComponentType<any> }>
) => {
  const LazyComponent = lazy(importFunc);

  return (props: any) => (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};
