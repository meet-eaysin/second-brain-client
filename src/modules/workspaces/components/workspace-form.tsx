import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Settings } from "lucide-react";
import type {
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from "@/types/workspace.types";
import { EWorkspaceType } from "@/types/workspace.types";

const workspaceFormSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  type: z.enum([
    EWorkspaceType.PERSONAL,
    EWorkspaceType.TEAM,
    EWorkspaceType.ORGANIZATION,
    EWorkspaceType.PUBLIC,
  ]),
  icon: z.string().max(10, "Icon must be less than 10 characters").optional(),
  isPublic: z.boolean().optional(),
});

type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;

interface WorkspaceFormProps {
  workspace?: Workspace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: CreateWorkspaceRequest | UpdateWorkspaceRequest
  ) => Promise<void>;
  mode?: "create" | "edit";
  isLoading?: boolean;
}

const iconOptions = [
  "🏢",
  "🚀",
  "💼",
  "🎯",
  "⭐",
  "🔥",
  "💡",
  "🎨",
  "🔧",
  "⚡",
  "🌟",
  "🏆",
];

export function WorkspaceForm({
  workspace,
  open,
  onOpenChange,
  onSubmit,
  mode = "create",
  isLoading = false,
}: WorkspaceFormProps) {
  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: EWorkspaceType.PERSONAL,
      icon: "🏢",
      isPublic: false,
    },
  });

  // Initialize form with workspace data when editing
  useEffect(() => {
    if (open) {
      if (workspace && mode === "edit") {
        const formData = {
          name: workspace.name,
          description: workspace.description || "",
          type: workspace.type,
          icon: workspace.icon?.value || "🏢",
          isPublic: workspace.isPublic ?? false,
        };
        form.reset(formData);
      } else {
        const defaultData = {
          name: "",
          description: "",
          type: EWorkspaceType.PERSONAL,
          icon: "🏢",
          isPublic: false,
        };
        form.reset(defaultData);
      }
    }
  }, [workspace, mode, open, form]);

  const handleSubmit = async (data: WorkspaceFormValues) => {
    try {
      // Transform form data to match API request types
      const transformedData =
        mode === "create"
          ? {
              name: data.name,
              description: data.description,
              type: data.type,
              icon: data.icon
                ? { type: "emoji" as const, value: data.icon }
                : undefined,
              isPublic: data.isPublic,
            }
          : {
              name: data.name,
              description: data.description,
              icon: data.icon
                ? { type: "emoji" as const, value: data.icon }
                : undefined,
              isPublic: data.isPublic,
            };

      await onSubmit(transformedData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit workspace:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Workspace" : "Edit Workspace"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new workspace to organize your databases and collaborate with your team."
              : "Update workspace information and settings."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Basic Information */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter workspace name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your workspace..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Workspace Type Selection */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Type</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        {
                          value: EWorkspaceType.PERSONAL,
                          label: "Personal",
                          description: "For individual use",
                        },
                        {
                          value: EWorkspaceType.TEAM,
                          label: "Team",
                          description: "For small teams",
                        },
                        {
                          value: EWorkspaceType.ORGANIZATION,
                          label: "Organization",
                          description: "For large organizations",
                        },
                        {
                          value: EWorkspaceType.PUBLIC,
                          label: "Public",
                          description: "Open to everyone",
                        },
                      ].map((type) => (
                        <Button
                          key={type.value}
                          type="button"
                          variant={
                            field.value === type.value ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => field.onChange(type.value)}
                          className="flex flex-col items-center p-3 h-auto"
                        >
                          <span className="font-medium">{type.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {type.description}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon Selection */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 flex-wrap">
                      {iconOptions.map((icon) => (
                        <Button
                          key={icon}
                          type="button"
                          variant={field.value === icon ? "default" : "outline"}
                          size="sm"
                          onClick={() => field.onChange(icon)}
                          className="w-10 h-10 p-0"
                        >
                          {icon}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Settings */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-medium">Workspace Settings</h4>

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Public Workspace
                      </FormLabel>
                      <FormDescription>
                        Make this workspace visible to everyone
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Settings className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {mode === "create"
                      ? "Create Workspace"
                      : "Update Workspace"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
