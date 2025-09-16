import React from 'react';
import { 
  DynamicDatabaseDetail,
  ReadOnlyDatabaseView,
  EmbeddedDatabaseView,
  TableOnlyView,
  DatabaseWidget,
  DATABASE_VIEW_PRESETS,
  mergeConfig
} from '../components/dynamic-database-view';
import type { Database, DatabaseRecord, DatabaseProperty, DatabaseView } from '@/types/database.types';

// Example data
const exampleDatabase: Database = {
  id: 'example-db',
  name: 'My Tasks',
  icon: '📋',
  description: 'Task management database',
  properties: [
    { id: 'title', name: 'Title', type: 'TEXT', required: true, order: 0 },
    { id: 'status', name: 'Status', type: 'SELECT', required: false, order: 1, selectOptions: [
      { id: 'todo', name: 'To Do', color: '#gray' },
      { id: 'inprogress', name: 'In Progress', color: '#blue' },
      { id: 'done', name: 'Done', color: '#green' }
    ]},
    { id: 'priority', name: 'Priority', type: 'SELECT', required: false, order: 2, selectOptions: [
      { id: 'low', name: 'Low', color: '#green' },
      { id: 'medium', name: 'Medium', color: '#yellow' },
      { id: 'high', name: 'High', color: '#red' }
    ]},
    { id: 'assignee', name: 'Assignee', type: 'TEXT', required: false, order: 3 },
    { id: 'dueDate', name: 'Due Date', type: 'DATE', required: false, order: 4 }
  ],
  views: [
    {
      id: 'table-view',
      name: 'Table',
      type: 'TABLE',
      isDefault: true,
      visibleProperties: ['title', 'status', 'priority', 'assignee', 'dueDate'],
      filters: [],
      sorts: [{ propertyId: 'dueDate', direction: 'asc' }]
    },
    {
      id: 'board-view',
      name: 'Board',
      type: 'KANBAN',
      isDefault: false,
      visibleProperties: ['title', 'status', 'priority', 'assignee'],
      filters: [],
      sorts: [{ propertyId: 'priority', direction: 'desc' }]
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'user1',
  lastEditedBy: 'user1',
  frozen: false
};

const exampleRecords: DatabaseRecord[] = [
  {
    id: '1',
    properties: {
      title: 'Complete project proposal',
      status: 'inprogress',
      priority: 'high',
      assignee: 'John Doe',
      dueDate: '2024-01-15'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
    createdBy: 'user1',
    lastEditedBy: 'user1'
  },
  {
    id: '2',
    properties: {
      title: 'Review design mockups',
      status: 'done',
      priority: 'medium',
      assignee: 'Jane Smith',
      dueDate: '2024-01-20'
    },
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-12'),
    createdBy: 'user2',
    lastEditedBy: 'user2'
  }
];

// Example 1: Full-featured database view with external data
export function FullDatabaseExample() {
  return (
    <div className="h-screen">
      <DynamicDatabaseDetail
        database={exampleDatabase}
        records={exampleRecords}
        config={{
          ...DATABASE_VIEW_PRESETS.FULL,
          title: 'My Custom Tasks',
          icon: '✅',
          description: 'Custom task management with full features',
          onRecordSelect: (record) => console.log('Selected:', record),
          onRecordEdit: (record) => console.log('Edit:', record),
          onRecordDelete: (recordId) => console.log('Delete:', recordId),
          onRecordCreate: (groupValue) => console.log('Create:', groupValue),
          onRecordUpdate: (recordId, updates) => console.log('Update:', recordId, updates),
        }}
      />
    </div>
  );
}

// Example 2: Read-only view
export function ReadOnlyExample() {
  return (
    <div className="h-96 border rounded-lg">
      <ReadOnlyDatabaseView
        database={exampleDatabase}
        records={exampleRecords}
        config={{
          title: 'Read-Only Tasks',
          description: 'View-only task list'
        }}
      />
    </div>
  );
}

// Example 3: Embedded view (no header)
export function EmbeddedExample() {
  return (
    <div className="h-96 border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Tasks Dashboard</h2>
      <EmbeddedDatabaseView
        database={exampleDatabase}
        records={exampleRecords}
        config={{
          defaultViewId: 'board-view'
        }}
      />
    </div>
  );
}

// Example 4: Table-only view
export function TableOnlyExample() {
  return (
    <div className="h-64 border rounded-lg p-4">
      <TableOnlyView
        database={exampleDatabase}
        records={exampleRecords}
        config={{
          enablePagination: true
        }}
      />
    </div>
  );
}

// Example 5: Widget view
export function WidgetExample() {
  return (
    <div className="h-48 w-80 border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Recent Tasks</h3>
      <DatabaseWidget
        database={exampleDatabase}
        records={exampleRecords.slice(0, 3)} // Show only first 3 records
      />
    </div>
  );
}

// Example 6: Custom configuration
export function CustomConfigExample() {
  const customConfig = mergeConfig(DATABASE_VIEW_PRESETS.EMBEDDED, {
    enableSearch: true,
    canEdit: true,
    canDelete: false,
    hiddenProperties: ['assignee'], // Hide assignee column
    readOnlyProperties: ['status'], // Make status read-only
    title: 'Custom Task View',
    onRecordUpdate: (recordId, updates) => {
      console.log('Custom update handler:', recordId, updates);
      // Custom update logic here
    }
  });

  return (
    <div className="h-96 border rounded-lg">
      <DynamicDatabaseDetail
        database={exampleDatabase}
        records={exampleRecords}
        config={customConfig}
      />
    </div>
  );
}

// Example 7: URL-based usage (for routing)
export function UrlBasedExample() {
  return (
    <DynamicDatabaseDetail
      useUrlParams={true} // Will use URL params to fetch data
      config={{
        dataSourceType: 'database',
        enableViews: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        onBack: () => window.history.back()
      }}
    />
  );
}

// Example 8: Frozen database
export function FrozenExample() {
  return (
    <div className="h-96 border rounded-lg">
      <DynamicDatabaseDetail
        database={{ ...exampleDatabase, frozen: true }}
        records={exampleRecords}
        config={{
          ...DATABASE_VIEW_PRESETS.FROZEN,
          title: 'Archived Tasks',
          description: 'This database is frozen and cannot be edited'
        }}
      />
    </div>
  );
}

// Example 9: With loading state
export function LoadingExample() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<{ database: Database; records: DatabaseRecord[] } | null>(null);

  React.useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setData({ database: exampleDatabase, records: exampleRecords });
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="h-96 border rounded-lg">
      <DynamicDatabaseDetail
        database={data?.database}
        records={data?.records}
        isLoading={isLoading}
        config={{
          title: 'Loading Example',
          enableViews: true
        }}
      />
    </div>
  );
}

// Example 10: With error state
export function ErrorExample() {
  return (
    <div className="h-96 border rounded-lg">
      <DynamicDatabaseDetail
        error="Failed to load database data"
        config={{
          title: 'Error Example',
          showBackButton: true,
          onBack: () => console.log('Back clicked')
        }}
      />
    </div>
  );
}

// Main demo component
export function DynamicDatabaseExamples() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Dynamic Database View Examples</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Full-Featured View</h2>
          <FullDatabaseExample />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Read-Only View</h2>
          <ReadOnlyExample />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Embedded View</h2>
          <EmbeddedExample />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Table-Only View</h2>
          <TableOnlyExample />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Widget View</h2>
          <WidgetExample />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Custom Configuration</h2>
          <CustomConfigExample />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Frozen Database</h2>
          <FrozenExample />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Loading State</h2>
          <LoadingExample />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Error State</h2>
          <ErrorExample />
        </section>
      </div>
    </div>
  );
}
