import { useQueryClient } from "@tanstack/react-query";
import { useDatabaseView } from "@/modules/database-view/context";
import type { TProperty } from "@/modules/database-view/types";
import { databaseApi } from "@/modules/database-view/services/database-api";
import { useUpdateView } from "@/modules/database-view/services/database-queries.ts";
import { DATABASE_KEYS } from "@/modules/database-view/services/database-queries.ts";

export function useColumnVisibility() {
  const { moduleType, currentView, allProperties, database } =
    useDatabaseView();
  const queryClient = useQueryClient();
  const { mutateAsync: onUpdateView } = useUpdateView();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: [moduleType] });
    queryClient.invalidateQueries({ queryKey: ["second-brain"] });

    // Invalidate properties queries
    queryClient.invalidateQueries({
      queryKey: DATABASE_KEYS.properties(database?.id || ""),
    });

    // Invalidate current view query
    if (currentView?.id) {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.view(database?.id || "", currentView.id),
      });
    }

    if (moduleType === "people") {
      queryClient.invalidateQueries({ queryKey: ["people-database-view"] });
      queryClient.invalidateQueries({ queryKey: ["people-views"] });
    }
  };

  const toggleProperty = async (propertyId: string): Promise<void> => {
    await databaseApi.togglePropertyVisibility(database?.id || "", propertyId, {
      viewId: currentView?.id || "",
    });

    invalidateQueries();
  };

  const showAll = async (): Promise<void> => {
    const allPropertyIds = allProperties.map((prop) => prop.id);

    await onUpdateView({
      databaseId: database?.id || "",
      viewId: currentView?.id || "",
      data: {
        settings: {
          visibleProperties: allPropertyIds,
          hiddenProperties: [],
        },
      },
    });

    invalidateQueries();
  };

  const hideAll = async (): Promise<void> => {
    const requiredPropertyIds = allProperties
      .filter((prop) => prop.isSystem || prop.required)
      .map((prop) => prop.id);
    const optionalPropertyIds = allProperties
      .filter((prop) => !prop.isSystem && !prop.required)
      .map((prop) => prop.id);

    await onUpdateView({
      databaseId: database?.id || "",
      viewId: currentView?.id || "",
      data: {
        settings: {
          visibleProperties: requiredPropertyIds,
          hiddenProperties: optionalPropertyIds,
        },
      },
    });

    invalidateQueries();
  };

  const resetToDefault = async (): Promise<void> => {
    const defaultVisibleProperties = allProperties
      .filter(
        (prop) =>
          prop.isSystem ||
          prop.required ||
          ["title", "name", "status"].includes(prop.id)
      )
      .map((prop) => prop.id);

    const defaultHiddenProperties = allProperties
      .filter(
        (prop) =>
          !prop.isSystem &&
          !prop.required &&
          !["title", "name", "status"].includes(prop.id)
      )
      .map((prop) => prop.id);

    await onUpdateView({
      databaseId: database?.id || "",
      viewId: currentView?.id || "",
      data: {
        settings: {
          visibleProperties: defaultVisibleProperties,
          hiddenProperties: defaultHiddenProperties,
        },
      },
    });

    invalidateQueries();
  };

  const getStats = () => {
    const visibleIds = currentView?.settings?.visibleProperties || [];
    const hiddenIds = currentView?.settings?.hiddenProperties || [];
    const visibleCount = visibleIds.length;
    const hiddenCount = hiddenIds.length;
    const totalCount = allProperties.length;
    const unassignedCount = totalCount - visibleCount - hiddenCount;

    return {
      visible: visibleCount,
      hidden: hiddenCount,
      unassigned: unassignedCount,
      total: totalCount,
      percentage:
        totalCount > 0 ? Math.round((visibleCount / totalCount) * 100) : 0,
    };
  };

  const canHideProperty = (property: TProperty): boolean => {
    return !property.isSystem && !property.required;
  };

  const getPropertiesByVisibility = () => {
    const visibleIds = currentView?.settings?.visibleProperties || [];
    const hiddenIds = currentView?.settings?.hiddenProperties || [];

    return {
      visible: allProperties.filter((prop) => visibleIds.includes(prop.id)),
      hidden: allProperties.filter(
        (prop) =>
          hiddenIds.includes(prop.id) ||
          (!visibleIds.includes(prop.id) && !hiddenIds.includes(prop.id))
      ),
      required: allProperties.filter((prop) => prop.isSystem || prop.required),
      optional: allProperties.filter(
        (prop) => !prop.isSystem && !prop.required
      ),
    };
  };

  return {
    toggleProperty,
    showAll,
    hideAll,
    resetToDefault,

    canHideProperty,
    getStats,
    getPropertiesByVisibility,

    currentView,
    properties: allProperties,
  };
}
