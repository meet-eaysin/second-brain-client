/**
 * Dynamic API Service for Document Views
 *
 * This service dynamically constructs API endpoints based on module names,
 * allowing the DocumentView component to work with any module while
 * maintaining consistent endpoint patterns.
 *
 * Examples:
 *
 * // Standard module (uses predefined patterns)
 * const tasksApi = createStandardModuleApiService('tasks');
 *
 * // Custom module with default patterns
 * const customApi = createModuleApiService('inventory');
 * // Results in: /document-views/inventory, /second-brain/inventory
 *
 * // Custom module with custom patterns
 * const customApi = createModuleApiService('inventory', {
 *   basePattern: '/document-views/{module}',
 *   recordsPattern: '/warehouse/{module}'
 * });
 *
 * // Fully custom endpoints
 * const customApi = createModuleApiService('legacy-system', {
 *   customEndpoints: {
 *     base: '/legacy/document-views',
 *     records: '/legacy/records'
 *   }
 * });
 */

import { apiClient } from "@/services/api-client";
import { transformPropertyToServer } from "@/modules/document-view/utils/property-transform";

// Module type - now fully dynamic, any string is supported
export type ModuleType = string;

// Base interfaces for API operations
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface RecordData {
  [key: string]: unknown;
}

export interface ViewData {
  name: string;
  type: string;
  description?: string;
  config?: Record<string, unknown>;
  filters?: Array<Record<string, unknown>>;
  sorts?: Array<Record<string, unknown>>;
  groupBy?: string;
  visibleProperties?: string[];
}

export interface PropertyData {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  order?: number;
  config?: Record<string, unknown>;
}

/**
 * Dynamic API Service Class
 * Constructs endpoints based on module name using dynamic patterns
 */
export class DynamicApiService {
  private moduleType: ModuleType;
  private baseEndpoint: string;
  private recordsEndpoint: string;

  constructor(
    moduleType: ModuleType,
    options?: {
      basePattern?: string;
      recordsPattern?: string;
      customEndpoints?: {
        base?: string;
        records?: string;
      };
    }
  ) {
    this.moduleType = moduleType?.toLowerCase() || "";

    // Use custom endpoints if provided, otherwise use patterns
    if (options?.customEndpoints?.base) {
      this.baseEndpoint = options.customEndpoints.base;
    } else {
      const basePattern = options?.basePattern || "/document-views/{module}";
      this.baseEndpoint = basePattern.replace("{module}", this.moduleType);
    }

    if (options?.customEndpoints?.records) {
      this.recordsEndpoint = options.customEndpoints.records;
    } else {
      const recordsPattern =
        options?.recordsPattern || "/second-brain/{module}";
      this.recordsEndpoint = recordsPattern.replace(
        "{module}",
        this.moduleType
      );
    }
  }

  /**
   * Transform property type from client format (uppercase) to server format (lowercase)
   */
  private transformPropertyType(clientType: string): string {
    const typeMapping: Record<string, string> = {
      TEXT: "text",
      TEXTAREA: "text",
      NUMBER: "number",
      DATE: "date",
      CHECKBOX: "checkbox",
      SELECT: "select",
      MULTI_SELECT: "multiSelect",
      PERSON: "relation",
      RELATION: "relation",
      URL: "url",
      EMAIL: "email",
      PHONE: "phone",
      FILE: "file",
      FORMULA: "text", // Fallback to text for unsupported types
      ROLLUP: "text",
      CREATED_TIME: "date",
      LAST_EDITED_TIME: "date",
      CREATED_BY: "text",
      LAST_EDITED_BY: "text",
      ICON: "text",
      IMAGE: "url",
    };

    return typeMapping[clientType] || clientType?.toLowerCase() || "";
  }

  // =============================================================================
  // CONFIGURATION METHODS
  // =============================================================================

  /**
   * Get module configuration
   */
  async getConfig(): Promise<any> {
    const response = await apiClient.get<ApiResponse>(
      `${this.baseEndpoint}/config`
    );
    return response.data.data;
  }

  // =============================================================================
  // VIEWS METHODS
  // =============================================================================

  /**
   * Get all views for the module
   */
  async getViews(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse>(
      `${this.baseEndpoint}/views`
    );
    return response.data.data;
  }

  /**
   * Get default view for the module
   */
  async getDefaultView(): Promise<any> {
    // Server doesn't have /views/default endpoint, so get all views and find the default
    const views = await this.getViews();
    return views.find((view: any) => view.isDefault) || views[0];
  }

