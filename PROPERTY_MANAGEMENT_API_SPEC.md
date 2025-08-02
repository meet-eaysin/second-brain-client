# Property Management API Specification

## Overview
This document outlines the server API requirements for comprehensive property management in the database system, including editing, reordering, filtering, sorting, and other column operations.

## Base URL
All endpoints are relative to: `/api/databases/{databaseId}/properties`

---

## 1. **Update Property Name**

### Endpoint
```
PATCH /api/databases/{databaseId}/properties/{propertyId}/name
```

### Request Body
```json
{
  "name": "New Property Name"
}
```

### Response
```json
{
  "success": true,
  "message": "Property name updated successfully",
  "data": {
    // Updated database object with modified property
    "id": "database_id",
    "name": "Database Name",
    "properties": [
      {
        "id": "property_id",
        "name": "New Property Name",
        "type": "TEXT",
        "order": 0,
        // ... other property fields
      }
    ]
    // ... other database fields
  }
}
```

---

## 2. **Change Property Type**

### Endpoint
```
PATCH /api/databases/{databaseId}/properties/{propertyId}/type
```

### Request Body
```json
{
  "type": "NUMBER",
  "preserveData": true,
  "conversionOptions": {
    "dateFormat": "YYYY-MM-DD",
    "numberFormat": "decimal",
    "defaultValue": null
  }
}
```

### Supported Types
- `TEXT`, `NUMBER`, `EMAIL`, `URL`, `PHONE`
- `CHECKBOX`, `DATE`, `SELECT`, `MULTI_SELECT`

### Response
```json
{
  "success": true,
  "message": "Property type changed successfully",
  "data": {
    // Updated database object
  },
  "warnings": [
    "Some data may have been lost during conversion"
  ]
}
```

---

## 3. **Reorder Property**

### Endpoint
```
PATCH /api/databases/{databaseId}/properties/{propertyId}/order
```

### Request Body
```json
{
  "order": 2,
  "insertMode": "before" // or "after"
}
```

### Response
```json
{
  "success": true,
  "message": "Property reordered successfully",
  "data": {
    // Updated database with reordered properties
  }
}
```

---

## 4. **Insert Property at Position**

### Endpoint
```
POST /api/databases/{databaseId}/properties/{targetPropertyId}/insert
```

### Request Body
```json
{
  "position": "left", // or "right"
  "name": "New Property",
  "type": "TEXT",
  "description": "Property description",
  "required": false,
  "isVisible": true,
  "selectOptions": [] // for SELECT/MULTI_SELECT types
}
```

### Response
```json
{
  "success": true,
  "message": "Property inserted successfully",
  "data": {
    // Updated database with new property inserted at specified position
  }
}
```

---

## 5. **Duplicate Property**

### Endpoint
```
POST /api/databases/{databaseId}/properties/{propertyId}/duplicate
```

### Request Body
```json
{
  "name": "Copy of Original Property", // optional, auto-generated if not provided
  "includeData": false, // whether to copy existing record values
  "position": "right" // where to place the duplicate
}
```

### Response
```json
{
  "success": true,
  "message": "Property duplicated successfully",
  "data": {
    // Updated database with duplicated property
  }
}
```

---

## 6. **Freeze/Unfreeze Property**

### Endpoint
```
PATCH /api/databases/{databaseId}/properties/{propertyId}/freeze
```

### Request Body
```json
{
  "frozen": true // or false to unfreeze
}
```

### Response
```json
{
  "success": true,
  "message": "Property frozen successfully",
  "data": {
    // Updated database with frozen property metadata
  }
}
```

---

## 7. **Hide/Show Property**

### Endpoint
```
PATCH /api/databases/{databaseId}/properties/{propertyId}/visibility
```

### Request Body
```json
{
  "hidden": true, // or false to show
  "hideFromViews": ["view_id_1", "view_id_2"], // optional: specific views
  "hideFromUsers": ["user_id_1"] // optional: specific users
}
```

### Response
```json
{
  "success": true,
  "message": "Property visibility updated",
  "data": {
    // Updated database with visibility settings
  }
}
```

---

## 8. **Property Filtering**

