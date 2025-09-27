import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarData } from "./data/sidebar-data";
import { TeamSwitcher } from "@/layout/workspace-switcher.tsx";
import { NavGroup } from "@/layout/nav-group.tsx";
import { DynamicNavGroup } from "@/layout/dynamic-nav-group.tsx";
import { NavUser } from "@/layout/nav-user.tsx";
import { CreateCategoryDialog } from "@/modules/database/components/create-category-dialog";
import { CreateDatabaseDialog } from "@/modules/database/components/create-database-dialog";
import { useAuthStore } from "@/modules/auth/store/auth-store.ts";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] =
    useState(false);
  const [createDatabaseDialogOpen, setCreateDatabaseDialogOpen] =
    useState(false);

  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "super_admin";

  const handleCreateDatabase = () => {
    setCreateDatabaseDialogOpen(true);
  };

  // Filter nav groups based on user role
  const filteredNavGroups = sidebarData.navGroups.filter((group) => {
    if (group.title === "Administration" && !isSuperAdmin) {
      return false;
    }
    return true;
  });

  return (
    <>
      <Sidebar collapsible="icon" variant="floating" {...props}>
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          {filteredNavGroups.map((props) => {
            // Use DynamicNavGroup for groups that have dynamic items
            if (
              props.items.some((item) => "isDynamic" in item && item.isDynamic)
            ) {
              return (
                <DynamicNavGroup
                  key={props.title}
                  {...props}
                  onCreateDatabase={handleCreateDatabase}
                />
              );
            }
            return <NavGroup key={props.title} {...props} />;
          })}
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <CreateCategoryDialog
        open={createCategoryDialogOpen}
        onOpenChange={setCreateCategoryDialogOpen}
      />

      <CreateDatabaseDialog
        open={createDatabaseDialogOpen}
        onOpenChange={setCreateDatabaseDialogOpen}
      />
    </>
  );
}
