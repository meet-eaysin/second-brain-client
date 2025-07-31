# Server Implementation Requirements for Multiple Databases with Sidebar Submenus

## 🎯 Overview
Implement server-side support for multiple database creation, categorization, and dynamic sidebar menu generation.

## 📊 Database Schema Updates

### 1. **Update Databases Table**
```sql
ALTER TABLE databases ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;
ALTER TABLE databases ADD COLUMN IF NOT EXISTS category_id VARCHAR(255);
ALTER TABLE databases ADD COLUMN IF NOT EXISTS tags TEXT[]; -- PostgreSQL array or JSON for other DBs
ALTER TABLE databases ADD INDEX idx_databases_category_id (category_id);
ALTER TABLE databases ADD INDEX idx_databases_owner_favorite (owner_id, is_favorite);
```

### 2. **Create Database Categories Table**
```sql
CREATE TABLE database_categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50),
    owner_id VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_categories_owner (owner_id),
    INDEX idx_categories_sort (owner_id, sort_order),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. **Create Default Categories**
```sql
-- Insert default categories for each user
INSERT INTO database_categories (id, name, icon, color, owner_id, is_default, sort_order) VALUES
('default-personal', 'Personal', '👤', '#8B5CF6', '{USER_ID}', TRUE, 1),
('default-work', 'Work', '💼', '#3B82F6', '{USER_ID}', TRUE, 2),
('default-projects', 'Projects', '🚀', '#10B981', '{USER_ID}', TRUE, 3),
('default-archive', 'Archive', '📦', '#6B7280', '{USER_ID}', TRUE, 4);
```

## 🔧 API Endpoints

### **Database Categories API**

#### **GET /api/v1/categories**
```typescript
// Get all categories for current user
Response: {
    success: boolean;
    data: DatabaseCategory[];
    message: string;
}
```

#### **POST /api/v1/categories**
```typescript
// Create new category
Request: {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
}

Response: {
    success: boolean;
    data: DatabaseCategory;
    message: string;
}
```

#### **PUT /api/v1/categories/:id**
```typescript
// Update category
Request: {
    name?: string;
    description?: string;
    icon?: string;
    color?: string;
}

Response: {
    success: boolean;
    data: DatabaseCategory;
    message: string;
}
```

#### **DELETE /api/v1/categories/:id**
```typescript
// Delete category (move databases to default category)
Response: {
    success: boolean;
    message: string;
}
```

#### **PUT /api/v1/categories/reorder**
```typescript
// Reorder categories
Request: {
    categoryIds: string[];
}

Response: {
    success: boolean;
    message: string;
}
```

### **Enhanced Database API**

#### **GET /api/v1/databases**
```typescript
// Enhanced with category filtering and sidebar data
Query Parameters: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    isFavorite?: boolean;
    ownerId?: string;
    isPublic?: boolean;
    sortBy?: 'name' | 'created' | 'updated';
    sortOrder?: 'asc' | 'desc';
    includeSidebarData?: boolean; // For sidebar menu generation
}

