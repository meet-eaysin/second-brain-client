import type {TPropertyValue} from "@/modules/database-view/types";

export const formatDate = (date: string | Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date))
}

export const formatDateTime = (date: string | Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date))
}

export const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncateText = (text: string, length: number): string => {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
}

export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9)
}

export const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void => {
    let timeoutId: NodeJS.Timeout
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(...args), delay)
    }
}

export const getStringValue = (val: TPropertyValue): string => {
  if (typeof val === "string") return val;
  if (val === null || val === undefined) return "";
  return String(val);
};

export const getNumberValue = (val: TPropertyValue): number | "" => {
  if (typeof val === "number") return val;
  if (typeof val === "string" && val !== "") {
    const num = Number(val);
    return isNaN(num) ? "" : num;
  }
  return "";
};

export const getDateValue = (val: TPropertyValue): Date | undefined => {
  if (val instanceof Date) return val;
  if (typeof val === "string" && val !== "") {
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
};

export const getBooleanValue = (val: TPropertyValue): boolean => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val === "true";
  return false;
};

export const getMultiSelectValues = (val: TPropertyValue): string[] => {
  if (Array.isArray(val)) return val as string[];
  return [];
};
