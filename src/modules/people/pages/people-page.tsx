import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { DocumentView } from "@/modules/document-view";
import {
  usePeopleViewsQuery,
  useDefaultPeopleViewQuery,
  usePeopleViewConfigQuery,
  usePeopleFrozenConfigQuery,
  usePeopleQuery,
  useUpdatePersonMutation,
  useDeletePersonMutation,
} from "../hooks/use-people-document-view";

export function PeoplePage() {
  const { data: viewConfig } = usePeopleViewConfigQuery();
  const { frozenConfig: apiFrozenConfig } = usePeopleFrozenConfigQuery();
  const { data: views, isLoading: viewsLoading } = usePeopleViewsQuery();
  const { data: defaultView } = useDefaultPeopleViewQuery();
  const { data: peopleResponse, isLoading: peopleLoading } = usePeopleQuery();

  const people = peopleResponse?.people || [];
  const apiViews = views || [];
  const defaultProperties = viewConfig?.defaultProperties || [];
  const databaseMetadata = viewConfig?.database;

  const allCustomProperties =
    apiViews?.flatMap((view) => (view as any).customProperties || []) || [];
  const apiProperties = [...defaultProperties, ...allCustomProperties];

  const currentUserId = "demo-user";

  const databaseId = databaseMetadata?.id || `people-${currentUserId}-db`;

  const updatePersonMutation = useUpdatePersonMutation();
  const deletePersonMutation = useDeletePersonMutation();

  // Event Handlers
  const handleRecordEdit = (record: any) => {
    console.log("Edit person:", record);
  };

  const handleRecordDelete = (recordId: string) => {
    deletePersonMutation.mutate(recordId);
  };

  const handleRecordUpdate = (
    recordId: string,
    updates: Record<string, any>
  ) => {
    updatePersonMutation.mutate({
      personId: recordId,
      updates,
    });
  };

  // Demo data for testing
  const peopleRecords = [
    {
      id: "p1",
      databaseId: databaseId,
      createdAt: "2025-01-10T10:00:00.000Z",
      updatedAt: "2025-03-05T12:30:00.000Z",
      createdBy: currentUserId,
      properties: {
        firstName: "Alice",
        lastName: "Johnson",
        fullName: "Alice Johnson",
        email: "alice.johnson@example.com",
        phone: "+1 (555) 123-4567",
        company: "Acme Corp",
        status: "customer",
        relationship: "business",
        tags: ["VIP", "Newsletter"],
        lastContacted: "2025-03-01T09:00:00.000Z",
        nextContactDate: "2025-09-20T09:00:00.000Z",
        notes: ["Interested in premium plan", "Prefers email contact"],
        projects: ["Onboarding Flow"],
        tasks: ["Follow up call"],
        socialLinks: { linkedin: "https://linkedin.com/in/alice-j" },
        birthday: "1990-05-12",
        favoriteColor: "Blue",
        createdAt: "2025-01-10T10:00:00.000Z",
        updatedAt: "2025-03-05T12:30:00.000Z",
      },
    },
    {
      id: "p2",
      databaseId: databaseId,
      createdAt: "2025-02-14T08:00:00.000Z",
      updatedAt: "2025-02-28T15:20:00.000Z",
      createdBy: currentUserId,
      properties: {
        firstName: "Bob",
        lastName: "Martinez",
        fullName: "Bob Martinez",
        email: "bob.martinez@example.com",
        phone: "+1 (555) 765-4321",
        company: "Beta LLC",
        status: "lead",
        relationship: "personal",
        tags: ["Event", "Follow-up"],
        lastContacted: "2025-02-25T11:00:00.000Z",
        nextContactDate: "2025-09-18T14:00:00.000Z",
        notes: ["Met at conference", "Interested in collab"],
        projects: [],
        tasks: [],
        socialLinks: { twitter: "https://twitter.com/bobm" },
        birthday: "1985-09-22",
        favoriteColor: "Green",
        createdAt: "2025-02-14T08:00:00.000Z",
        updatedAt: "2025-02-28T15:20:00.000Z",
      },
    },
    {
      id: "p3",
      databaseId: databaseId,
      createdAt: "2025-03-01T14:30:00.000Z",
      updatedAt: "2025-03-15T11:45:00.000Z",
      createdBy: currentUserId,
      properties: {
        firstName: "Carol",
        lastName: "Williams",
        fullName: "Carol Williams",
        email: "carol.williams@example.com",
        phone: "+1 (555) 987-6543",
        company: "Gamma Inc",
        status: "customer",
        relationship: "business",
        tags: ["Enterprise", "Support"],
        lastContacted: "2025-03-10T10:00:00.000Z",
        nextContactDate: "2025-10-01T10:00:00.000Z",
        notes: ["Enterprise client", "Technical support contact"],
        projects: ["API Integration", "Custom Dashboard"],
        tasks: ["Schedule training"],
        socialLinks: { linkedin: "https://linkedin.com/in/carol-w" },
        birthday: "1988-12-03",
        favoriteColor: "Purple",
        createdAt: "2025-03-01T14:30:00.000Z",
        updatedAt: "2025-03-15T11:45:00.000Z",
      },
    },
    {
      id: "p4",
      databaseId: databaseId,
      createdAt: "2025-04-05T09:15:00.000Z",
      updatedAt: "2025-04-20T16:20:00.000Z",
      createdBy: currentUserId,
      properties: {
        firstName: "David",
        lastName: "Chen",
        fullName: "David Chen",
        email: "david.chen@example.com",
        phone: "+1 (555) 456-7890",
        company: "Delta Solutions",
        status: "lead",
        relationship: "business",
        tags: ["Hot Lead", "Demo Scheduled"],
        lastContacted: "2025-04-18T15:00:00.000Z",
        nextContactDate: "2025-04-25T14:00:00.000Z",
        notes: ["Very interested", "Decision maker"],
        projects: [],
        tasks: ["Prepare demo", "Send contract"],
        socialLinks: { twitter: "https://twitter.com/davidc" },
        birthday: "1992-07-18",
        favoriteColor: "Red",
        createdAt: "2025-04-05T09:15:00.000Z",
        updatedAt: "2025-04-20T16:20:00.000Z",
      },
    },
    {
      id: "p5",
      databaseId: databaseId,
      createdAt: "2025-05-12T13:45:00.000Z",
      updatedAt: "2025-05-28T10:30:00.000Z",
      createdBy: currentUserId,
      properties: {
        firstName: "Eva",
        lastName: "Rodriguez",
        fullName: "Eva Rodriguez",
        email: "eva.rodriguez@example.com",
        phone: "+1 (555) 234-5678",
        company: "Epsilon Labs",
        status: "customer",
        relationship: "personal",
        tags: ["Referral", "Long-term"],
        lastContacted: "2025-05-25T11:30:00.000Z",
        nextContactDate: "2025-11-15T11:00:00.000Z",
        notes: ["Referred by Alice", "Loyal customer"],
        projects: ["Mobile App"],
        tasks: ["Check satisfaction"],
        socialLinks: { instagram: "https://instagram.com/evar" },
        birthday: "1987-03-25",
        favoriteColor: "Yellow",
        createdAt: "2025-05-12T13:45:00.000Z",
        updatedAt: "2025-05-28T10:30:00.000Z",
      },
    },
  ];

  // Demo properties for the database
  const demoProperties = [
    {
      id: "firstName",
      name: "First Name",
      type: "TEXT",
      description: "Person's first name",
      required: true,
      isVisible: true,
      order: 0,
    },
    {
      id: "lastName",
      name: "Last Name",
      type: "TEXT",
      description: "Person's last name",
      required: true,
      isVisible: true,
      order: 1,
    },
    {
      id: "email",
      name: "Email",
      type: "EMAIL",
      description: "Email address",
      required: true,
      isVisible: true,
      order: 2,
    },
    {
      id: "phone",
      name: "Phone",
      type: "PHONE",
      description: "Phone number",
      required: false,
      isVisible: true,
      order: 3,
    },
    {
      id: "company",
      name: "Company",
      type: "TEXT",
      description: "Company name",
      required: false,
      isVisible: true,
      order: 4,
    },
    {
      id: "status",
      name: "Status",
      type: "SELECT",
      description: "Contact status",
      required: true,
      isVisible: true,
      order: 5,
      selectOptions: [
        { id: "lead", name: "Lead", color: "blue" },
        { id: "customer", name: "Customer", color: "green" },
        { id: "prospect", name: "Prospect", color: "orange" },
      ],
    },
    {
      id: "birthday",
      name: "Birthday",
      type: "DATE",
      description: "Date of birth",
      required: false,
      isVisible: true,
      order: 6,
    },
    {
      id: "favoriteColor",
      name: "Favorite Color",
      type: "SELECT",
      description: "Favorite color",
      required: false,
      isVisible: true,
      order: 7,
      selectOptions: [
        { id: "Red", name: "Red", color: "red" },
        { id: "Blue", name: "Blue", color: "blue" },
        { id: "Green", name: "Green", color: "green" },
        { id: "Yellow", name: "Yellow", color: "yellow" },
        { id: "Purple", name: "Purple", color: "purple" },
      ],
    },
  ];

  // Demo views for testing
  const demoViews = [
    {
      id: "view-all",
      name: "All People",
      type: "TABLE",
      description: "Complete list of all contacts",
      isDefault: true,
      filters: [],
      sorts: [{ propertyId: "lastName", direction: "asc" }],
      visibleProperties: [
        "firstName",
        "lastName",
        "email",
        "company",
        "status",
        "phone",
      ],
      config: {
        rowHeight: "medium",
        pageSize: 20,
        showFilters: true,
        showSearch: true,
        showToolbar: true,
      },
    },
    {
      id: "view-customers",
      name: "Customers",
      type: "TABLE",
      description: "Current customers",
      isDefault: false,
      filters: [
        { propertyId: "status", operator: "equals", value: "customer" },
      ],
      sorts: [{ propertyId: "company", direction: "asc" }],
      visibleProperties: ["firstName", "lastName", "email", "company", "phone"],
      config: {
        rowHeight: "medium",
        pageSize: 20,
        showFilters: true,
        showSearch: true,
        showToolbar: true,
      },
    },
    {
      id: "view-leads",
      name: "Leads",
      type: "TABLE",
      description: "Potential leads to follow up with",
      isDefault: false,
      filters: [{ propertyId: "status", operator: "equals", value: "lead" }],
      sorts: [{ propertyId: "nextContactDate", direction: "asc" }],
      visibleProperties: [
        "firstName",
        "lastName",
        "email",
        "company",
        "nextContactDate",
        "phone",
      ],
      config: {
        rowHeight: "medium",
        pageSize: 20,
        showFilters: true,
        showSearch: true,
        showToolbar: true,
      },
    },
  ];

  const peopleDatabase = {
    id: databaseId,
    name: databaseMetadata?.displayNamePlural || "People",
    icon: databaseMetadata?.icon || "👥",
    description:
      databaseMetadata?.description || "Manage your contacts and relationships",
    properties: apiProperties.length > 0 ? apiProperties : demoProperties,
    views:
      Array.isArray(apiViews) && apiViews.length > 0 ? apiViews : demoViews,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    frozen: false,
    ownerId: currentUserId,
    isPublic: false,
    permissions: [],
    config: {
      moduleType: databaseMetadata?.entityKey || "people",
    },
  };

  if (peopleLoading || viewsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <EnhancedHeader />

      <Main className="space-y-8">
        {/* People Document View */}
        <DocumentView
          moduleType="people"
        />
      </Main>
    </>
  );
}
