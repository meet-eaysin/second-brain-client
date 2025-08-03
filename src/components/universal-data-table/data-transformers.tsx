import type { DatabaseRecord, DatabaseProperty } from '@/types/database.types';
import type { ColumnDef } from '@tanstack/react-table';

/**
 * Transform any data array to DatabaseRecord format
 */
export function transformDataToRecords<T = Record<string, unknown>>(
    data: T[],
    idField: string = 'id'
): DatabaseRecord[] {
    return data.map((item: Record<string, unknown>) => {
        const id = item[idField] || item.id || generateId();
        
        // Extract properties from the item
        const properties: Record<string, unknown> = {};
        
        Object.keys(item).forEach(key => {
            if (key !== idField && key !== 'id') {
                properties[key] = item[key];
            }
        });
        
        return {
            id,
            properties,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString(),
            createdBy: item.createdBy || 'system',
            lastEditedBy: item.lastEditedBy || 'system',
        } as DatabaseRecord;
    });
}

/**
 * Transform columns to DatabaseProperty format
 */
export function transformColumnsToProperties<T = Record<string, unknown>>(
    columns: ColumnDef<T>[]
): DatabaseProperty[] {
    return columns
        .filter(col => col.id !== 'select' && col.id !== 'actions')
        .map((column, index) => {
            const id = column.id || String(column.accessorKey) || `col_${index}`;
            const name = getColumnName(column);
            const type = inferPropertyType(column);
            
            return {
                id,
                name,
                type,
                description: getColumnDescription(column),
                required: false,
                isVisible: true,
                order: index,
                hidden: false,
                frozen: false,
                orderIndex: index,
                width: getColumnWidth(column),
            } as DatabaseProperty;
        });
}

/**
 * Get column name from column definition
 */
function getColumnName<T>(column: ColumnDef<T>): string {
    if (typeof column.header === 'string') {
        return column.header;
    }
    
    if (column.id) {
        return formatFieldName(column.id);
    }
    
    if (column.accessorKey) {
        return formatFieldName(String(column.accessorKey));
    }
    
    return 'Unknown';
}

/**
 * Get column description from column definition
 */
function getColumnDescription<T>(column: ColumnDef<T>): string | undefined {
    // Check if column has meta with description
    if (column.meta && 'description' in column.meta) {
        return column.meta.description as string;
    }
    
    return undefined;
}

/**
 * Get column width from column definition
 */
function getColumnWidth<T>(column: ColumnDef<T>): number {
    if (column.size) {
        return column.size;
    }
    
    if (column.meta && 'width' in column.meta) {
        return column.meta.width as number;
    }
    
    return 150; // Default width
}

/**
 * Infer property type from column definition
 */
function inferPropertyType<T>(column: ColumnDef<T>): string {
    // Check if column has explicit type in meta
    if (column.meta && 'type' in column.meta) {
        return column.meta.type as string;
    }
    
    // Infer from column id/accessor
    const fieldName = column.id || String(column.accessorKey) || '';
    const lowerFieldName = fieldName.toLowerCase();
    
    // Date fields
    if (lowerFieldName.includes('date') || 
        lowerFieldName.includes('time') || 
        lowerFieldName.includes('created') || 
        lowerFieldName.includes('updated')) {
        return 'DATE';
    }
    
    // Email fields
    if (lowerFieldName.includes('email')) {
        return 'EMAIL';
    }
    
    // Phone fields
    if (lowerFieldName.includes('phone') || lowerFieldName.includes('tel')) {
        return 'PHONE';
    }
    
    // URL fields
    if (lowerFieldName.includes('url') || 
        lowerFieldName.includes('link') || 
        lowerFieldName.includes('website')) {
        return 'URL';
    }
    
    // Number fields
    if (lowerFieldName.includes('count') || 
        lowerFieldName.includes('amount') || 
        lowerFieldName.includes('price') || 
        lowerFieldName.includes('number') ||
        lowerFieldName.includes('score') ||
        lowerFieldName.includes('rating')) {
        return 'NUMBER';
    }
    
    // Boolean fields
    if (lowerFieldName.includes('is') || 
        lowerFieldName.includes('has') || 
        lowerFieldName.includes('enabled') || 
        lowerFieldName.includes('active') ||
        lowerFieldName.includes('completed') ||
        lowerFieldName.includes('done')) {
        return 'CHECKBOX';
    }
    
    // Status/Priority fields (likely select)
    if (lowerFieldName.includes('status') || 
        lowerFieldName.includes('priority') || 
        lowerFieldName.includes('type') ||
        lowerFieldName.includes('category') ||
        lowerFieldName.includes('stage')) {
        return 'SELECT';
    }
    
    // Tags/Labels (likely multi-select)
    if (lowerFieldName.includes('tags') || 
        lowerFieldName.includes('labels') || 
        lowerFieldName.includes('categories')) {
        return 'MULTI_SELECT';
    }
    
    // Default to text
    return 'TEXT';
}