### Endpoint
```
GET /api/databases/{databaseId}/records
```

### Query Parameters
```
?filters=[
  {
    "propertyId": "property_id",
    "operator": "equals", // equals, not_equals, contains, starts_with, ends_with, greater_than, less_than, is_empty, is_not_empty
    "value": "filter_value",
    "type": "TEXT"
  }
]
```

### Response
```json
{
  "success": true,
  "data": {
    "records": [
      // Filtered records
    ],
    "total": 25,
    "filteredTotal": 10,
    "appliedFilters": [
      // Filter metadata
    ]
  }
}
```

---

## 9. **Property Sorting**

### Endpoint
```
GET /api/databases/{databaseId}/records
```

### Query Parameters
```
?sorts=[
  {
    "propertyId": "property_id",
    "direction": "asc", // or "desc"
    "priority": 1 // for multi-column sorting
  }
]
```

### Response
```json
{
  "success": true,
  "data": {
    "records": [
      // Sorted records
    ],
    "total": 100,
    "appliedSorts": [
      // Sort metadata
    ]
  }
}
```

---

## 10. **Bulk Property Operations**

### Endpoint
```
PATCH /api/databases/{databaseId}/properties/bulk
```

### Request Body
```json
{
  "operations": [
    {
      "type": "reorder",
      "propertyId": "prop_1",
      "order": 0
    },
    {
      "type": "hide",
      "propertyId": "prop_2",
      "hidden": true
    },
    {
      "type": "freeze",
      "propertyId": "prop_3",
      "frozen": true
    }
  ]
}
```

### Response
```json
{
  "success": true,
  "message": "Bulk operations completed",
  "data": {
    // Updated database
  },
  "results": [
    {
      "operation": "reorder",
      "propertyId": "prop_1",
      "success": true
    }
  ]
}
```

---

## Database Schema Updates

### Property Model Extensions
```json
{
  "id": "property_id",
  "name": "Property Name",
  "type": "TEXT",
  "description": "Property description",
  "required": false,
  "isVisible": true,
  "order": 0,
  "frozen": false,
  "hidden": false,
  "hiddenFromViews": [],
  "hiddenFromUsers": [],
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z",
  "selectOptions": [], // for SELECT/MULTI_SELECT
  "validationRules": {
    "minLength": 0,
    "maxLength": 255,
    "pattern": "regex_pattern",
    "min": 0,
    "max": 100
  }
}
```

### View Model Extensions
```json
{
  "id": "view_id",
  "name": "View Name",
  "type": "table",
  "visibleProperties": ["prop_1", "prop_2"],
  "hiddenProperties": ["prop_3"],
  "frozenProperties": ["prop_1"],
  "propertyOrder": ["prop_1", "prop_2", "prop_3"],
  "filters": [
    {
      "propertyId": "prop_1",
      "operator": "equals",
      "value": "test"
    }
  ],
  "sorts": [
    {
      "propertyId": "prop_1",
      "direction": "asc",
      "priority": 1
    }
  ]
}
```

---

## Error Handling

### Common Error Responses
```json
{
  "success": false,
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Property not found",
    "details": {
      "propertyId": "invalid_id"
    }
  }
}
```

### Error Codes
- `PROPERTY_NOT_FOUND` - Property doesn't exist
- `INVALID_PROPERTY_TYPE` - Unsupported property type
- `TYPE_CONVERSION_ERROR` - Cannot convert existing data to new type
- `DUPLICATE_PROPERTY_NAME` - Property name already exists
- `INVALID_ORDER` - Invalid order position
- `PERMISSION_DENIED` - User lacks permission for operation
- `DATABASE_NOT_FOUND` - Database doesn't exist

---

## Implementation Notes

1. **Data Conversion**: When changing property types, implement smart conversion logic
2. **Validation**: Validate all property operations before applying
3. **Permissions**: Check user permissions for each operation
4. **Audit Trail**: Log all property changes for audit purposes
5. **Real-time Updates**: Consider WebSocket updates for collaborative editing
6. **Backup**: Create backups before destructive operations
7. **Rollback**: Implement rollback mechanism for failed operations