  /**
   * Get view by ID
   */
  async getViewById(viewId: string): Promise<any> {
    const response = await apiClient.get<ApiResponse>(
      `${this.baseEndpoint}/views/${viewId}`
    );
    return response.data.data;
  }

  /**
   * Create a new view
   */
  async createView(viewData: ViewData): Promise<any> {
    const response = await apiClient.post<ApiResponse>(
      `${this.baseEndpoint}/views`,
      viewData
    );
    return response.data.data;
  }

  /**
   * Update a view
   */
  async updateView(viewId: string, viewData: Partial<ViewData>): Promise<any> {
    const response = await apiClient.put<ApiResponse>(
      `${this.baseEndpoint}/views/${viewId}`,
      viewData
    );
    return response.data.data;
  }

  /**
   * Delete a view
   */
  async deleteView(viewId: string): Promise<void> {
    await apiClient.delete(`${this.baseEndpoint}/views/${viewId}`);
  }

  /**
   * Duplicate a view
   */
  async duplicateView(viewId: string, newName?: string): Promise<any> {
    const response = await apiClient.post<ApiResponse>(
      `${this.baseEndpoint}/views/${viewId}/duplicate`,
      { name: newName }
    );
    return response.data.data;
  }

  /**
   * Freeze/unfreeze a database
   */
  async freezeDatabase(
    databaseId: string,
    frozen: boolean,
    reason?: string
  ): Promise<any> {
    const response = await apiClient.patch<ApiResponse>(
      `${this.baseEndpoint}/databases/${databaseId}/freeze`,
      { frozen, reason }
    );
    return response.data.data;
  }

  /**
   * Update property visibility in a view
   */
  async updatePropertyVisibility(
    viewId: string,
    propertyId: string,
    visible: boolean
  ): Promise<any> {
    const response = await apiClient.patch<ApiResponse>(
      `${this.baseEndpoint}/views/${viewId}/properties/${propertyId}/visibility`,
      { visible }
    );
    return response.data.data;
  }

  /**
   * Freeze/unfreeze a property
   */
  async freezeProperty(
    propertyId: string,
    data: { frozen: boolean },
    reason?: string
  ): Promise<any> {
    // For people module, use view-based endpoint pattern
    if (this.moduleType === "people") {
      const viewId = "all-people"; // Default to all-people view
      const endpoint = `${this.baseEndpoint}/views/${viewId}/properties/${propertyId}/freeze`;
      const response = await apiClient.patch<ApiResponse>(endpoint, data);
      return response.data.data;
    }

    // For other modules, use direct property endpoint
    const response = await apiClient.patch<ApiResponse>(
      `${this.baseEndpoint}/properties/${propertyId}/freeze`,
      { frozen: data.frozen, reason }
    );
    return response.data.data;
  }

  // =============================================================================
  // PROPERTIES METHODS
  // =============================================================================

  /**
   * Add property to a view
   */
  async addProperty(viewId: string, propertyData: PropertyData): Promise<any> {
    // Use centralized transformation for proper client→server format conversion
    const transformedPropertyData = transformPropertyToServer(
      propertyData as any
    );

    // Debug logging to see transformation
    console.log("🔧 Dynamic API Property Transformation:", {
      moduleType: this.moduleType,
      clientData: propertyData,
      serverData: transformedPropertyData,
      clientSelectOptions: (propertyData as any).selectOptions,
      serverOptions: transformedPropertyData.options,
    });

    // For people module, use view-based endpoint pattern
    if (this.moduleType === "people") {
      const response = await apiClient.post<ApiResponse>(
        `${this.baseEndpoint}/views/${viewId}/properties`,
        { property: transformedPropertyData }
      );
      return response.data.data;
    }

    // For other modules (books, tasks, etc.), use direct property endpoint
    const response = await apiClient.post<ApiResponse>(
      `${this.baseEndpoint}/properties`,
      transformedPropertyData // Send transformed property data
    );
    return response.data.data;
  }

  /**
   * Update view properties configuration
   */
  async updateViewProperties(
    viewId: string,
    properties: PropertyData[]
  ): Promise<ViewData> {
    const response = await apiClient.patch<ApiResponse<ViewData>>(
      `${this.baseEndpoint}/views/${viewId}/properties`,
      { properties }
    );
    return response.data.data;
  }

  /**
   * Remove property from a view
   */
  async removeProperty(viewId: string, propertyId: string): Promise<void> {
    await apiClient.delete(
      `${this.baseEndpoint}/views/${viewId}/properties/${propertyId}`
    );
  }

