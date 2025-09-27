import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ExternalLink } from "lucide-react";
import type {
  CalendarProvider,
  ConnectCalendarRequest,
} from "@/modules/calendar/types/calendar.types.ts";

const connectCalendarSchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  accountEmail: z.string().email("Valid email required"),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  syncSettings: z
    .object({
      importEvents: z.boolean().default(true),
      exportEvents: z.boolean().default(false),
      bidirectionalSync: z.boolean().default(false),
      syncPastDays: z.number().min(0).max(365).default(30),
      syncFutureDays: z.number().min(1).max(1095).default(365),
      conflictResolution: z
        .enum(["local", "remote", "manual"])
        .default("remote"),
    })
    .optional(),
});

type ConnectCalendarFormData = z.infer<typeof connectCalendarSchema>;

interface ConnectCalendarFormProps {
  providers: CalendarProvider[];
  onSubmit: (data: ConnectCalendarRequest) => void;
  onCancel: () => void;
}

export function ConnectCalendarForm({
  providers,
  onSubmit,
  onCancel,
}: ConnectCalendarFormProps) {
  const [selectedProvider, setSelectedProvider] =
    useState<CalendarProvider | null>(null);

  const form = useForm<ConnectCalendarFormData>({
    resolver: zodResolver(connectCalendarSchema),
    defaultValues: {
      provider: "",
      accountEmail: "",
      accessToken: "",
      refreshToken: "",
      syncSettings: {
        importEvents: true,
        exportEvents: false,
        bidirectionalSync: false,
        syncPastDays: 30,
        syncFutureDays: 365,
        conflictResolution: "remote",
      },
    },
  });

  const watchedProvider = form.watch("provider");

  React.useEffect(() => {
    const provider = providers.find((p) => p.id === watchedProvider);
    setSelectedProvider(provider || null);
  }, [watchedProvider, providers]);

  const handleSubmit = (data: ConnectCalendarFormData) => {
    onSubmit(data as ConnectCalendarRequest);
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
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

  const requiresAuth = (provider: CalendarProvider) => {
    return provider.authType !== "none";
  };

  const getAuthInstructions = (provider: CalendarProvider) => {
    switch (provider.authType) {
      case "oauth2":
        return `You will be redirected to ${provider.name} to authorize access to your calendar.`;
      case "basic":
        return "You will need to provide your username and password for this calendar service.";
      case "caldav":
        return "You will need to provide your CalDAV server URL and credentials.";
      case "none":
        return "No authentication required. Just provide the calendar URL.";
      default:
        return provider.setupInstructions;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Provider Selection */}
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calendar Provider</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a calendar provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getProviderIcon(provider.id)}
                        </span>
                        <span>{provider.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Provider Info */}
        {selectedProvider && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">
                  {getProviderIcon(selectedProvider.id)}
                </span>
                {selectedProvider.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {selectedProvider.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {selectedProvider.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {getAuthInstructions(selectedProvider)}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Account Email */}
        <FormField
          control={form.control}
          name="accountEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The email address associated with your calendar account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* OAuth Token Fields (for manual token entry) */}
        {selectedProvider && requiresAuth(selectedProvider) && (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                If you already have access tokens, you can enter them below.
                Otherwise, leave these fields empty and the system will guide
                you through OAuth.
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="accessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Token (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your access token"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="refreshToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refresh Token (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your refresh token"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Sync Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sync Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="syncSettings.importEvents"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Import Events</FormLabel>
                    <FormDescription>
                      Import events from this calendar into your system.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="syncSettings.exportEvents"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Export Events</FormLabel>
                    <FormDescription>
                      Export events from your system to this calendar.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="syncSettings.bidirectionalSync"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bidirectional Sync</FormLabel>
                    <FormDescription>
                      Sync changes in both directions automatically.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="syncSettings.syncPastDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sync Past Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="365"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      How many days back to sync events.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="syncSettings.syncFutureDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sync Future Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="1095"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 365)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      How many days ahead to sync events.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="syncSettings.conflictResolution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conflict Resolution</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="remote">
                        Prefer Remote (External Calendar)
                      </SelectItem>
                      <SelectItem value="local">
                        Prefer Local (This System)
                      </SelectItem>
                      <SelectItem value="manual">Manual Resolution</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How to handle conflicting events during sync.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Connect Calendar</Button>
        </div>
      </form>
    </Form>
  );
}
