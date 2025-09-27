import React, {useState} from "react";
import {Main} from "@/layout/main";
import {EnhancedHeader} from "@/components/enhanced-header";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Search, Shield, UserPlus, Users} from "lucide-react";
import {UserTable} from "@/modules/users/components/user-table";
import {
  useAdminUsers,
  useAdminUserStats,
  useDeleteUser,
  useToggleUserStatus,
  useUpdateUserRole,
} from "../services/admin-queries";
import {useAuth} from "@/modules/auth/hooks/useAuth";
import {EUserRole} from "@/modules/users/types/users.types";

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    role: EUserRole.ALL as EUserRole,
    isActive: undefined as boolean | undefined,
    search: undefined as string | undefined,
  });

  const { data: usersData, isLoading } = useAdminUsers(queryParams);
  const { data: userStats } = useAdminUserStats();
  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();
  const updateRoleMutation = useUpdateUserRole();

  const handleSearch = (search: string) => {
    setQueryParams((prev) => ({
      ...prev,
      search: search || undefined,
      page: 1,
    }));
  };

  const handleRoleFilter = (role: EUserRole) => {
    setQueryParams((prev) => ({
      ...prev,
      role: role === EUserRole.ALL ? EUserRole.ALL : role,
      page: 1,
    }));
  };

  const handleStatusFilter = (status: string) => {
    setQueryParams((prev) => ({
      ...prev,
      isActive: status === "all" ? undefined : status === "active",
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleEditUser = () => {
    // TODO: Open edit user modal
  };

  const handleDeleteUser = (userId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleToggleStatus = (userId: string) => {
    toggleStatusMutation.mutate(userId);
  };

  const handleUpdateRole = (userId: string, role: EUserRole) => {
    updateRoleMutation.mutate({ userId: userId,  role });
  };

  const stats = userStats
    ? {
        total: userStats.total,
        active: userStats.active,
        admins: userStats.admins,
        moderators: userStats.moderators,
        users: userStats.users,
      }
    : null;

  return (
    <>
      <EnhancedHeader
        contextActions={
          <Button size="sm" className="h-8 gap-2">
            <UserPlus className="h-4 w-4" />
            Invite User
          </Button>
        }
      />

      <Main className="space-y-8">
        {/* Page Description */}
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Manage users, roles, and permissions across the system
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Administrators
                </CardTitle>
                <Badge variant="destructive">{stats.admins}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.admins}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Moderators
                </CardTitle>
                <Badge variant="secondary">{stats.moderators}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.moderators}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Regular Users
                </CardTitle>
                <Badge variant="outline">{stats.users}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              User Filters
            </CardTitle>
            <CardDescription>
              Filter and search users by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email..."
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
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
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
            <CardTitle>User Accounts</CardTitle>
            <CardDescription>
              {usersData
                ? `Showing ${usersData.data?.length} of ${usersData?.meta?.total} users`
                : "Loading user data..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable
              users={usersData?.data || []}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onToggleStatus={handleToggleStatus}
              onUpdateRole={handleUpdateRole}
              currentUserId={currentUser?.id}
              isLoading={isLoading}
            />

            {/* Pagination */}
            {usersData &&
              usersData?.meta &&
              usersData?.meta.totalPages > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Page {usersData?.meta.page} of{" "}
                    {usersData?.meta?.totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(queryParams.page - 1)}
                      disabled={!usersData?.meta?.hasPrev}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(queryParams.page + 1)}
                      disabled={!usersData?.meta?.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </Main>
    </>
  );
};

export default AdminUsersPage;
