# Enhanced Header System

## Overview

The Enhanced Header is a streamlined, context-aware header component that provides better UX/UI by:

- **Reduced Height**: Only 48px (12 units) vs previous 64px (16 units)
- **Context-Aware Actions**: Page-specific actions in the header
- **Always Accessible**: Essential functions available via dropdown
- **Clean Design**: Minimal visual clutter

## Usage

### Basic Usage

```tsx
import { EnhancedHeader } from '@/components/enhanced-header';

// Simple page with search
<EnhancedHeader />

// Page without search
<EnhancedHeader showSearch={false} />
```

### With Context Actions

```tsx
// Single action
<EnhancedHeader 
    contextActions={
        <Button size="sm" className="h-8 gap-2">
            <Plus className="h-4 w-4" />
            New Item
        </Button>
    }
/>

// Multiple actions
<EnhancedHeader 
    contextActions={
        <>
            <Button size="sm" variant="outline" className="h-8 gap-2">
                <Filter className="h-4 w-4" />
                Filter
            </Button>
            <Button size="sm" className="h-8 gap-2">
                <Plus className="h-4 w-4" />
                New Item
            </Button>
        </>
    }
/>
```

## Page Layout Pattern

### Before (Old Pattern)
```tsx
return (
    <>
        <EnhancedHeader />
        
        <Main className="space-y-8">
            {/* Duplicate header content */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
                    <p className="text-muted-foreground">Page description</p>
                </div>
                <Button>Action</Button>
            </div>
            
            {/* Page content */}
        </Main>
    </>
);
```

### After (New Pattern)
```tsx
return (
    <>
        <EnhancedHeader 
            contextActions={
                <Button size="sm" className="h-8 gap-2">
                    <Plus className="h-4 w-4" />
                    Action
                </Button>
            }
        />
        
        <Main className="space-y-8">
            {/* Optional page description only */}
            <div className="space-y-2">
                <p className="text-muted-foreground">
                    Page description (optional)
                </p>
            </div>
            
            {/* Page content */}
        </Main>
    </>
);
```

## Header Features

### 1. Page Title (Auto-generated)
- Automatically extracted from URL path
- Small, subtle text (`text-xs`, `text-muted-foreground`)
- No need to manually specify titles

### 2. Compact Search
- 8px height (h-8)
- Keyboard shortcut indicator (⌘K)
- Can be disabled with `showSearch={false}`

### 3. Utility Dropdown
Always accessible functions:
- Quick Add
- Notifications
- AI Assistant (coming soon)
- Settings

### 4. Essential Controls
- Theme toggle
- Profile dropdown

## Button Sizing Guidelines

For context actions, always use:
- `size="sm"` 
- `className="h-8 gap-2"`
- Icons: `className="h-4 w-4"`

```tsx
// Correct
<Button size="sm" className="h-8 gap-2">
    <Plus className="h-4 w-4" />
    Action
</Button>

// Incorrect
<Button>
    <Plus className="h-4 w-4 mr-2" />
    Action
</Button>
```

## Common Patterns

### Dashboard Pages
```tsx
<EnhancedHeader 
    showSearch={false}
    contextActions={
        <Button size="sm" variant="outline" className="h-8 gap-2">
            <Download className="h-4 w-4" />
            Download
        </Button>
    }
/>
```

### List Pages
```tsx
<EnhancedHeader 
    contextActions={
        <Button size="sm" className="h-8 gap-2">
            <Plus className="h-4 w-4" />
            Add Item
        </Button>
    }
/>
```

### Analytics Pages
```tsx
<EnhancedHeader 
    contextActions={
        <>
            <Button size="sm" variant="outline" className="h-8 gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
            </Button>
            <Button size="sm" className="h-8 gap-2">
                <Plus className="h-4 w-4" />
                Add Item
            </Button>
        </>
    }
/>
```

## Benefits

1. **Space Efficiency**: 25% less header height
2. **Better UX**: Context actions always visible
3. **Consistency**: Standardized button sizes and spacing
4. **Accessibility**: Essential functions always available
5. **Clean Design**: No duplicate content between header and page
