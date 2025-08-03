import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Users, Plus, Search, Mail, Phone, Building,
    Calendar, MessageSquare, Star, Edit, Trash2,
    MapPin, Globe, Linkedin, Twitter, Clock,
    TrendingUp, UserPlus, Filter, Briefcase
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';
import { SecondBrainTable, createSecondBrainColumns } from '../../databases/components/second-brain-table';
import { getSecondBrainConfig } from '../../databases/utils/second-brain-configs';
import { toast } from 'sonner';

interface Person {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    company?: string;
    role?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    tags: string[];
    notes?: string;
    lastContact?: string;
    nextFollowUp?: string;
    relationship: 'client' | 'prospect' | 'partner' | 'colleague' | 'friend' | 'mentor' | 'other';
    priority: 'low' | 'medium' | 'high';
    status: 'active' | 'inactive' | 'archived';
    createdAt: string;
    updatedAt: string;
}

export function PeoplePage() {
    const [selectedView, setSelectedView] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [newPerson, setNewPerson] = useState<Partial<Person>>({
        relationship: 'colleague',
        priority: 'medium',
        status: 'active',
        tags: []
    });

    const queryClient = useQueryClient();

    const { data: peopleData, isLoading } = useQuery({
        queryKey: ['second-brain', 'people'],
        queryFn: secondBrainApi.people.getAll,
    });

    const createPersonMutation = useMutation({
        mutationFn: secondBrainApi.people.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'people'] });
            toast.success('Person added successfully');
            setIsCreateDialogOpen(false);
            setNewPerson({
                relationship: 'colleague',
                priority: 'medium',
                status: 'active',
                tags: []
            });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add person');
        },
    });

    const updatePersonMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Person> }) =>
            secondBrainApi.people.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'people'] });
            toast.success('Person updated successfully');
        },
    });

    const deletePersonMutation = useMutation({
        mutationFn: secondBrainApi.people.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'people'] });
            toast.success('Person deleted successfully');
        },
    });

    // Mock data for demonstration
    const mockPeople = [
        {
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1-555-0123',
            company: 'Tech Corp',
            role: 'Software Engineer',
            relationship: 'colleague',
            priority: 'high',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
            lastContact: '2024-01-10',
            nextFollowUp: '2024-02-10',
            tags: ['tech', 'frontend'],
            notes: 'Great developer, works on React projects',
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-10'
        },
        {
            _id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@design.com',
            phone: '+1-555-0456',
            company: 'Design Studio',
            role: 'UX Designer',
            relationship: 'client',
            priority: 'medium',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
            lastContact: '2024-01-08',
            nextFollowUp: '2024-02-08',
            tags: ['design', 'ux'],
            notes: 'Excellent designer, very detail-oriented',
            status: 'active',
            createdAt: '2024-01-02',
            updatedAt: '2024-01-08'
        },
        {
            _id: '3',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.j@startup.io',
            phone: '+1-555-0789',
            company: 'Startup Inc',
            role: 'Product Manager',
            relationship: 'friend',
            priority: 'high',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
            lastContact: '2024-01-12',
            nextFollowUp: '2024-02-12',
            tags: ['product', 'startup'],
            notes: 'Former colleague, now at a startup',
            status: 'active',
            createdAt: '2024-01-03',
            updatedAt: '2024-01-12'
        }
    ];

    const people = peopleData?.data?.people || mockPeople;

    const filteredPeople = people.filter((person: Person) => {
        const matchesSearch = searchQuery === '' || 
            `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            person.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            person.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesView = selectedView === 'all' || 
            (selectedView === 'clients' && person.relationship === 'client') ||
            (selectedView === 'prospects' && person.relationship === 'prospect') ||
            (selectedView === 'partners' && person.relationship === 'partner') ||
            (selectedView === 'high-priority' && person.priority === 'high') ||
            (selectedView === 'needs-follow-up' && person.nextFollowUp && new Date(person.nextFollowUp) <= new Date());

        return matchesSearch && matchesView;
    });

    // Transform people to database records format
    const peopleRecords = filteredPeople.map((person: Person) => ({
        id: person._id,
        properties: {
            name: `${person.firstName} ${person.lastName}`,
            firstName: person.firstName,
            lastName: person.lastName,
            email: person.email,
            phone: person.phone,
            company: person.company,
            relationship: person.relationship,
            priority: person.priority,
            avatar: person.avatar,
            lastContact: person.lastContact,
            nextFollowUp: person.nextFollowUp,
            tags: person.tags,
            notes: person.notes,
            status: person.status,
            createdAt: person.createdAt,
            updatedAt: person.updatedAt
        }
    }));

    // Get configuration and create columns
    const config = getSecondBrainConfig('people');
    const columns = createSecondBrainColumns('people', config.defaultProperties);

    // Handle custom actions
    const handleCustomAction = (actionId: string, record: any) => {
        switch (actionId) {
            case 'call':
                if (record.properties.phone) {
                    window.open(`tel:${record.properties.phone}`);
                }
                break;
            case 'email':
                if (record.properties.email) {
                    window.open(`mailto:${record.properties.email}`);
                }
                break;
            case 'schedule':
                // Handle scheduling
                console.log('Schedule meeting with:', record);
                break;
            case 'edit':
                // Handle edit action
                const person = people.find((p: Person) => p._id === record.id);
                if (person) {
                    setSelectedPerson(person);
                }
                break;
            case 'delete':
                deletePersonMutation.mutate(record.id);
                break;
        }
    };

    // Handle toolbar actions
    const handleToolbarAction = (actionId: string, records: any[]) => {
        switch (actionId) {
            case 'bulk-email':
                const emails = records
                    .map(r => r.properties.email)
                    .filter(Boolean)
                    .join(',');
                if (emails) {
                    window.open(`mailto:${emails}`);
                }
                break;
            case 'export-contacts':
                // Handle export
                console.log('Export contacts:', records);
                break;
            case 'bulk-delete':
                records.forEach(record => deletePersonMutation.mutate(record.id));
                break;
        }
    };

    const handleCreatePerson = () => {
        if (!newPerson.firstName || !newPerson.lastName) {
            toast.error('First name and last name are required');
            return;
        }
        createPersonMutation.mutate(newPerson);
    };

    const getRelationshipColor = (relationship: string) => {
        switch (relationship) {
            case 'client': return 'bg-green-500';
            case 'prospect': return 'bg-blue-500';
            case 'partner': return 'bg-purple-500';
            case 'colleague': return 'bg-orange-500';
            case 'friend': return 'bg-pink-500';
            case 'mentor': return 'bg-indigo-500';
            default: return 'bg-gray-500';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600';
            case 'medium': return 'text-yellow-600';
            case 'low': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const views = [
        { id: 'all', label: 'All People', count: people.length },
        { id: 'clients', label: 'Clients', count: people.filter((p: Person) => p.relationship === 'client').length },
        { id: 'prospects', label: 'Prospects', count: people.filter((p: Person) => p.relationship === 'prospect').length },
        { id: 'partners', label: 'Partners', count: people.filter((p: Person) => p.relationship === 'partner').length },
        { id: 'high-priority', label: 'High Priority', count: people.filter((p: Person) => p.priority === 'high').length },
        { id: 'needs-follow-up', label: 'Needs Follow-up', count: people.filter((p: Person) => p.nextFollowUp && new Date(p.nextFollowUp) <= new Date()).length }
    ];

    if (isLoading) {
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
                {/* Clean Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">People & CRM</h1>
                        <p className="text-muted-foreground">
                            Manage your professional and personal network
                        </p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Person
                            </Button>
                        </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Person</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name *</label>
                                <Input
                                    placeholder="John"
                                    value={newPerson.firstName || ''}
                                    onChange={(e) => setNewPerson(prev => ({ ...prev, firstName: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name *</label>
                                <Input
                                    placeholder="Doe"
                                    value={newPerson.lastName || ''}
                                    onChange={(e) => setNewPerson(prev => ({ ...prev, lastName: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={newPerson.email || ''}
                                    onChange={(e) => setNewPerson(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <Input
                                    placeholder="+1 (555) 123-4567"
                                    value={newPerson.phone || ''}
                                    onChange={(e) => setNewPerson(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company</label>
                                <Input
                                    placeholder="Acme Corp"
                                    value={newPerson.company || ''}
                                    onChange={(e) => setNewPerson(prev => ({ ...prev, company: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Input
                                    placeholder="CEO"
                                    value={newPerson.role || ''}
                                    onChange={(e) => setNewPerson(prev => ({ ...prev, role: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Relationship</label>
                                <Select 
                                    value={newPerson.relationship} 
                                    onValueChange={(value) => setNewPerson(prev => ({ ...prev, relationship: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="client">Client</SelectItem>
                                        <SelectItem value="prospect">Prospect</SelectItem>
                                        <SelectItem value="partner">Partner</SelectItem>
                                        <SelectItem value="colleague">Colleague</SelectItem>
                                        <SelectItem value="friend">Friend</SelectItem>
                                        <SelectItem value="mentor">Mentor</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Priority</label>
                                <Select 
                                    value={newPerson.priority} 
                                    onValueChange={(value) => setNewPerson(prev => ({ ...prev, priority: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-medium">Notes</label>
                                <Textarea
                                    placeholder="Additional notes about this person..."
                                    value={newPerson.notes || ''}
                                    onChange={(e) => setNewPerson(prev => ({ ...prev, notes: e.target.value }))}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleCreatePerson}
                                disabled={createPersonMutation.isPending}
                            >
                                {createPersonMutation.isPending ? 'Adding...' : 'Add Person'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Total People</p>
                                    <p className="text-2xl font-bold text-foreground">{people.length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Clients</p>
                                    <p className="text-2xl font-bold text-foreground">{people.filter((p: Person) => p.relationship === 'client').length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Briefcase className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                                    <p className="text-2xl font-bold text-foreground">{people.filter((p: Person) => p.priority === 'high').length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Star className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Recent Contacts</p>
                                    <p className="text-2xl font-bold text-foreground">{people.filter((p: Person) => {
                                        if (!p.lastContact) return false;
                                        const lastContact = new Date(p.lastContact);
                                        const weekAgo = new Date();
                                        weekAgo.setDate(weekAgo.getDate() - 7);
                                        return lastContact >= weekAgo;
                                    }).length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* People Table */}
                {peopleRecords.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No people found</h3>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                                {searchQuery ? 'No people match your search criteria.' : 'Start building your network by adding people.'}
                            </p>
                            <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="gap-2">
                                <UserPlus className="h-4 w-4" />
                                Add First Person
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <SecondBrainTable
                        type="people"
                        data={peopleRecords}
                        columns={columns}
                        properties={config.defaultProperties}
                        onCustomAction={handleCustomAction}
                        onToolbarAction={handleToolbarAction}
                        enableRowSelection={true}
                        enableBulkActions={true}
                    />
                )}
            </Main>
        </>
    );
}
