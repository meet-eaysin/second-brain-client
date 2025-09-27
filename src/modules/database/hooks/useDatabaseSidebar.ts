import { Database as DatabaseIcon, Plus } from "lucide-react";
import { useDatabases } from "@/modules/database-view/services/database-queries";
import { EDatabaseType } from "@/modules/database-view/types";
import { getDatabasesLink, getDatabaseLink } from "@/app/router/router-link";

export function useDatabaseSidebar(onCreateDatabase?: () => void) {
  const { data: databasesResponse } = useDatabases({
    type: EDatabaseType.CUSTOM,
  });

  const databases = databasesResponse?.data || [];

  // Create database navigation items
  const databaseNavItems = {
    title: "Databases",
    url: getDatabasesLink(),
    icon: DatabaseIcon,
    items: [
      {
        title: "All Databases",
        url: getDatabasesLink(),
        icon: DatabaseIcon,
      },
      ...databases.slice(0, 5).map((database) => ({
        title: database.name,
        url: getDatabaseLink(database.id),
        icon: DatabaseIcon,
      })),
      {
        title: "Create Database",
        url: "#",
        icon: Plus,
        onClick: onCreateDatabase,
      },
      // {
      //   title: "Create Category",
      //   url: "#",
      //   icon: Plus,
      //   onClick: onCreateCategory, // Add click handler
      // },
      // Add individual database items (limit to first 5 to avoid clutter)
    ],
  };

  return {
    databaseNavItems,
  };
}
