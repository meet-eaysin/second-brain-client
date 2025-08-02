import type { SelectOption } from '@/types/database.types';

/**
 * Normalizes select option to ensure it has an 'id' field instead of '_id'
 * Handles backward compatibility with server responses that might return '_id'
 */
export function normalizeSelectOption(option: unknown): SelectOption {
    if (!option) return option;
    
    // If it's already a proper SelectOption with id, return as is
    if (option.id && !option._id) {
        return option as SelectOption;
    }
    
    // If it has _id, convert it to id
    if (option._id) {
        const normalized = { ...option };
        normalized.id = option._id;
        delete normalized._id;
        return normalized as SelectOption;
    }
    
    // If it's just a string (option ID), return as is
    if (typeof option === 'string') {
        return option;
    }
    
    return option as SelectOption;
}

/**
 * Normalizes an array of select options
 */
export function normalizeSelectOptions(options: unknown[]): SelectOption[] {
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
 */
export function getSelectOptionDisplay(option: unknown, fallback: string = 'Unknown'): string {
    if (!option) return fallback;
    
    if (typeof option === 'string') return option;
    
    if (typeof option === 'object' && option.name) {
        return option.name;
    }
    
    return fallback;
}

/**
 * Gets the ID value for a select option
 * Handles both normalized objects and string IDs
 */
export function getSelectOptionId(option: unknown): string | undefined {
    if (!option) return undefined;
    
    if (typeof option === 'string') return option;
    
    if (typeof option === 'object') {
        return option.id || option._id;
    }
    
    return undefined;
}

/**
 * Gets the color value for a select option
 * Handles both normalized objects and provides fallback
 */
export function getSelectOptionColor(option: unknown, fallback: string = '#6b7280'): string {
    if (!option) return fallback;
    
    if (typeof option === 'object' && option.color) {
        return option.color;
    }
    
    return fallback;
}