/**
 * Format field name to human readable
 */
function formatFieldName(fieldName: string): string {
    return fieldName
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
        .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
        .trim();
}

/**
 * Generate a unique ID
 */
function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Transform DatabaseRecord back to original format
 */
export function transformRecordToData<T = any>(
    record: DatabaseRecord,
    originalFormat?: Partial<T>
): T {
    const result = {
        id: record.id,
        ...record.properties,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        createdBy: record.createdBy,
        lastEditedBy: record.lastEditedBy,
    };
    
    // If original format is provided, merge with it
    if (originalFormat) {
        return { ...originalFormat, ...result } as T;
    }
    
    return result as T;
}

/**
 * Transform multiple DatabaseRecords back to original format
 */
export function transformRecordsToData<T = any>(
    records: DatabaseRecord[],
    originalFormat?: Partial<T>
): T[] {
    return records.map(record => transformRecordToData(record, originalFormat));
}

/**
 * Transform Second Brain specific data formats
 */
export function transformSecondBrainData(
    data: any[],
    type: 'tasks' | 'projects' | 'goals' | 'notes' | 'people' | 'habits' | 'journal' | 'books' | 'content' | 'finances' | 'mood'
): DatabaseRecord[] {
    return data.map(item => {
        const properties: Record<string, any> = {};

        // Common transformations based on type
        switch (type) {
            case 'tasks':
                properties.title = item.title || item.name;
                properties.status = item.status || 'todo';
                properties.priority = item.priority || 'medium';
                properties.dueDate = item.dueDate || item.due_date;
                properties.assignee = item.assignee || item.assigned_to;
                properties.description = item.description;
                properties.completed = item.completed || item.status === 'completed';
                break;

            case 'projects':
                properties.name = item.name || item.title;
                properties.status = item.status || 'planning';
                properties.progress = item.progress || 0;
                properties.startDate = item.startDate || item.start_date;
                properties.endDate = item.endDate || item.end_date;
                properties.description = item.description;
                properties.owner = item.owner || item.project_manager;
                break;

            case 'goals':
                properties.title = item.title || item.name;
                properties.category = item.category || 'personal';
                properties.progress = item.progress || 0;
                properties.targetDate = item.targetDate || item.target_date;
                properties.description = item.description;
                properties.status = item.status || 'active';
                break;

            case 'notes':
                properties.title = item.title || item.name;
                properties.type = item.type || 'note';
                properties.content = item.content || item.body;
                properties.tags = item.tags || [];
                properties.lastModified = item.lastModified || item.updated_at;
                properties.favorite = item.favorite || item.is_favorite;
                break;

            case 'people':
                properties.name = item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim();
                properties.email = item.email;
                properties.phone = item.phone;
                properties.relationship = item.relationship || 'contact';
                properties.company = item.company || item.organization;
                properties.lastContact = item.lastContact || item.last_contact;
                break;

            case 'habits':
                properties.name = item.name || item.title;
                properties.frequency = item.frequency || 'daily';
                properties.streak = item.streak || item.current_streak || 0;
                properties.lastCompleted = item.lastCompleted || item.last_completed;
                properties.target = item.target || item.goal;
                properties.category = item.category;
                break;

            case 'journal':
                properties.date = item.date || item.entry_date;
                properties.title = item.title;
                properties.content = item.content || item.entry;
                properties.mood = item.mood;
                properties.tags = item.tags || [];
                properties.weather = item.weather;
                break;

            case 'books':
                properties.title = item.title;
                properties.author = item.author || item.authors;
                properties.status = item.status || 'want_to_read';
                properties.rating = item.rating || item.score;
                properties.pages = item.pages || item.page_count;
                properties.genre = item.genre || item.category;
                properties.dateStarted = item.dateStarted || item.start_date;
                properties.dateFinished = item.dateFinished || item.finish_date;
                break;

            default:
                // Copy all properties for unknown types
                Object.keys(item).forEach(key => {
                    if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
                        properties[key] = item[key];
                    }
                });
        }

        return {
            id: item.id || generateId(),
            properties,
            createdAt: item.createdAt || item.created_at || new Date().toISOString(),
            updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
            createdBy: item.createdBy || item.created_by || 'system',
            lastEditedBy: item.lastEditedBy || item.updated_by || 'system',
        } as DatabaseRecord;
    });
}