  /**
   * Get all properties for the module
   */
  async getProperties(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse>(
      `${this.baseEndpoint}/properties`
    );
    return response.data.data;
  }

  /**
   * Create a new property
   */
  async createProperty(propertyData: PropertyData): Promise<any> {
    // Transform property type from uppercase to lowercase for server compatibility
    const transformedPropertyData = {
      ...propertyData,
      type: this.transformPropertyType(propertyData.type),
    };

    const response = await apiClient.post<ApiResponse>(
      `${this.baseEndpoint}/properties`,
      transformedPropertyData
    );
    return response.data.data;
  }

  /**
   * Update a property
   */
  async updateProperty(
    propertyId: string,
    propertyData: Partial<PropertyData>
  ): Promise<any> {
    // Transform property type if it's being updated
    const transformedPropertyData = {
      ...propertyData,
      ...(propertyData.type && {
        type: this.transformPropertyType(propertyData.type),
      }),
    };

    // For people module, use view-based endpoint pattern
    if (this.moduleType === "people") {
      const viewId = "all-people"; // Default to all-people view
      const endpoint = `${this.baseEndpoint}/views/${viewId}/properties/${propertyId}`;
      const response = await apiClient.patch<ApiResponse>(
        endpoint,
        transformedPropertyData
      );
      return response.data.data;
    }

    // For other modules, use direct property endpoint
    const response = await apiClient.patch<ApiResponse>(
      `${this.baseEndpoint}/properties/${propertyId}`,
      transformedPropertyData
    );
    return response.data.data;
  }

  /**
   * Delete a property
   */
  async deleteProperty(propertyId: string): Promise<void> {
    // For people module, use view-based endpoint pattern
    if (this.moduleType === "people") {
      const viewId = "all-people"; // Default to all-people view
      const endpoint = `${this.baseEndpoint}/views/${viewId}/properties/${propertyId}`;
      await apiClient.delete(endpoint);
      return;
    }

    // For other modules, use direct property endpoint
    await apiClient.delete(`${this.baseEndpoint}/properties/${propertyId}`);
  }

  /**
   * Insert a new property at a specific position
   */
  async insertProperty(
    propertyId: string,
    data: { position: "left" | "right"; name: string; type: string }
  ): Promise<any> {
    // For people module, use view-based endpoint pattern
    if (this.moduleType === "people") {
      const viewId = "all-people"; // Default to all-people view
      const endpoint = `${this.baseEndpoint}/views/${viewId}/properties/${propertyId}/insert`;
      const response = await apiClient.post<ApiResponse>(endpoint, data);
      return response.data.data;
    }

    // For other modules, use direct property endpoint
    const response = await apiClient.post<ApiResponse>(
      `${this.baseEndpoint}/properties/${propertyId}/insert`,
      data
    );
    return response.data.data;
  }

  /**
   * Duplicate a property
   */
  async duplicateProperty(propertyId: string): Promise<any> {
    // For people module, use view-based endpoint pattern
    if (this.moduleType === "people") {
      const viewId = "all-people"; // Default to all-people view
      const endpoint = `${this.baseEndpoint}/views/${viewId}/properties/${propertyId}/duplicate`;
      const response = await apiClient.post<ApiResponse>(endpoint, {
        type: "TEXT",
      });
      return response.data.data;
    }

    // For other modules, use direct property endpoint
    const response = await apiClient.post<ApiResponse>(
      `${this.baseEndpoint}/properties/${propertyId}/duplicate`,
      {}
    );
    return response.data.data;
  }

  /**
   * Update property type
   */
  async updatePropertyType(
    propertyId: string,
    data: { type: string }
  ): Promise<any> {
    // For people module, use view-based endpoint pattern
    if (this.moduleType === "people") {
      const viewId = "all-people"; // Default to all-people view
      const endpoint = `${this.baseEndpoint}/views/${viewId}/properties/${propertyId}`;
      const response = await apiClient.patch<ApiResponse>(endpoint, data);
      return response.data.data;
    }

    // For other modules, use direct property endpoint
    const response = await apiClient.patch<ApiResponse>(
      `${this.baseEndpoint}/properties/${propertyId}`,
      data
    );
    return response.data.data;
  }

  // =============================================================================
  // RECORDS METHODS
  // =============================================================================