Response: {
    success: boolean;
    data: Database[];
    pagination?: {
        total: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
    sidebarData?: {
        categories: DatabaseCategory[];
        recentDatabases: Database[];
        favoriteDatabases: Database[];
        myDatabases: Database[];
        sharedDatabases: Database[];
    };
    message: string;
}
```

#### **POST /api/v1/databases**
```typescript
// Enhanced database creation
Request: {
    name: string;
    description?: string;
    icon?: string;
    cover?: string;
    categoryId?: string;
    isPublic?: boolean;
    tags?: string[];
    templateId?: string; // For creating from templates
}

Response: {
    success: boolean;
    data: Database;
    message: string;
}
```

#### **PUT /api/v1/databases/:id/favorite**
```typescript
// Toggle favorite status
Request: {
    isFavorite: boolean;
}

Response: {
    success: boolean;
    data: Database;
    message: string;
}
```

#### **PUT /api/v1/databases/:id/category**
```typescript
// Move database to category
Request: {
    categoryId: string;
}

Response: {
    success: boolean;
    data: Database;
    message: string;
}
```

## 🏗️ Backend Implementation

### **1. Category Service**
```typescript
class CategoryService {
    async createDefaultCategories(userId: string): Promise<void> {
        // Create default categories when user signs up
    }

    async getCategories(userId: string): Promise<DatabaseCategory[]> {
        // Get all categories for user, ordered by sort_order
    }

    async createCategory(userId: string, data: CreateCategoryRequest): Promise<DatabaseCategory> {
        // Create new category with validation
    }

    async updateCategory(categoryId: string, userId: string, data: UpdateCategoryRequest): Promise<DatabaseCategory> {
        // Update category with ownership validation
    }

    async deleteCategory(categoryId: string, userId: string): Promise<void> {
        // Delete category and move databases to default category
    }

    async reorderCategories(userId: string, categoryIds: string[]): Promise<void> {
        // Update sort_order for categories
    }
}
```

### **2. Enhanced Database Service**
```typescript
class DatabaseService {
    async getDatabases(userId: string, filters: DatabaseFilters): Promise<DatabaseResponse> {
        // Enhanced filtering with categories, favorites, etc.
    }

    async getSidebarData(userId: string): Promise<SidebarData> {
        // Get organized data for sidebar menu
        return {
            categories: await this.categoryService.getCategories(userId),
            recentDatabases: await this.getRecentDatabases(userId, 5),
            favoriteDatabases: await this.getFavoriteDatabases(userId),
            myDatabases: await this.getMyDatabases(userId),
            sharedDatabases: await this.getSharedDatabases(userId),
        };
    }

    async createDatabase(userId: string, data: CreateDatabaseRequest): Promise<Database> {
        // Enhanced creation with category assignment
    }

    async toggleFavorite(databaseId: string, userId: string, isFavorite: boolean): Promise<Database> {
        // Toggle favorite status with permission check
    }

    async moveToCategory(databaseId: string, userId: string, categoryId: string): Promise<Database> {
        // Move database to category with validation
    }
}
```

### **3. Middleware & Validation**
```typescript
// Category validation
const categoryValidation = {
    create: {
        name: { required: true, minLength: 1, maxLength: 100 },
        description: { maxLength: 500 },
        icon: { maxLength: 50 },
        color: { pattern: /^#[0-9A-F]{6}$/i },
    },
    update: {
        name: { minLength: 1, maxLength: 100 },
        description: { maxLength: 500 },
        icon: { maxLength: 50 },
        color: { pattern: /^#[0-9A-F]{6}$/i },
    }
};

// Enhanced database validation
const databaseValidation = {
    create: {
        name: { required: true, minLength: 1, maxLength: 100 },
        description: { maxLength: 1000 },
        categoryId: { exists: 'categories.id' },
        tags: { array: true, maxItems: 10 },
    }
};
```

## 🔐 Security & Permissions

### **1. Category Permissions**
```typescript
// Users can only manage their own categories
const categoryPermissions = {
    create: 'own',
    read: 'own',
    update: 'own',
    delete: 'own', // Cannot delete default categories
    reorder: 'own',
};
```

### **2. Database Permissions**
```typescript
// Enhanced database permissions
const databasePermissions = {
    create: 'authenticated',
    read: 'owner_or_shared_or_public',
    update: 'owner_or_admin_permission',
    delete: 'owner_or_admin_permission',
    favorite: 'owner_or_shared',
    categorize: 'owner_only',
};
```

## 📈 Performance Optimizations

### **1. Database Indexes**
```sql
-- Optimize sidebar queries
CREATE INDEX idx_databases_sidebar ON databases (owner_id, is_favorite, updated_at DESC);
CREATE INDEX idx_databases_category_owner ON databases (category_id, owner_id);
CREATE INDEX idx_databases_recent ON databases (owner_id, updated_at DESC);
```

### **2. Caching Strategy**
```typescript
// Cache sidebar data for 5 minutes
const SIDEBAR_CACHE_TTL = 300; // 5 minutes

// Cache categories for 30 minutes
const CATEGORY_CACHE_TTL = 1800; // 30 minutes

// Invalidate cache on database/category changes
const invalidateSidebarCache = (userId: string) => {
    cache.del(`sidebar:${userId}`);
    cache.del(`categories:${userId}`);
};
```

### **3. Optimized Queries**
```sql
-- Single query for sidebar data
SELECT 
    d.*,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color
FROM databases d
LEFT JOIN database_categories c ON d.category_id = c.id
WHERE d.owner_id = ? OR d.id IN (
    SELECT database_id FROM database_permissions 
    WHERE user_id = ? AND permission IN ('read', 'write', 'admin')
)
ORDER BY d.updated_at DESC;
```

## 🚀 Implementation Steps

### **Phase 1: Database Schema**
1. ✅ Update databases table with new columns
2. ✅ Create database_categories table
3. ✅ Create indexes for performance
4. ✅ Create default categories for existing users

### **Phase 2: API Development**
1. ✅ Implement category CRUD endpoints
2. ✅ Enhance database endpoints with category support
3. ✅ Add sidebar data endpoint
4. ✅ Implement favorite toggle functionality

### **Phase 3: Business Logic**
1. ✅ Create CategoryService with validation
2. ✅ Enhance DatabaseService with category support
3. ✅ Implement permission checks
4. ✅ Add caching layer

### **Phase 4: Testing & Optimization**
1. ✅ Unit tests for all services
2. ✅ Integration tests for API endpoints
3. ✅ Performance testing for sidebar queries
4. ✅ Load testing for multiple databases

This implementation will provide a robust foundation for multiple database management with organized sidebar navigation! 🎉
