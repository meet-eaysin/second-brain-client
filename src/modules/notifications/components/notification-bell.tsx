import React, { useState } from "react";
import { Bell, Calendar, User, MessageSquare, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useGetUnreadNotificationCount,
  useGetRecentNotifications,
  useMarkNotificationAsRead,
} from "@/modules/notifications/services/notifications-queries";
import { type Notification } from "@/modules/notifications/types/notifications.types";

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { data: unreadCountData } = useGetUnreadNotificationCount();
  const { data: recentNotifications } = useGetRecentNotifications(10);
  const markAsReadMutation = useMarkNotificationAsRead();

  const unreadCount = unreadCountData?.data?.unreadCount || 0;
  const notifications = recentNotifications?.data?.notifications || [];

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification?.isRead) {
      await markAsReadMutation.mutateAsync(notification?.id);
    }
    // TODO: Navigate to relevant page based on notification type and entity
    setIsOpen(false);
  };

  const handleViewAll = () => {
    navigate("/app/notifications");
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.isRead
                      ? "bg-blue-50/50 dark:bg-blue-950/20"
                      : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-lg mt-0.5">
                      {notification.type === "task_due" ||
                      notification.type === "task_overdue" ? (
                        <Calendar className="h-4 w-4" />
                      ) : notification.type === "mention" ? (
                        <User className="h-4 w-4" />
                      ) : notification.type === "comment" ? (
                        <MessageSquare className="h-4 w-4" />
                      ) : notification.type === "task_completed" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timeAgo}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))}

              {notifications.length > 5 && (
                <div className="p-2 text-center">
                  <Button variant="ghost" size="sm" onClick={handleViewAll}>
                    View all notifications
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={handleViewAll}
              >
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
