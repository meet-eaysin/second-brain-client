import { cn } from "@/lib/utils";
import { SearchProvider } from "@/context/search-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import SkipToMain from "@/components/skip-to-main";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/layout/app-sidebar.tsx";
import { PageVisitTracker } from "@/modules/home/components/page-visit-tracker";
import React from "react";

interface Props {
  children?: React.ReactNode;
}

function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = true; // Always default to open

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <PageVisitTracker />
        <AppSidebar />
        <div
          id="content"
          className={cn(
            "ml-auto w-full max-w-full overflow-x-hidden",
            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
            "sm:transition-[width] sm:duration-200 sm:ease-linear",
            "flex h-svh flex-col",
            "group-data-[scroll-locked=1]/body:h-full",
            "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh"
          )}
        >
          {children ? children : <Outlet />}
        </div>
      </SidebarProvider>
    </SearchProvider>
  );
}

export default AuthenticatedLayout;
