import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    TrendingUp, UserPlus, Filter
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';
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

    const people = peopleData?.data?.people || [];

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Users className="h-8 w-8" />
                        People & CRM
                    </h1>
                    <p className="text-muted-foreground">Manage your professional and personal network</p>
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

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search people..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </div>

            {/* View Tabs */}
            <Tabs value={selectedView} onValueChange={setSelectedView}>
                <TabsList className="grid w-full grid-cols-6">
                    {views.map((view) => (
                        <TabsTrigger key={view.id} value={view.id} className="text-xs">
                            {view.label} ({view.count})
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={selectedView} className="space-y-4">
                    {filteredPeople.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No people found</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    {searchQuery ? 'No people match your search criteria.' : 'Start building your network by adding people.'}
                                </p>
                                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Add First Person
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPeople.map((person: Person) => (
                                <Card key={person._id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${getRelationshipColor(person.relationship)} flex items-center justify-center text-white font-medium`}>
                                                    {person.firstName[0]}{person.lastName[0]}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        {person.firstName} {person.lastName}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {person.role} {person.company && `at ${person.company}`}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className={`h-4 w-4 ${person.priority === 'high' ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={getRelationshipColor(person.relationship) + ' text-white'}>
                                                {person.relationship}
                                            </Badge>
                                            <Badge variant="outline" className={getPriorityColor(person.priority)}>
                                                {person.priority} priority
                                            </Badge>
                                        </div>

                                        {person.email && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                {person.email}
                                            </div>
                                        )}

                                        {person.phone && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="h-3 w-3" />
                                                {person.phone}
                                            </div>
                                        )}

                                        {person.lastContact && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                Last contact: {new Date(person.lastContact).toLocaleDateString()}
                                            </div>
                                        )}

                                        {person.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {person.tags.slice(0, 3).map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {person.tags.length > 3 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{person.tags.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 pt-2">
                                            <Button size="sm" variant="outline" className="flex-1 gap-2">
                                                <MessageSquare className="h-3 w-3" />
                                                Contact
                                            </Button>
                                            <Button size="sm" variant="outline" className="flex-1 gap-2">
                                                <Calendar className="h-3 w-3" />
                                                Schedule
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
