/**
 * Property Data Transformation Utilities
 *
 * Handles the transformation between server and client property formats:
 * - Server: uses 'options' and camelCase types ('multiSelect')
 * - Client: uses 'selectOptions' and UPPER_CASE types ('MULTI_SELECT')
 */

import type {
  IPropertyOption,
  IDatabaseProperty,
  EPropertyType,
} from "../types";

// Re-export backend types for convenience
export type ServerPropertyOption = IPropertyOption;
export type ClientPropertyOption = IPropertyOption;
export type ServerProperty = IDatabaseProperty;
export type ClientProperty = IDatabaseProperty;

/**
 * Transform server property type to client type
 * Since we're using the same enum on both sides, this is now a no-op
 */
export function transformPropertyTypeToClient(
  serverType: EPropertyType
): EPropertyType {
  return serverType;
}

/**
 * Transform client property type to server type
 * Since we're using the same enum on both sides, this is now a no-op
 */
export function transformPropertyTypeToServer(
  clientType: EPropertyType
): EPropertyType {
  return clientType;
}

/**
 * Transform server property options to client selectOptions
 * Since we're using the same types now, this is mostly a pass-through
 */
export function transformOptionsToClient(
  serverOptions: IPropertyOption[]
): IPropertyOption[] {
  return serverOptions.map((option, index) => ({
    ...option,
    // Ensure id is set if missing
    id:
      option.id ||
      option.name.toLowerCase().replace(/\s+/g, "-") ||
      `option-${index}`,
  }));
}

/**
 * Transform client selectOptions to server options
 * Handles both proper ClientPropertyOption format and raw objects from forms
 */
export function transformOptionsToServer(
  clientOptions: IPropertyOption[]
): IPropertyOption[] {
  if (!Array.isArray(clientOptions)) {
    return [];
  }

  return clientOptions.map((option, index) => {
    // Handle different input formats
    const name = option.name || option.label || `Option ${index + 1}`;
    const color = option.color || "#6366f1"; // Default color
    const value =
      option.id ||
      option.value ||
      name.toLowerCase().replace(/\s+/g, "-") ||
      `option-${index}`;

    return {
      id: option.id || value,
      name,
      color,
      description: option.description,
    };
  });
}

/**
 * Transform complete server property to client format
 * Since we're using the same types now, this is mostly a pass-through
 */
export function transformPropertyToClient(
  serverProperty: ServerProperty
): ClientProperty {
  return {
    ...serverProperty,
    // Transform options to selectOptions if needed
    selectOptions: serverProperty.options || [],
  };
}

/**
 * Transform complete client property to server format
 * Since we're using the same types now, this is mostly a pass-through
 */
export function transformPropertyToServer(
  clientProperty: Partial<ClientProperty>
): Partial<ServerProperty> {
  const serverProperty: Partial<ServerProperty> = {
    ...clientProperty,
    // Transform selectOptions to options if needed
    options: clientProperty.selectOptions,
  };

  return serverProperty;
}

/**
 * Transform array of server properties to client format
 */
export function transformPropertiesToClient(
  serverProperties: ServerProperty[]
): ClientProperty[] {
  return serverProperties.map(transformPropertyToClient);
}

/**
 * Transform array of client properties to server format
 */
export function transformPropertiesToServer(
  clientProperties: Partial<ClientProperty>[]
): Partial<ServerProperty>[] {
  return clientProperties.map(transformPropertyToServer);
}

/**
 * Handle special status property value transformation
 * Server uses underscores, client validation expects hyphens
 */
export function transformStatusValues(
  property: ClientProperty
): ClientProperty {
  if (property.id === "status" && property.selectOptions) {
    return {
      ...property,
      selectOptions: property.selectOptions.map((option) => ({
        ...option,
        id: option.id.replace(/_/g, "-"), // Convert underscore to hyphen
      })),
    };
  }
  return property;
}

/**
 * Main transformation function for books module properties
 * Handles all the special cases and transformations needed
 */
export function transformBooksProperties(
  serverProperties: ServerProperty[]
): ClientProperty[] {
  return serverProperties
    .map(transformPropertyToClient)
    .map(transformStatusValues);
}
