import type { SelectOption } from '@/modules/document-view';

// Union type to handle both string IDs and full SelectOption objects
export type SelectOptionValue = string | SelectOption;

/**
 * Normalizes select option to ensure it has an 'id' field instead of '_id'
 * Handles backward compatibility with server responses that might return '_id'
 * Also handles backend format {value, label, color} -> {id, name, color}
 */
export function normalizeSelectOption(option: unknown): SelectOptionValue {
    if (!option) return option as SelectOptionValue;

    // If it's just a string (option ID), return as is
    if (typeof option === 'string') {
        return option;
    }

    // If it's an object, handle various format conversions
    if (typeof option === 'object') {
        const obj = option as any;

        // Handle backend format {value, label, color} -> {id, name, color}
        if (obj.value && obj.label) {
            return {
                id: obj.value,
                name: obj.label,
                color: obj.color || '#6b7280'
            } as SelectOption;
        }

        // If it's already a proper SelectOption with id, return as is
        if (obj.id && obj.name) {
            return obj as SelectOption;
        }

        // If it has _id, convert it to id
        if (obj._id) {
            const normalized = { ...obj };
            normalized.id = obj._id;
            delete normalized._id;
            // Also handle name/label conversion
            if (obj.label && !obj.name) {
                normalized.name = obj.label;
            }
            return normalized as SelectOption;
        }

        // Handle cases where we have id but label instead of name
        if (obj.id && obj.label && !obj.name) {
            return {
                ...obj,
                name: obj.label
            } as SelectOption;
        }
    }

    return option as SelectOptionValue;
}

/**
 * Normalizes an array of select options
 */
export function normalizeSelectOptions(options: unknown[]): SelectOptionValue[] {
    if (!Array.isArray(options)) return [];

    return options.map(normalizeSelectOption);
}

/**
 * Normalizes select option value from record properties
 * Handles both single select (object or string) and multi-select (array)
 */
export function normalizeSelectValue(value: unknown, isMultiSelect: boolean = false): unknown {
    if (!value) return value;

    if (isMultiSelect && Array.isArray(value)) {
        return normalizeSelectOptions(value);
    }

    if (!isMultiSelect && (typeof value === 'object' || typeof value === 'string')) {
        return normalizeSelectOption(value);
    }

    return value;
}

/**
 * Gets the display value for a select option
 * Handles both normalized objects and string IDs
 * Also handles backend format with 'label' field
 */
export function getSelectOptionDisplay(option: SelectOptionValue | unknown, fallback: string = 'Unknown'): string {
    if (!option) return fallback;

    if (typeof option === 'string') return option;

    if (typeof option === 'object') {
        const obj = option as any;
        // Try name first (frontend format), then label (backend format)
        if (obj.name) {
            return obj.name;
        }
        if (obj.label) {
            return obj.label;
        }
    }

    return fallback;
}

/**
 * Gets the ID value for a select option
 * Handles both normalized objects and string IDs
 * Also handles backend format with 'value' field
 */
export function getSelectOptionId(option: SelectOptionValue | unknown): string | undefined {
    if (!option) return undefined;

    if (typeof option === 'string') return option;

    if (typeof option === 'object') {
        const obj = option as any;
        // Try id first (frontend format), then value (backend format), then _id (legacy)
        return obj.id || obj.value || obj._id;
    }

    return undefined;
}

/**
 * Gets the color value for a select option
 * Handles both normalized objects and provides fallback
 */
export function getSelectOptionColor(option: SelectOptionValue | unknown, fallback: string = '#6b7280'): string {
    if (!option) return fallback;

    if (typeof option === 'object') {
        const obj = option as any;
        if (obj.color) {
            return obj.color;
        }
    }

    return fallback;
}

/**
 * Normalizes properties from API response to ensure selectOptions are in the correct format
 * Transforms backend format {value, label, color} to frontend format {id, name, color}
 */
export function normalizePropertiesFromAPI(properties: any[]): any[] {
    if (!Array.isArray(properties)) return properties;

    return properties.map(property => {
        if (!property) return property;

        // Only process SELECT and MULTI_SELECT properties
        if (['SELECT', 'MULTI_SELECT'].includes(property.type) && property.selectOptions) {
            return {
                ...property,
                selectOptions: normalizeSelectOptions(property.selectOptions)
            };
        }

        return property;
    });
}
