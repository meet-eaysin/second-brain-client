import { AppProviders } from "@/app/providers";
import { AppRouter } from "@/app/router";
import "@/utils/routePreloader"; // Auto-preload critical routes

export const App = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};
