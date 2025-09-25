import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  RefreshCw,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  WifiOff,
} from "lucide-react";
import {
  useCalendarConnections,
  useCalendarProviders,
  useConnectCalendar,
  useDisconnectCalendar,
  useSyncCalendarConnection,
  useTestCalendarConnection,
  useResetCalendarConnectionErrors,
  useUpdateCalendarConnection,
} from "../services/calendar-queries";
import type { CalendarConnection, CalendarProvider } from "@/types/calendar";
import { toast } from "sonner";
import { ConnectCalendarForm } from "./connect-calendar-form";

export function CalendarConnections() {
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<CalendarProvider | null>(null);

  const { data: connections = [], isLoading: connectionsLoading } =
    useCalendarConnections();
  const { data: providers = [] } = useCalendarProviders();

  const connectMutation = useConnectCalendar();
  const disconnectMutation = useDisconnectCalendar();
  const syncMutation = useSyncCalendarConnection();
  const testMutation = useTestCalendarConnection();
  const resetErrorsMutation = useResetCalendarConnectionErrors();
  const updateMutation = useUpdateCalendarConnection();

  const handleConnect = async (data: any) => {
    try {
      await connectMutation.mutateAsync(data);
      setShowConnectDialog(false);
      setSelectedProvider(null);
      toast.success("Calendar connected successfully");
    } catch (error) {
      toast.error("Failed to connect calendar");
    }
  };

  const handleDisconnect = async (connection: CalendarConnection) => {
    try {
      await disconnectMutation.mutateAsync(connection.id);
      toast.success("Calendar disconnected successfully");
    } catch (error) {
      toast.error("Failed to disconnect calendar");
    }
  };

  const handleSync = async (connection: CalendarConnection) => {
    try {
      await syncMutation.mutateAsync(connection.id);
      toast.success("Calendar sync initiated");
    } catch (error) {
      toast.error("Failed to sync calendar");
    }
  };

  const handleTest = async (connection: CalendarConnection) => {
    try {
      const result = await testMutation.mutateAsync(connection.id);
      if (result.status === "connected") {
        toast.success(
          `Connection test successful - ${result.calendarsFound} calendars found`
        );
      } else {
        toast.error(`Connection test failed: ${result.error}`);
      }
    } catch (error) {
      toast.error("Connection test failed");
    }
  };

  const handleResetErrors = async (connection: CalendarConnection) => {
    try {
      await resetErrorsMutation.mutateAsync(connection.id);
      toast.success("Connection errors reset");
    } catch (error) {
      toast.error("Failed to reset errors");
    }
  };

  const getStatusIcon = (connection: CalendarConnection) => {
    if (!connection.isActive)
      return <WifiOff className="h-4 w-4 text-muted-foreground" />;
    if (connection.errorCount > 5)
      return <XCircle className="h-4 w-4 text-destructive" />;
    if (connection.errorCount > 0)
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    if (!connection.syncEnabled)
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = (connection: CalendarConnection) => {
    if (!connection.isActive) return "Inactive";
    if (connection.errorCount > 5) return "Error";
    if (connection.errorCount > 0) return "Warning";
    if (!connection.syncEnabled) return "Disabled";
    return "Active";
  };

  const getProviderInfo = (provider: string) => {
    const providerData = providers.find((p) => p.id === provider);
    return {
      name: providerData?.name || provider,
      icon: getProviderIcon(provider),
    };
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return "🇬";
      case "outlook":
        return "📧";
      case "apple":
        return "🍎";
      case "caldav":
        return "📅";
      case "ical":
        return "📄";
      default:
        return "📅";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              External Calendar Connections
            </CardTitle>
            <Dialog
              open={showConnectDialog}
              onOpenChange={setShowConnectDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Calendar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Connect External Calendar</DialogTitle>
                </DialogHeader>
                <ConnectCalendarForm
                  providers={providers}
                  onSubmit={handleConnect}
                  onCancel={() => setShowConnectDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {connectionsLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : connections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ExternalLink className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm mb-4">No external calendars connected</p>
              <p className="text-xs text-muted-foreground mb-4">
                Connect your Google, Outlook, or other calendar services to sync
                events automatically.
              </p>
              <Button onClick={() => setShowConnectDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Connect Your First Calendar
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {connections.map((connection) => {
                const providerInfo = getProviderInfo(connection.provider);
                return (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{providerInfo.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {connection.accountEmail}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {providerInfo.name}
                          </Badge>
                          <Badge
                            variant={
                              connection.isActive &&
                              connection.syncEnabled &&
                              connection.errorCount === 0
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {getStatusIcon(connection)}
                            <span className="ml-1">
                              {getStatusText(connection)}
                            </span>
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {connection.accountName &&
                            `${connection.accountName} • `}
                          Last sync:{" "}
                          {connection.lastSyncAt
                            ? new Date(connection.lastSyncAt).toLocaleString()
                            : "Never"}
                          {connection.errorCount > 0 && (
                            <span className="text-destructive ml-2">
                              ({connection.errorCount} errors)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTest(connection)}
                        disabled={testMutation.isPending}
                      >
                        Test
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(connection)}
                        disabled={syncMutation.isPending}
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${
                            syncMutation.isPending ? "animate-spin" : ""
                          }`}
                        />
                      </Button>

                      {connection.errorCount > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResetErrors(connection)}
                          disabled={resetErrorsMutation.isPending}
                        >
                          Reset
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Disconnect Calendar
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to disconnect{" "}
                              {connection.accountEmail}? This will stop syncing
                              events from this calendar and may delete
                              associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDisconnect(connection)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Disconnect
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Providers */}
      {providers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setSelectedProvider(provider);
                    setShowConnectDialog(true);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getProviderIcon(provider.id)}
                    </div>
                    <div>
                      <h3 className="font-medium">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {provider.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {provider.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
