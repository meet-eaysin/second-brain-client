import React, { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  User,
  Target,
  RotateCcw,
  Folder,
  DollarSign,
  Settings,
  Users,
  CheckCircle,
  UserCheck,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "../services/notificationsQueries";
import type { NotificationQueryParams } from "@/types/notifications.types";

export const NotificationsPanel: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterRead, setFilterRead] = useState<string>("all");

  const queryParams: NotificationQueryParams = {
    type: filterType && filterType !== "all" ? filterType : undefined,
    isRead:
      filterRead === "read"
        ? true
        : filterRead === "unread"
        ? false
        : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 50,
  };

  const {
    data: notificationsResponse,
    isLoading,
    error,
  } = useGetNotifications(queryParams);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsReadMutation.mutateAsync(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      await deleteNotificationMutation.mutateAsync(notificationId);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_due":
      case "task_overdue":
        return <Calendar className="h-4 w-4" />;
      case "task_assigned":
        return <UserCheck className="h-4 w-4" />;
      case "task_completed":
        return <CheckCircle className="h-4 w-4" />;
      case "mention":
        return <User className="h-4 w-4" />;
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "goal_deadline":
        return <Target className="h-4 w-4" />;
      case "habit_reminder":
        return <RotateCcw className="h-4 w-4" />;
      case "project_update":
        return <Folder className="h-4 w-4" />;
      case "finance_budget":
        return <DollarSign className="h-4 w-4" />;
      case "system_update":
        return <Settings className="h-4 w-4" />;
      case "collaboration":
        return <Users className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "task_due":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "task_overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "task_assigned":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "task_completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "mention":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "comment":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      case "goal_deadline":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case "habit_reminder":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case "project_update":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200";
      case "finance_budget":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "system_update":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "collaboration":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityBadge = (priority: ENotificationPriority) => {
    switch (priority) {
      case ENotificationPriority.URGENT:
        return (
          <Badge variant="destructive" className="text-xs">
            Urgent
          </Badge>
        );
      case ENotificationPriority.HIGH:
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-red-100 text-red-800"
          >
            High
          </Badge>
        );
      case ENotificationPriority.MEDIUM:
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-yellow-100 text-yellow-800"
          >
            Medium
          </Badge>
        );
      case ENotificationPriority.LOW:
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Failed to load notifications. Please try again.
      </div>
    );
  }

  const notifications = notificationsResponse?.notifications || [];
  const unreadCount = notificationsResponse?.unreadCount || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filterRead} onValueChange={setFilterRead}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Notifications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
            <SelectItem value="read">Read Only</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="task_due">Task Due</SelectItem>
            <SelectItem value="task_overdue">Task Overdue</SelectItem>
            <SelectItem value="task_assigned">Task Assigned</SelectItem>
            <SelectItem value="task_completed">Task Completed</SelectItem>
            <SelectItem value="mention">Mentions</SelectItem>
            <SelectItem value="comment">Comments</SelectItem>
            <SelectItem value="goal_deadline">Goal Deadlines</SelectItem>
            <SelectItem value="habit_reminder">Habit Reminders</SelectItem>
            <SelectItem value="project_update">Project Updates</SelectItem>
            <SelectItem value="finance_budget">Finance Budget</SelectItem>
            <SelectItem value="system_update">System Updates</SelectItem>
            <SelectItem value="collaboration">Collaboration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <ScrollArea className="h-[600px]">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.isRead
                    ? "border-l-4 border-l-primary bg-primary/5"
                    : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between space-x-3">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="text-2xl mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-sm">
                            {notification.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getNotificationTypeColor(
                              notification.type
                            )}`}
                          >
                            {notification.type.replace("_", " ")}
                          </Badge>
                          {getPriorityBadge(notification.priority)}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {notification.timeAgo}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={markAsReadMutation.isPending}
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        disabled={deleteNotificationMutation.isPending}
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : null}

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No notifications</h3>
          <p className="text-muted-foreground">
            {(filterRead && filterRead !== "all") ||
            (filterType && filterType !== "all")
              ? "No notifications match your current filters."
              : "You're all caught up! No new notifications."}
          </p>
        </div>
      )}
    </div>
  );
};
