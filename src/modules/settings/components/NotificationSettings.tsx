import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Mail,
  MessageSquare,
  Users,
  Database,
  Calendar,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { settingsApi } from "../services/settingsApi";

export const NotificationSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [workspaceInvites, setWorkspaceInvites] = useState(true);
  const [databaseShares, setDatabaseShares] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [notificationFrequency, setNotificationFrequency] =
    useState("immediate");
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsApi.getNotifications();
        setEmailNotifications(settings.emailNotifications);
        setPushNotifications(settings.pushNotifications);
        setWorkspaceInvites(settings.workspaceInvites);
        setDatabaseShares(settings.databaseShares);
        setMentions(settings.mentions);
        setWeeklyDigest(settings.weeklyDigest);
        setNotificationFrequency(settings.notificationFrequency);
      } catch (error) {
        console.error("Failed to load notification settings:", error);
        toast.error("Failed to load notification settings");
      }
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await settingsApi.updateNotifications({
        emailNotifications,
        pushNotifications,
        workspaceInvites,
        databaseShares,
        mentions,
        weeklyDigest,
        notificationFrequency,
      });
      toast.success("Notification settings saved");
    } catch (error) {
      console.error("Failed to save notification settings:", error);
      toast.error("Failed to save notification settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            General
          </CardTitle>
          <CardDescription>
            Control how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Email Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-3 w-3" />
                Push Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive browser push notifications
              </p>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Frequency</Label>
            <Select
              value={notificationFrequency}
              onValueChange={setNotificationFrequency}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Activity
          </CardTitle>
          <CardDescription>
            Get notified about workspace activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Workspace Invites</Label>
              <p className="text-xs text-muted-foreground">
                When invited to workspaces
              </p>
            </div>
            <Switch
              checked={workspaceInvites}
              onCheckedChange={setWorkspaceInvites}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Database className="h-3 w-3" />
                Database Shares
              </Label>
              <p className="text-xs text-muted-foreground">
                When databases are shared
              </p>
            </div>
            <Switch
              checked={databaseShares}
              onCheckedChange={setDatabaseShares}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Comments & Mentions</Label>
              <p className="text-xs text-muted-foreground">
                When mentioned or commented on
              </p>
            </div>
            <Switch checked={mentions} onCheckedChange={setMentions} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Weekly Digest
              </Label>
              <p className="text-xs text-muted-foreground">
                Weekly activity summary
              </p>
            </div>
            <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center sm:justify-end pt-2">
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Notification Settings"
          )}
        </Button>
      </div>
    </div>
  );
};
