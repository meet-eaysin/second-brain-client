# UniversalDataTable

A centralized, reusable data table component that wraps your existing database system and can be used everywhere in your Second Brain application and other places where you display lists/tables of data.

## Features

- **Centralized Management**: One component to rule them all - any changes or new features automatically impact everywhere it's used
- **Predefined Configurations**: Built-in configurations for tasks, projects, goals, notes, people, habits, journal, books, content, finances, and mood
- **Custom Actions**: Flexible action system with row-level and toolbar actions
- **Data Transformation**: Automatic transformation from any data format to database-compatible records
- **Advanced Features**: Filtering, sorting, column visibility, frozen columns, row selection, bulk operations
- **Type Safety**: Full TypeScript support with proper type definitions

## Basic Usage

```tsx
import { UniversalDataTable } from '@/components/universal-data-table';

// Simple usage with predefined configuration
<UniversalDataTable
    tableType="tasks"
    data={tasks}
    onCustomAction={handleCustomAction}
    onToolbarAction={handleToolbarAction}
/>
```

## Props

### Core Props

- `data: T[]` - Array of data to display
- `tableType` - Predefined table type: 'tasks' | 'projects' | 'goals' | 'notes' | 'people' | 'habits' | 'journal' | 'books' | 'content' | 'finances' | 'mood' | 'custom'
- `context` - Usage context: 'database' | 'second-brain' | 'general'

### Event Handlers

- `onRecordSelect?: (record: T) => void` - Called when a row is clicked
- `onRecordEdit?: (record: T) => void` - Called when edit action is triggered
- `onRecordDelete?: (recordId: string) => void` - Called when delete action is triggered
- `onRecordCreate?: () => void` - Called when create action is triggered
- `onCustomAction?: (actionId: string, record: T) => void` - Called for custom actions
- `onToolbarAction?: (actionId: string, records: T[]) => void` - Called for toolbar actions

### Feature Toggles

- `enableRowSelection?: boolean` - Enable row selection (default: true)
- `enableBulkActions?: boolean` - Enable bulk operations (default: true)
- `enableColumnVisibility?: boolean` - Enable column show/hide (default: true)
- `enableSorting?: boolean` - Enable column sorting (default: true)
- `enableFiltering?: boolean` - Enable filtering (default: true)
- `enablePagination?: boolean` - Enable pagination (default: true)

### Advanced Props

- `customActions?: CustomAction[]` - Additional custom actions
- `toolbarActions?: ToolbarAction[]` - Additional toolbar actions
- `properties?: DatabaseProperty[]` - Custom property definitions
- `dataTransformer?: (data: T[]) => DatabaseRecord[]` - Custom data transformer
- `idField?: string` - Field to use as record ID (default: 'id')

## Predefined Table Types

### Tasks
```tsx
<UniversalDataTable
    tableType="tasks"
    data={tasks}
    onCustomAction={(actionId, record) => {
        switch (actionId) {
            case 'complete':
                // Toggle task completion
                break;
            case 'edit':
                // Open edit dialog
                break;
            case 'delete':
                // Delete task
                break;
        }
    }}
/>
```

### Projects
```tsx
<UniversalDataTable
    tableType="projects"
    data={projects}
    onCustomAction={(actionId, record) => {
        switch (actionId) {
            case 'view':
                // View project details
                break;
            case 'edit':
                // Edit project
                break;
            case 'archive':
                // Archive project
                break;
        }
    }}
/>
```

### Notes
```tsx
<UniversalDataTable
    tableType="notes"
    data={notes}
    onCustomAction={(actionId, record) => {
        switch (actionId) {
            case 'open':
                // Open note
                break;
            case 'favorite':
                // Toggle favorite
                break;
            case 'share':
                // Share note
                break;
        }
    }}
/>
```

## Custom Actions

Define custom actions for specific use cases:

```tsx
const customActions = [
    {
        id: 'custom-action',
        label: 'Custom Action',
        icon: Star,
        onClick: (record) => console.log('Custom action:', record),
        isVisible: (record) => record.status === 'active',
        variant: 'default',
    },
];

<UniversalDataTable
    tableType="custom"
    data={data}
    customActions={customActions}
/>
```

## Toolbar Actions

Define toolbar actions for bulk operations:

```tsx
const toolbarActions = [
    {
        id: 'bulk-export',
        label: 'Export Selected',
        icon: Download,
        onClick: (records) => exportRecords(records),
        requiresSelection: true,
        variant: 'outline',
    },
];

<UniversalDataTable
    tableType="tasks"
    data={tasks}
    toolbarActions={toolbarActions}
/>
```

## Data Transformation

The component automatically transforms your data to work with the database system:

```tsx
// Your data format
const tasks = [
    {
        _id: '1',
        title: 'Task 1',
        status: 'todo',
        // ... other fields
    }
];

// Automatically transformed to database format
<UniversalDataTable
    tableType="tasks"
    data={tasks}
    idField="_id" // Specify which field to use as ID
/>
```

## Custom Properties

Define custom column properties:

```tsx
const customProperties = [
    {
        id: 'title',
        name: 'Task Title',
        type: 'TEXT',
        required: true,
        isVisible: true,
        width: 250,
    },
    {
        id: 'status',
        name: 'Status',
        type: 'SELECT',
        selectOptions: [
            { id: 'todo', name: 'To Do', color: '#6b7280' },
            { id: 'done', name: 'Done', color: '#10b981' },
        ],
        isVisible: true,
        width: 120,
    },
];

<UniversalDataTable
    tableType="custom"
    data={data}
    properties={customProperties}
/>
```

## Migration from Existing Tables

Replace your existing table implementations:

```tsx
// Before
<SecondBrainTable
    type="tasks"
    data={taskRecords}
    columns={columns}
    properties={config.defaultProperties}
    onCustomAction={handleCustomAction}
    onToolbarAction={handleToolbarAction}
/>

// After
<UniversalDataTable
    tableType="tasks"
    data={tasks} // Use original data format
    onCustomAction={handleCustomAction}
    onToolbarAction={handleToolbarAction}
/>
```

## Benefits

1. **Centralized Updates**: Add a new feature once, it appears everywhere
2. **Consistent UX**: Same look and behavior across all tables
3. **Reduced Code**: No need to maintain multiple table implementations
4. **Type Safety**: Full TypeScript support with proper types
5. **Flexibility**: Easy to customize while maintaining consistency
6. **Performance**: Built on top of your optimized database system

## Examples

See `example-usage.tsx` for complete working examples of different table types and configurations.