/**
 * Transform API response data to DatabaseRecord format
 */
export function transformApiResponseToRecords(
    response: any,
    dataPath?: string
): DatabaseRecord[] {
    let data = response;

    // Extract data from common API response structures
    if (dataPath) {
        data = dataPath.split('.').reduce((obj, key) => obj?.[key], response);
    } else if (response.data) {
        data = response.data;
    } else if (response.items) {
        data = response.items;
    } else if (response.results) {
        data = response.results;
    }

    if (!Array.isArray(data)) {
        data = [data];
    }

    return transformDataToRecords(data);
}

/**
 * Create property definitions from sample data
 */
export function createPropertiesFromSample(
    sampleData: any[],
    excludeFields: string[] = ['id', 'createdAt', 'updatedAt', 'createdBy', 'lastEditedBy']
): DatabaseProperty[] {
    if (sampleData.length === 0) return [];

    const fieldTypes: Record<string, Set<string>> = {};
    const fieldNames = new Set<string>();

    // Analyze all records to determine field types
    sampleData.forEach(record => {
        Object.keys(record).forEach(field => {
            if (excludeFields.includes(field)) return;

            fieldNames.add(field);

            if (!fieldTypes[field]) {
                fieldTypes[field] = new Set();
            }

            const value = record[field];
            const type = typeof value;

            if (value === null || value === undefined) {
                fieldTypes[field].add('null');
            } else if (Array.isArray(value)) {
                fieldTypes[field].add('array');
            } else if (type === 'boolean') {
                fieldTypes[field].add('boolean');
            } else if (type === 'number') {
                fieldTypes[field].add('number');
            } else if (type === 'string') {
                // Try to detect date strings
                if (isDateString(value)) {
                    fieldTypes[field].add('date');
                } else if (isEmailString(value)) {
                    fieldTypes[field].add('email');
                } else if (isUrlString(value)) {
                    fieldTypes[field].add('url');
                } else {
                    fieldTypes[field].add('string');
                }
            } else {
                fieldTypes[field].add('object');
            }
        });
    });

    // Convert to DatabaseProperty format
    return Array.from(fieldNames).map((fieldName, index) => {
        const types = fieldTypes[fieldName];
        const propertyType = inferDatabasePropertyType(types);

        return {
            id: fieldName,
            name: formatFieldName(fieldName),
            type: propertyType,
            required: false,
            isVisible: true,
            order: index,
            hidden: false,
            frozen: false,
            orderIndex: index,
            width: getDefaultWidthForType(propertyType),
        } as DatabaseProperty;
    });
}

/**
 * Helper functions for type detection
 */
function isDateString(value: string): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime()) && value.match(/^\d{4}-\d{2}-\d{2}/) !== null;
}

function isEmailString(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isUrlString(value: string): boolean {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

function inferDatabasePropertyType(types: Set<string>): string {
    if (types.has('boolean')) return 'CHECKBOX';
    if (types.has('number')) return 'NUMBER';
    if (types.has('date')) return 'DATE';
    if (types.has('email')) return 'EMAIL';
    if (types.has('url')) return 'URL';
    if (types.has('array')) return 'MULTI_SELECT';
    return 'TEXT';
}

function getDefaultWidthForType(type: string): number {
    switch (type) {
        case 'CHECKBOX': return 80;
        case 'NUMBER': return 100;
        case 'DATE': return 150;
        case 'EMAIL': return 200;
        case 'URL': return 200;
        case 'SELECT': return 120;
        case 'MULTI_SELECT': return 180;
        default: return 150;
    }
}
