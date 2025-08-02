# Database Property Visibility System

A comprehensive property visibility system for database tables that allows users to show/hide columns at both global and view-specific levels.

## 🎯 Features

### Two-Level Visibility Control
- **Global Property Visibility**: Controls whether a property appears anywhere in the database
- **View-Specific Visibility**: Controls which properties are shown in specific table views

### User-Friendly Components
- **PropertyToggle**: Individual property visibility controls with tooltips
- **ColumnManager**: Comprehensive modal for managing all column visibility
- **HiddenPropertiesPanel**: Collapsible panel showing hidden properties with restore options

### Smart Interactions
- Visual indicators for different visibility states
- Bulk operations (Show All, Hide Non-Required)
- Undo/restore functionality
- Loading states and error handling
- Responsive design for mobile and desktop

## 🚀 Quick Start

### 1. Import Components

```typescript
import { 
    ColumnManager, 
    HiddenPropertiesPanel, 
    PropertyToggle 
} from '@/modules/databases/components/property-visibility';
```

### 2. Import Hooks

```typescript
import {
    useTogglePropertyVisibility,
    useUpdateViewVisibility,
    usePropertyVisibilityState
} from '@/modules/databases/hooks/usePropertyVisibility';
```

### 3. Basic Usage

```typescript
function MyDatabaseTable({ properties, currentView, databaseId }) {
    const togglePropertyMutation = useTogglePropertyVisibility();
    const updateViewVisibilityMutation = useUpdateViewVisibility();
    
    const {
        visibleProperties,
        hiddenProperties,
        hiddenCount
    } = usePropertyVisibilityState(properties, currentView);

    const handleToggleProperty = (propertyId: string, isVisible: boolean) => {
        togglePropertyMutation.mutate({ databaseId, propertyId, isVisible });
    };

    const handleUpdateViewVisibility = (visibleProperties: string[]) => {
        updateViewVisibilityMutation.mutate({ 
            databaseId, 
            viewId: currentView.id, 
            visibleProperties 
        });
    };

    return (
        <div>
            {/* Column Manager Button */}
            <ColumnManager
                properties={properties}
                currentView={currentView}
                databaseId={databaseId}
                onToggleProperty={handleToggleProperty}
                onUpdateViewVisibility={handleUpdateViewVisibility}
                onShowAll={() => {/* Show all properties */}}
                onHideNonRequired={() => {/* Hide non-required */}}
            />

            {/* Hidden Properties Panel */}
            {hiddenCount > 0 && (
                <HiddenPropertiesPanel
                    properties={properties}
                    currentView={currentView}
                    onToggleProperty={handleToggleProperty}
                    onRestoreAllGlobal={() => {/* Restore all global */}}
                    onRestoreAllView={() => {/* Restore all view */}}
                />
            )}

            {/* Individual Property Toggles */}
            {properties.map(property => (
                <PropertyToggle
                    key={property.id}
                    property={property}
                    isVisible={visibleProperties.includes(property)}
                    onToggle={handleToggleProperty}
                />
            ))}
        </div>
    );
}
```

## 📋 Component API

### PropertyToggle

Controls individual property visibility with visual indicators and tooltips.

```typescript
interface PropertyToggleProps {
    property: DatabaseProperty;
    isVisible: boolean;
    isGloballyHidden?: boolean;
    isViewHidden?: boolean;
    onToggle: (propertyId: string, isVisible: boolean) => void;
    isLoading?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    showType?: boolean;
    className?: string;
}
```

### ColumnManager

Comprehensive modal for managing all column visibility with bulk operations.

```typescript
interface ColumnManagerProps {
    properties: DatabaseProperty[];
    currentView?: DatabaseView;
    databaseId: string;
    onToggleProperty: (propertyId: string, isVisible: boolean) => void;
    onUpdateViewVisibility: (visibleProperties: string[]) => void;
    onShowAll: () => void;
    onHideNonRequired: () => void;
    isLoading?: boolean;
    trigger?: React.ReactNode;
}
```

