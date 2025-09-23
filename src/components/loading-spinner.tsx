import { Spinner } from "@/components/ui/kibo-ui/spinner";

export const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
    <Spinner />
  </div>
);
