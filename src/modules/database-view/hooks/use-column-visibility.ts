import {useQueryClient} from "@tanstack/react-query";
import {useDatabaseView} from "@/modules/database-view/context";
import type {TProperty} from "@/modules/database-view/types";
import {useUpdateView} from "@/modules/database-view/services/database-queries.ts";

export function useColumnVisibility() {
  const {moduleType, currentView, properties, database} = useDatabaseView()
  const queryClient = useQueryClient();
  const {mutateAsync: onUpdateView} = useUpdateView()

  const invalidateQueries = () => {
    queryClient.invalidateQueries({queryKey: [moduleType]});
    queryClient.invalidateQueries({queryKey: ["second-brain"]});

    if (moduleType === "people") {
      queryClient.invalidateQueries({queryKey: ["people-database-view"]});
      queryClient.invalidateQueries({queryKey: ["people-views"]});
    }
  };

  const toggleProperty = async (
    propertyId: string,
    visible: boolean
  ): Promise<void> => {
    const currentVisible = currentView?.settings?.visibleProperties || [];
    const currentHidden = currentView?.settings?.hiddenProperties || [];

    let updatedVisible: string[];
    let updatedHidden: string[];

    if (visible) {
      updatedVisible = [
        ...currentVisible.filter((id) => id !== propertyId),
        propertyId,
      ];
      updatedHidden = currentHidden.filter((id) => id !== propertyId);
    } else {
      updatedHidden = [
        ...currentHidden.filter((id) => id !== propertyId),
        propertyId,
      ];
      updatedVisible = currentVisible.filter((id) => id !== propertyId);
    }

    await onUpdateView({
      databaseId: database?.id || "",
      viewId: currentView?.id || "",
      data: {
        settings: {
          visibleProperties: updatedVisible,
          hiddenProperties: updatedHidden,
        },
      }
    })

    invalidateQueries();
  };

  const showAll = async (): Promise<void> => {
    const allPropertyIds = properties.map((prop) => prop.id);

    await onUpdateView({
      databaseId: database?.id || "",
      viewId: currentView?.id || "",
      data: {
        settings: {
          visibleProperties: allPropertyIds,
          hiddenProperties: [],
        },
      }
    })

    invalidateQueries();
  };

  const hideAll = async (): Promise<void> => {
    const requiredPropertyIds = properties
      .filter((prop) => prop.isSystem || prop.required)
      .map((prop) => prop.id);
    const optionalPropertyIds = properties
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
      }
    })

    invalidateQueries();
  };

  const resetToDefault = async (): Promise<void> => {
    const defaultVisibleProperties = properties
      .filter(
        (prop) =>
          prop.isSystem ||
          prop.required ||
          ["title", "name", "status"].includes(prop.id)
      )
      .map((prop) => prop.id);

    const defaultHiddenProperties = properties
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
      }
    })

    invalidateQueries();
  };

  const getStats = () => {
    const visibleIds = currentView?.settings?.visibleProperties || [];
    const hiddenIds = currentView?.settings?.hiddenProperties || [];
    const visibleCount = visibleIds.length;
    const hiddenCount = hiddenIds.length;
    const totalCount = properties.length;
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
      visible: properties.filter((prop) => visibleIds.includes(prop.id)),
      hidden: properties.filter(
        (prop) =>
          hiddenIds.includes(prop.id) ||
          (!visibleIds.includes(prop.id) && !hiddenIds.includes(prop.id))
      ),
      required: properties.filter((prop) => prop.isSystem || prop.required),
      optional: properties.filter((prop) => !prop.isSystem && !prop.required),
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
    properties,
  };
}
