import React from 'react';
import { DataTable } from '@/modules/database-view';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, ShieldCheck, User as UserIcon, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import type { User, UserRole } from '@/types/user.types';
import type { ColumnDef } from '@tanstack/react-table';

interface UserTableProps {
    users: User[];
    onEditUser?: (user: User) => void;
    onDeleteUser?: (userId: string) => void;
    onToggleStatus?: (userId: string) => void;
    onUpdateRole?: (userId: string, role: UserRole) => void;
    currentUserId?: string;
    isLoading?: boolean;
}

const getRoleIcon = (role: UserRole) => {
    switch (role) {
        case 'ADMIN':
            return <ShieldCheck className="h-4 w-4" />;
        case 'MODERATOR':
            return <Shield className="h-4 w-4" />;
        default:
            return <UserIcon className="h-4 w-4" />;
    }
};

const getRoleColor = (role: UserRole): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
        case 'ADMIN':
            return 'destructive';
        case 'MODERATOR':
            return 'secondary';
        default:
            return 'outline';
    }
};

const getProviderBadge = (provider: string) => {
    return (
        <Badge variant={provider === 'GOOGLE' ? 'default' : 'outline'}>
            {provider}
        </Badge>
    );
};

export const UserTable: React.FC<UserTableProps> = ({
    users,
    onEditUser,
    onDeleteUser,
    onToggleStatus,
    onUpdateRole,
    currentUserId,
    isLoading = false,
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getInitials = (firstName?: string, lastName?: string, username?: string) => {
        if (firstName && lastName) {
            return `${firstName[0]}${lastName[0]}`.toUpperCase();
        }
        if (username) {
            return username.slice(0, 2).toUpperCase();
        }
        return 'U';
    };

    const columns: ColumnDef<User>[] = [
        {
            id: 'user',
            header: 'User',
            accessorKey: 'email',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profilePicture} />
                            <AvatarFallback>
                                {getInitials(user.firstName, user.lastName, user.username)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">
                                {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.username}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {user.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            id: 'role',
            header: 'Role',
            accessorKey: 'role',
            cell: ({ row }) => {
                const role = row.original.role;
                return (
                    <Badge variant={getRoleColor(role)} className="gap-1">
                        {getRoleIcon(role)}
                        {role}
                    </Badge>
                );
            },
        },
        {
            id: 'provider',
            header: 'Provider',
            accessorKey: 'authProvider',
            cell: ({ row }) => getProviderBadge(row.original.authProvider),
        },
        {
            id: 'status',
            header: 'Status',
            accessorKey: 'isActive',
            cell: ({ row }) => (
                <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
                    {row.original.isActive ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            id: 'created',
            header: 'Created',
            accessorKey: 'createdAt',
            cell: ({ row }) => (
                <div className="text-sm">
                    {formatDate(row.original.createdAt)}
                </div>
            ),
        },
        {
            id: 'lastLogin',
            header: 'Last Login',
            accessorKey: 'lastLoginAt',
            cell: ({ row }) => (
                <div className="text-sm">
                    {row.original.lastLoginAt ? formatDate(row.original.lastLoginAt) : 'Never'}
                </div>
            ),
        },
    ];

    // Define custom actions
    const customActions = [
        {
            id: 'edit',
            label: 'Edit User',
            icon: Edit,
            onClick: (record: User) => {
                if (onEditUser) {
                    onEditUser(record);
                }
            },
            variant: 'ghost',
        },
        {
            id: 'toggle-status',
            label: 'Toggle Status',
            icon: UserCheck,
            onClick: (record: User) => {
                if (onToggleStatus) {
                    onToggleStatus(record.id);
                }
            },
            variant: 'ghost',
        },
        {
            id: 'make-user',
            label: 'Make User',
            icon: UserIcon,
            onClick: (record: User) => {
                if (onUpdateRole) {
                    onUpdateRole(record.id, 'USER');
                }
            },
            variant: 'ghost',
            isVisible: (record: User) => record.role !== 'USER',
        },
        {
            id: 'make-moderator',
            label: 'Make Moderator',
            icon: Shield,
            onClick: (record: User) => {
                if (onUpdateRole) {
                    onUpdateRole(record.id, 'MODERATOR');
                }
            },
            variant: 'ghost',
            isVisible: (record: User) => record.role !== 'MODERATOR',
        },
        {
            id: 'make-admin',
            label: 'Make Admin',
            icon: ShieldCheck,
            onClick: (record: User) => {
                if (onUpdateRole) {
                    onUpdateRole(record.id, 'ADMIN');
                }
            },
            variant: 'ghost',
            isVisible: (record: User) => record.role !== 'ADMIN',
        },
        {
            id: 'delete',
            label: 'Delete User',
            icon: Trash2,
            onClick: (record: User) => {
                if (onDeleteUser) {
                    onDeleteUser(record.id);
                }
            },
            variant: 'ghost',
            isDestructive: true,
            requiresConfirmation: true,
            confirmationMessage: 'Are you sure you want to delete this user? This action cannot be undone.',
            isVisible: (record: User) => record.id !== currentUserId,
        },
    ];

    // Define toolbar actions
    const toolbarActions = [
        {
            id: 'bulk-activate',
            label: 'Activate Selected',
            icon: UserCheck,
            onClick: (records: User[]) => {
                if (onToggleStatus) {
                    records.forEach((record: User) => {
                        if (!record.isActive) {
                            onToggleStatus(record.id);
                        }
                    });
                }
            },
            variant: 'outline',
            requiresSelection: true,
        },
        {
            id: 'bulk-deactivate',
            label: 'Deactivate Selected',
            icon: UserX,
            onClick: (records: User[]) => {
                if (onToggleStatus) {
                    records.forEach((record: User) => {
                        if (record.isActive) {
                            onToggleStatus(record.id);
                        }
                    });
                }
            },
            variant: 'outline',
            requiresSelection: true,
        },
        {
            id: 'bulk-delete',
            label: 'Delete Selected',
            icon: Trash2,
            onClick: (records: User[]) => {
                if (onDeleteUser) {
                    records.forEach((record: User) => {
                        if (record.id !== currentUserId) {
                            onDeleteUser(record.id);
                        }
                    });
                }
            },
            variant: 'outline',
            requiresSelection: true,
            isDestructive: true,
            requiresConfirmation: true,
            confirmationMessage: 'Are you sure you want to delete the selected users? This action cannot be undone.',
        },
    ];

    if (isLoading) {
        return (
            <DataTable
                data={[]}
                columns={columns}
            />
        );
    }

    return (
        <DataTable
            data={users}
            columns={columns}
        />
    );
};