  /**
   * Get all records for the module
   */
  async getRecords(params?: Record<string, unknown>): Promise<RecordData[]> {
    const response = await apiClient.get<ApiResponse<RecordData[]>>(
      this.recordsEndpoint,
      { params }
    );
    return response.data.data;
  }

  /**
   * Get record by ID
   */
  async getRecordById(recordId: string): Promise<any> {
    const response = await apiClient.get<ApiResponse>(
      `${this.recordsEndpoint}/${recordId}`
    );
    return response.data.data;
  }

  /**
   * Create a new record
   */
  async createRecord(recordData: RecordData): Promise<any> {
    // Follow view APIs pattern: /api/v1/document-views/{module}/records
    console.log(
      "DynamicApiService.createRecord - using endpoint:",
      this.recordsEndpoint
    );

    // Temporary fix for people module - ensure correct endpoint
    let endpoint = this.recordsEndpoint;
    if (this.moduleType === "people" && !endpoint.endsWith("/records")) {
      endpoint = `${this.baseEndpoint}/records`;
      console.log(
        "DynamicApiService.createRecord - corrected endpoint for people:",
        endpoint
      );
    }

    const response = await apiClient.post<ApiResponse>(endpoint, recordData);
    return response.data.data;
  }

  /**
   * Update a record
   */
  async updateRecord(
    recordId: string,
    recordData: Partial<RecordData>
  ): Promise<any> {
    // Follow view APIs pattern: /api/v1/document-views/{module}/records/{recordId}
    const response = await apiClient.put<ApiResponse>(
      `${this.recordsEndpoint}/${recordId}`,
      recordData
    );
    return response.data.data;
  }

  /**
   * Delete a record
   */
  async deleteRecord(recordId: string): Promise<void> {
    // Follow view APIs pattern: /api/v1/document-views/{module}/records/{recordId}
    await apiClient.delete(`${this.recordsEndpoint}/${recordId}`);
  }

  // =============================================================================
  // FILTERS & SORTS METHODS
  // =============================================================================

  /**
   * Update view filters
   */
  async updateViewFilters(
    viewId: string,
    filters: Array<Record<string, unknown>>
  ): Promise<ViewData> {
    const response = await apiClient.patch<ApiResponse<ViewData>>(
      `${this.baseEndpoint}/views/${viewId}/filters`,
      { filters }
    );
    return response.data.data;
  }

  /**
   * Update view sorts
   */
  async updateViewSorts(
    viewId: string,
    sorts: Array<Record<string, unknown>>
  ): Promise<ViewData> {
    const response = await apiClient.patch<ApiResponse<ViewData>>(
      `${this.baseEndpoint}/views/${viewId}/sorts`,
      { sorts }
    );
    return response.data.data;
  }
}

/**
 * Factory function to create a dynamic API service for a module
 */
export function createModuleApiService(
  moduleType: ModuleType,
  options?: {
    basePattern?: string;
    recordsPattern?: string;
    customEndpoints?: {
      base?: string;
      records?: string;
    };
  }
): DynamicApiService {
  return new DynamicApiService(moduleType, options);
}

/**
 * Create API service with predefined patterns for common modules
 */
export function createStandardModuleApiService(
  moduleType: ModuleType
): DynamicApiService {
  // Define standard patterns for different module types
  const modulePatterns: Record<string, any> = {
    tasks: {
      basePattern: "/document-views/{module}",
      recordsPattern: "/second-brain/{module}",
    },
    projects: {
      basePattern: "/document-views/{module}",
      recordsPattern: "/second-brain/{module}",
    },
    books: {
      basePattern: "/second-brain/{module}/document-view",
      recordsPattern: "/second-brain/{module}",
    },
    people: {
      basePattern: "/document-views/{module}",
      recordsPattern: "/document-views/{module}/records",
    },
    content: {
      basePattern: "/document-views/{module}",
      recordsPattern: "/{module}",
    },
    databases: {
      customEndpoints: {
        base: "/databases",
        records: "/databases",
      },
    },
  };

  const pattern = modulePatterns[moduleType?.toLowerCase() || ""] || {
    basePattern: "/document-views/{module}",
    recordsPattern: "/{module}",
  };

  return new DynamicApiService(moduleType, pattern);
}

/**
 * Check if a module type is supported (now any string is supported)
 */
export function isModuleSupported(
  moduleType: string
): moduleType is ModuleType {
  return typeof moduleType === "string" && moduleType.length > 0;
}

/**
 * Get common module types (for reference, but any string is supported)
 */
export function getCommonModules(): string[] {
  return ["tasks", "projects", "people", "content", "databases"];
}
