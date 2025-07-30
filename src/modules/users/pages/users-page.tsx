import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Users, UserPlus, Filter } from 'lucide-react';
import { UserTable } from '../components/user-table';
import { useUsers, useUpdateUser, useDeleteUser, useToggleUserStatus, useUpdateUserRole } from '../services/userQueries';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import type { UserQueryParams, UserRole } from '@/types/user.types';

export const UsersPage: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [queryParams, setQueryParams] = useState<UserQueryParams>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const { data: usersData, isLoading } = useUsers(queryParams);
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();
    const toggleStatusMutation = useToggleUserStatus();
    const updateRoleMutation = useUpdateUserRole();

    const handleSearch = (search: string) => {
        setQueryParams(prev => ({
            ...prev,
            search: search || undefined,
            page: 1,
        }));
    };

    const handleRoleFilter = (role: string) => {
        setQueryParams(prev => ({
            ...prev,
            role: role === 'all' ? undefined : (role as UserRole),
            page: 1,
        }));
    };

    const handleStatusFilter = (status: string) => {
        setQueryParams(prev => ({
            ...prev,
            isActive: status === 'all' ? undefined : status === 'active',
            page: 1,
        }));
    };

    const handlePageChange = (page: number) => {
        setQueryParams(prev => ({ ...prev, page }));
    };

    const handleEditUser = (user: any) => {
        // TODO: Open edit user modal
        console.log('Edit user:', user);
    };

    const handleDeleteUser = (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteUserMutation.mutate(userId);
        }
    };

    const handleToggleStatus = (userId: string) => {
        toggleStatusMutation.mutate(userId);
    };

    const handleUpdateRole = (userId: string, role: UserRole) => {
        updateRoleMutation.mutate({ id: userId, data: { role } });
    };

    const stats = usersData ? {
        total: usersData.total,
        active: usersData.users.filter(u => u.isActive).length,
        admins: usersData.users.filter(u => u.role === 'ADMIN').length,
        moderators: usersData.users.filter(u => u.role === 'MODERATOR').length,
    } : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage users, roles, and permissions
                    </p>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite User
                </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <Badge variant="default">{stats.active}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                            <p className="text-xs text-muted-foreground">
                                {((stats.active / stats.total) * 100).toFixed(1)}% of total
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                            <Badge variant="destructive">{stats.admins}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.admins}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Moderators</CardTitle>
                            <Badge variant="secondary">{stats.moderators}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.moderators}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                    <CardDescription>Filter and search users</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-10"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <Select onValueChange={handleRoleFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="MODERATOR">Moderator</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                        {usersData ? `Showing ${usersData.users.length} of ${usersData.total} users` : 'Loading...'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserTable
                        users={usersData?.users || []}
                        onEditUser={handleEditUser}
                        onDeleteUser={handleDeleteUser}
                        onToggleStatus={handleToggleStatus}
                        onUpdateRole={handleUpdateRole}
                        currentUserId={currentUser?.id}
                        isLoading={isLoading}
                    />
                    
                    {/* Pagination */}
                    {usersData && usersData.totalPages > 1 && (
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="text-sm text-muted-foreground">
                                Page {usersData.currentPage} of {usersData.totalPages}
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(queryParams.page! - 1)}
                                    disabled={queryParams.page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(queryParams.page! + 1)}
                                    disabled={queryParams.page === usersData.totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
