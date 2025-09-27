import type { TSelectOption } from "@/modules/database-view/types";

export type SelectOptionValue = string | TSelectOption;

export function normalizeSelectOption(option: unknown): SelectOptionValue {
  if (!option) return option as SelectOptionValue;
  if (typeof option === "string") return option;

  if (typeof option === "object") {
    const obj = option as Record<string, unknown>;

    if (obj.value && obj.label) {
      return {
        id: obj.value as string,
        name: obj.label as string,
        color: (obj.color as string) || "#6b7280",
      };
    }

    if (obj.id && obj.name) return obj as TSelectOption;

    // If it has _id, convert it to id
    if (obj._id) {
      const normalized = { ...obj };
      normalized.id = obj._id;
      delete normalized._id;
      // Also handle name/label conversion
      if (obj.label && !obj.name) {
        normalized.name = obj.label;
      }
      return normalized as TSelectOption;
    }

    // Handle cases where we have id but label instead of name
    if (obj.id && obj.label && !obj.name) {
      return {
        ...obj,
        name: obj.label,
      } as TSelectOption;
    }
  }

  return option as SelectOptionValue;
}

export function normalizeSelectOptions(
  options: unknown[]
): SelectOptionValue[] {
  if (!Array.isArray(options)) return [];

  return options.map(normalizeSelectOption);
}

export function normalizeSelectValue(
  value: unknown,
  isMultiSelect: boolean = false
): unknown {
  if (!value) return value;
  if (isMultiSelect && Array.isArray(value))
    return normalizeSelectOptions(value);

  if (
    !isMultiSelect &&
    (typeof value === "object" || typeof value === "string")
  ) {
    return normalizeSelectOption(value);
  }

  return value;
}

export function getSelectOptionId(
  option: TSelectOption | unknown
): string | undefined {
  if (!option) return undefined;

  if (typeof option === "string") return option;

  if (typeof option === "object") {
    const obj = option as Record<string, unknown>;
    return (obj.id || obj.value || obj._id) as string;
  }

  return undefined;
}
