import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Users,
  Database,
  Settings,
  Building2,
  Globe,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useCreateWorkspace,
  useSwitchWorkspace,
} from "@/modules/workspaces/services/workspace-queries";
import { useAuthStore } from "@/modules/auth/store/auth-store.ts";
import {
  type CreateWorkspaceRequest,
  EWorkspaceType,
  type Workspace,
} from "@/modules/workspaces/types/workspaces.types.ts";

const workspaceSetupSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  type: z.enum(["personal", "team", "organization", "public"]),
  icon: z.string().optional(),
  isPublic: z.boolean(),
});

type WorkspaceSetupFormValues = z.infer<typeof workspaceSetupSchema>;

interface WorkspaceSetupWizardProps {
  open: boolean;
  onComplete: (workspace: Workspace) => void;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
}

const WORKSPACE_ICONS = [
  "🏢",
  "🚀",
  "💼",
  "🎯",
  "⚡",
  "🌟",
  "🔥",
  "💡",
  "🎨",
  "📊",
  "🛠️",
  "🎪",
];
const WORKSPACE_TYPES = [
  {
    value: "personal",
    label: "Personal",
    description: "For individual use and personal projects",
    icon: User,
    color: "text-blue-500",
  },
  {
    value: "team",
    label: "Team",
    description: "Collaborate with a small team",
    icon: Users,
    color: "text-green-500",
  },
  {
    value: "organization",
    label: "Organization",
    description: "For larger organizations and enterprises",
    icon: Building2,
    color: "text-purple-500",
  },
  {
    value: "public",
    label: "Public",
    description: "Open workspace for community contributions",
    icon: Globe,
    color: "text-orange-500",
  },
] as const;

const SETUP_STEPS = [
  {
    id: "welcome",
    title: "Welcome to Second Brain",
    description: "Let's set up your first workspace to get started",
    icon: Sparkles,
  },
  {
    id: "workspace",
    title: "Create Your Workspace",
    description: "Give your workspace a name and customize it",
    icon: Settings,
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "Your workspace is ready. Start building your second brain",
    icon: Check,
  },
];

export const WorkspaceSetupWizard: React.FC<WorkspaceSetupWizardProps> = ({
  open,
  onComplete,
  size = "xl",
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuthStore();
  const createWorkspaceMutation = useCreateWorkspace();
  const switchWorkspaceMutation = useSwitchWorkspace();

  const form = useForm<WorkspaceSetupFormValues>({
    resolver: zodResolver(workspaceSetupSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "personal",
      icon: WORKSPACE_ICONS[0],
      isPublic: false,
    },
  });

  const handleNext = () => {
    if (currentStep < SETUP_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: WorkspaceSetupFormValues) => {
    const workspaceData: CreateWorkspaceRequest = {
      name: data.name,
      description: data.description || undefined,
      type: data.type as EWorkspaceType,
      icon: data.icon ? { type: "emoji", value: data.icon } : undefined,
      isPublic: data.isPublic,
    };

    const workspace = await createWorkspaceMutation.mutateAsync(workspaceData);
    await switchWorkspaceMutation.mutateAsync({
      workspaceId: workspace?._id,
    });

    onComplete(workspace);
  };
  const handleSkip = async () => {
    const defaultName = user
      ? `${user.firstName || user.name || "User"}'s Workspace`
      : "My Workspace";
    const defaultData: CreateWorkspaceRequest = {
      name: defaultName,
      description: "",
      type: EWorkspaceType.PERSONAL,
      icon: { type: "emoji", value: WORKSPACE_ICONS[0] },
      isPublic: false,
    };

    const workspace = await createWorkspaceMutation.mutateAsync(defaultData);
    await switchWorkspaceMutation.mutateAsync({
      workspaceId: workspace?._id,
    });

    onComplete(workspace);
  };
  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="space-y-3">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">
            Welcome to Second Brain
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Your intelligent knowledge management system. Let's create your
            first workspace.
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <h3 className="text-base font-semibold">What you can do</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-muted/50">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-xs">Organize Data</h4>
              <p className="text-xs text-muted-foreground text-center">
                Create structured databases
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-muted/50">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-xs">Collaborate</h4>
              <p className="text-xs text-muted-foreground text-center">
                Work with team members
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-muted/50">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-xs">Customize</h4>
              <p className="text-xs text-muted-foreground text-center">
                Tailor to your workflow
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkspaceStep = () => (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold tracking-tight">
          Create Your Workspace
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Set up your workspace with a name, type, and customize its appearance
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="name" className="text-base font-medium">
            Workspace Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., My Personal Workspace"
            className="h-11"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Choose Workspace Type
            </Label>
            <p className="text-sm text-muted-foreground">
              Select the type of workspace that best fits your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WORKSPACE_TYPES.map((type) => {
              const IconComponent = type.icon;
              const isSelected = form.watch("type") === type.value;
              return (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? "ring-2 ring-primary border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => form.setValue("type", type.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? "bg-primary/10" : "bg-muted"
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 ${type.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{type.label}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="description" className="text-base font-medium">
            Description{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Briefly describe what this workspace is for..."
            rows={3}
            className="resize-none"
            {...form.register("description")}
          />
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-base font-medium">Choose an Icon</Label>
            <p className="text-sm text-muted-foreground">
              Pick an icon that represents your workspace
            </p>
          </div>
          <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
            {WORKSPACE_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                className={`aspect-square flex items-center justify-center text-xl rounded-md border transition-all hover:scale-110 ${
                  form.watch("icon") === icon
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => form.setValue("icon", icon)}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="space-y-3">
        <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">You're All Set!</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Your workspace has been created successfully. You can now start
            building your second brain.
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-full">
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent"></div>
            <span className="text-xs font-medium">
              Setting up your workspace...
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          This may take a few moments
        </p>
      </div>
    </div>
  );

  const currentStepData = SETUP_STEPS[currentStep];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        size={size}
        showCloseButton={false}
        className="max-h-[90vh] overflow-hidden"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <currentStepData.icon className="w-5 h-5" />
            <span>{currentStepData.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2">
            {SETUP_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="min-h-[280px] flex items-start justify-center">
            {currentStep === 0 && renderWelcomeStep()}
            {currentStep === 1 && renderWorkspaceStep()}
            {currentStep === 2 && renderCompleteStep()}
          </div>

          {/* Navigation */}
          {currentStep < SETUP_STEPS.length - 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex space-x-2">
                {currentStep === 0 && (
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip Setup
                  </Button>
                )}
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handlePrevious}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>
              <Button
                onClick={
                  currentStep === 1
                    ? form.handleSubmit(handleSubmit)
                    : handleNext
                }
                disabled={
                  currentStep === 1 && createWorkspaceMutation.isPending
                }
              >
                {currentStep === 1 ? (
                  createWorkspaceMutation.isPending ? (
                    "Creating..."
                  ) : (
                    "Create Workspace"
                  )
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
