// Route preloader to improve navigation speed
class RoutePreloader {
  private preloadedRoutes = new Set<string>();

  preload(importFunction: () => Promise<any>, routeName: string) {
    if (this.preloadedRoutes.has(routeName)) {
      return;
    }

    // Preload after a short delay to not block initial render
    setTimeout(() => {
      importFunction()
        .then(() => {
          this.preloadedRoutes.add(routeName);
        })
        .catch((error) => {
          console.warn(`⚠️ Failed to preload route ${routeName}:`, error);
        });
    }, 100);
  }

  preloadCriticalRoutes() {
    // Preload most commonly used routes
    this.preload(() => import("@/modules/dashboard"), "dashboard");
    this.preload(() => import("@/modules/auth/pages/sign-up-page"), "sign-up");
  }
}

export const routePreloader = new RoutePreloader();

// Auto-preload critical routes when the app starts
if (typeof window !== "undefined") {
  // Wait for initial render to complete
  setTimeout(() => {
    routePreloader.preloadCriticalRoutes();
  }, 1000);
}
