/**
 * Property Data Transformation Utilities
 * 
 * Handles the transformation between server and client property formats:
 * - Server: uses 'options' and camelCase types ('multiSelect')
 * - Client: uses 'selectOptions' and UPPER_CASE types ('MULTI_SELECT')
 */

export interface ServerPropertyOption {
    name: string;
    color: string;
    value?: any;
}

export interface ClientPropertyOption {
    id: string;
    name: string;
    color: string;
}

export interface ServerProperty {
    id: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'multiSelect' | 'date' | 'boolean' | 'checkbox';
    description?: string;
    required: boolean;
    options: ServerPropertyOption[];
    frozen: boolean;
    order: number;
    visible: boolean;
    width: number;
    defaultValue?: any;
    validation?: {
        min?: number;
        max?: number;
    };
}

export interface ClientProperty {
    id: string;
    name: string;
    type: 'TEXT' | 'NUMBER' | 'SELECT' | 'MULTI_SELECT' | 'DATE' | 'BOOLEAN' | 'CHECKBOX';
    description?: string;
    required: boolean;
    selectOptions: ClientPropertyOption[];
    frozen: boolean;
    order: number;
    visible: boolean;
    width: number;
    defaultValue?: any;
    validation?: {
        min?: number;
        max?: number;
    };
}

/**
 * Transform server property type to client type
 */
export function transformPropertyTypeToClient(serverType: string): string {
    const typeMapping: Record<string, string> = {
        'text': 'TEXT',
        'number': 'NUMBER',
        'select': 'SELECT',
        'multiSelect': 'MULTI_SELECT',
        'date': 'DATE',
        'boolean': 'BOOLEAN',
        'checkbox': 'CHECKBOX'
    };
    
    return typeMapping[serverType] || serverType.toUpperCase();
}

/**
 * Transform client property type to server type
 */
export function transformPropertyTypeToServer(clientType: string): string {
    const typeMapping: Record<string, string> = {
        'TEXT': 'text',
        'NUMBER': 'number',
        'SELECT': 'select',
        'MULTI_SELECT': 'multiSelect',
        'DATE': 'date',
        'BOOLEAN': 'boolean',
        'CHECKBOX': 'checkbox'
    };
    
    return typeMapping[clientType] || clientType.toLowerCase();
}

/**
 * Transform server property options to client selectOptions
 */
export function transformOptionsToClient(serverOptions: ServerPropertyOption[]): ClientPropertyOption[] {
    return serverOptions.map((option, index) => ({
        id: option.value || option.name.toLowerCase().replace(/\s+/g, '-') || `option-${index}`,
        name: option.name,
        color: option.color
    }));
}

/**
 * Transform client selectOptions to server options
 * Handles both proper ClientPropertyOption format and raw objects from forms
 */
export function transformOptionsToServer(clientOptions: any[]): ServerPropertyOption[] {
    if (!Array.isArray(clientOptions)) {
        return [];
    }

    return clientOptions.map((option, index) => {
        // Handle different input formats
        const name = option.name || option.label || `Option ${index + 1}`;
        const color = option.color || '#6366f1'; // Default color
        const value = option.id || option.value || name.toLowerCase().replace(/\s+/g, '-') || `option-${index}`;

        return {
            name,
            color,
            value
        };
    });
}

/**
 * Transform complete server property to client format
 */
export function transformPropertyToClient(serverProperty: ServerProperty): ClientProperty {
    return {
        id: serverProperty.id,
        name: serverProperty.name,
        type: transformPropertyTypeToClient(serverProperty.type) as ClientProperty['type'],
        description: serverProperty.description,
        required: serverProperty.required,
        selectOptions: transformOptionsToClient(serverProperty.options || []),
        frozen: serverProperty.frozen,
        order: serverProperty.order,
        visible: serverProperty.visible,
        width: serverProperty.width,
        defaultValue: serverProperty.defaultValue,
        validation: serverProperty.validation
    };
}

/**
 * Transform complete client property to server format
 */
export function transformPropertyToServer(clientProperty: Partial<ClientProperty>): Partial<ServerProperty> {
    // Debug logging
    console.log('🔄 transformPropertyToServer input:', {
        clientProperty,
        hasSelectOptions: !!(clientProperty.selectOptions),
        selectOptionsType: typeof clientProperty.selectOptions,
        selectOptionsLength: Array.isArray(clientProperty.selectOptions) ? clientProperty.selectOptions.length : 'not array',
        selectOptions: clientProperty.selectOptions
    });

    const serverProperty: Partial<ServerProperty> = {
        id: clientProperty.id,
        name: clientProperty.name,
        description: clientProperty.description,
        required: clientProperty.required,
        frozen: clientProperty.frozen,
        order: clientProperty.order,
        visible: clientProperty.visible,
        width: clientProperty.width,
        defaultValue: clientProperty.defaultValue,
        validation: clientProperty.validation
    };

    // Transform type if provided
    if (clientProperty.type) {
        serverProperty.type = transformPropertyTypeToServer(clientProperty.type) as ServerProperty['type'];
    }

    // Transform selectOptions to options if provided
    if (clientProperty.selectOptions && Array.isArray(clientProperty.selectOptions)) {
        serverProperty.options = transformOptionsToServer(clientProperty.selectOptions);
    } else if ((clientProperty as any).selectOptions) {
        // Handle case where selectOptions might be in a different format
        serverProperty.options = transformOptionsToServer((clientProperty as any).selectOptions);
    }

    // Debug logging for output
    console.log('🔄 transformPropertyToServer output:', {
        serverProperty,
        hasOptions: !!(serverProperty.options),
        optionsLength: Array.isArray(serverProperty.options) ? serverProperty.options.length : 'not array',
        options: serverProperty.options
    });

    return serverProperty;
}

/**
 * Transform array of server properties to client format
 */
export function transformPropertiesToClient(serverProperties: ServerProperty[]): ClientProperty[] {
    return serverProperties.map(transformPropertyToClient);
}

/**
 * Transform array of client properties to server format
 */
export function transformPropertiesToServer(clientProperties: Partial<ClientProperty>[]): Partial<ServerProperty>[] {
    return clientProperties.map(transformPropertyToServer);
}

/**
 * Handle special status property value transformation
 * Server uses underscores, client validation expects hyphens
 */
export function transformStatusValues(property: ClientProperty): ClientProperty {
    if (property.id === 'status' && property.selectOptions) {
        return {
            ...property,
            selectOptions: property.selectOptions.map(option => ({
                ...option,
                id: option.id.replace(/_/g, '-') // Convert underscore to hyphen
            }))
        };
    }
    return property;
}

/**
 * Main transformation function for books module properties
 * Handles all the special cases and transformations needed
 */
export function transformBooksProperties(serverProperties: ServerProperty[]): ClientProperty[] {
    return serverProperties
        .map(transformPropertyToClient)
        .map(transformStatusValues);
}