### HiddenPropertiesPanel

Collapsible panel showing hidden properties with restore options.

```typescript
interface HiddenPropertiesPanelProps {
    properties: DatabaseProperty[];
    currentView?: DatabaseView;
    onToggleProperty: (propertyId: string, isVisible: boolean) => void;
    onRestoreAllGlobal: () => void;
    onRestoreAllView: () => void;
    isLoading?: boolean;
    className?: string;
}
```

## 🔧 Hooks API

### usePropertyVisibilityState

Helper hook to get property visibility state and statistics.

```typescript
const {
    visibleProperties,
    hiddenProperties,
    globallyHiddenProperties,
    viewHiddenProperties,
    isPropertyVisible,
    isPropertyGloballyHidden,
    isPropertyViewHidden,
    totalProperties,
    visibleCount,
    hiddenCount,
} = usePropertyVisibilityState(properties, currentView);
```

### useTogglePropertyVisibility

Mutation hook for toggling global property visibility.

```typescript
const togglePropertyMutation = useTogglePropertyVisibility();

togglePropertyMutation.mutate({
    databaseId: 'db-123',
    propertyId: 'prop-456',
    isVisible: true
});
```

### useUpdateViewVisibility

Mutation hook for updating view-specific property visibility.

```typescript
const updateViewVisibilityMutation = useUpdateViewVisibility();

updateViewVisibilityMutation.mutate({
    databaseId: 'db-123',
    viewId: 'view-456',
    visibleProperties: ['prop1', 'prop2', 'prop3']
});
```

## 🎨 Visual States

### Property States
- **✅ Visible**: Green eye icon, property is visible in current view
- **🔴 Globally Hidden**: Red eye-off icon, property is hidden from all views
- **🟠 View Hidden**: Orange eye-off icon, property is hidden only in current view
- **⚪ Loading**: Spinner icon during API operations

### Badges
- **Required**: Properties that cannot be hidden
- **Hidden**: Globally hidden properties
- **View Hidden**: Properties hidden in current view only

## 📱 Responsive Design

### Desktop
- Full-featured column manager modal
- Detailed property information with descriptions
- Bulk operation buttons
- Drag-and-drop support (future enhancement)

### Mobile
- Simplified column manager interface
- Touch-friendly toggle controls
- Bottom sheet modal for property management
- Essential information only

## 🔍 Demo Component

Use the `PropertyVisibilityDemo` component to see all features in action:

```typescript
import { PropertyVisibilityDemo } from '@/modules/databases/components/property-visibility';

function DemoPage() {
    return <PropertyVisibilityDemo />;
}
```

## 🚨 Error Handling

All mutations include automatic error handling with toast notifications:

- Success messages for completed operations
- Error messages with specific details
- Loading states during API calls
- Automatic cache invalidation on success

## 🎯 Best Practices

1. **Use Global Hiding** for properties that should never be visible (internal IDs, system fields)
2. **Use View-Specific Hiding** to create focused views for different use cases
3. **Preserve Required Properties** - they cannot be hidden and will always remain visible
4. **Provide Clear Feedback** - use tooltips and visual indicators to guide users
5. **Enable Bulk Operations** - allow users to quickly show/hide multiple properties
6. **Implement Undo Functionality** - let users easily restore hidden properties

## 🔄 Integration with Existing Tables

The system integrates seamlessly with existing `DatabaseDataTable` components:

```typescript
<DatabaseDataTable
    columns={columns}
    data={data}
    properties={properties}
    databaseId={databaseId}
    showPropertyVisibility={true} // Enable visibility features
    // ... other props
/>
```

## 📊 Performance Considerations

- Efficient state management with React Query
- Optimistic updates for better UX
- Debounced API calls for bulk operations
- Memoized calculations for visibility state
- Lazy loading of hidden properties panel
