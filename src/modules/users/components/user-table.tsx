import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Shield, ShieldCheck, User as UserIcon } from 'lucide-react';
import type { User, UserRole } from '@/types/user.types';

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

const getRoleColor = (role: UserRole) => {
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

    if (isLoading) {
        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                                        <div className="space-y-1">
                                            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>
                                <Badge variant={getRoleColor(user.role)} className="gap-1">
                                    {getRoleIcon(user.role)}
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>{getProviderBadge(user.authProvider)}</TableCell>
                            <TableCell>
                                <Badge variant={user.isActive ? 'default' : 'secondary'}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                                {formatDate(user.createdAt)}
                            </TableCell>
                            <TableCell className="text-sm">
                                {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => onEditUser?.(user)}>
                                            Edit User
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onToggleStatus?.(user.id)}>
                                            {user.isActive ? 'Deactivate' : 'Activate'}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onUpdateRole?.(user.id, 'USER')}
                                            disabled={user.role === 'USER'}
                                        >
                                            Make User
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onUpdateRole?.(user.id, 'MODERATOR')}
                                            disabled={user.role === 'MODERATOR'}
                                        >
                                            Make Moderator
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onUpdateRole?.(user.id, 'ADMIN')}
                                            disabled={user.role === 'ADMIN'}
                                        >
                                            Make Admin
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onDeleteUser?.(user.id)}
                                            disabled={user.id === currentUserId}
                                            className="text-destructive"
                                        >
                                            Delete User
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
