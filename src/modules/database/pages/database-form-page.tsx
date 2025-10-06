import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabaseViewProvider } from "@/modules/database-view/context";
import { EDatabaseType } from "@/modules/database-view/types";
import { DatabaseForm } from "@/modules/database-view/components/dialog-forms/database-form";
import { useWorkspace } from "@/modules/workspaces/context";
import {
  useFeaturedTemplates,
  useOfficialTemplates,
  useApplyDatabaseTemplate,
} from "@/modules/templates";
import { toast } from "sonner";
import type { Template } from "@/modules/templates";

export function DatabaseFormPage() {
  const { action } = useParams<{ action: string }>();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [showTemplates, setShowTemplates] = useState(true);

  const { currentWorkspace } = useWorkspace();

  const { data: featuredTemplates } = useFeaturedTemplates();
  const { data: officialTemplates } = useOfficialTemplates();
  const applyTemplateMutation = useApplyDatabaseTemplate();

  const isCreateMode = action === "new";
  const isEditMode = action === "edit";

  if (!isCreateMode && !isEditMode) {
    return (
      <div className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid action</h1>
          <Button onClick={() => navigate("/app/databases")}>
            Back to Databases
          </Button>
        </div>
      </div>
    );
  }

  const handleApplyTemplate = async (template: Template) => {
    if (!currentWorkspace?._id) {
      toast.error(
        "Unable to create database from template. Please refresh the page and try again."
      );
      return;
    }

    try {
      await applyTemplateMutation.mutateAsync({
        templateId: template.id,
        data: {
          workspaceId: currentWorkspace._id,
          overrides: {
            name: `${template.name} (from template)`,
          },
        },
      });

      toast.success(
        `Database "${template.name}" has been created successfully from template.`
      );

      navigate("/app/databases");
    } catch (error: unknown) {
      console.error("Failed to create database from template:", error);

      // Show specific error message
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Failed to create database from template. Please try again.";

      toast.error(errorMessage);
    }
  };

  const handleCreateBlank = () => {
    setShowTemplates(false);
    setSelectedTemplate(null);
  };

  if (isCreateMode && showTemplates) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header with back button */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/app/databases")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Databases
            </Button>
          </div>
        </div>

        {/* Template Selection */}
        <div className="px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              Create New Database
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start with a template to get up and running quickly, or create a
              blank database to customize everything from scratch.
            </p>
          </div>

          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="featured">Featured Templates</TabsTrigger>
              <TabsTrigger value="official">Official Templates</TabsTrigger>
              <TabsTrigger value="blank">Blank Database</TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTemplates?.data?.map((template: Template) => (
                  <Card
                    key={template.id}
                    className="hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => handleApplyTemplate(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl">{template.icon || "📊"}</div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">
                            {template.rating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{template.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {template.usageCount} uses
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="official" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {officialTemplates?.data?.map((template: Template) => (
                  <Card
                    key={template.id}
                    className="hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => handleApplyTemplate(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl">{template.icon || "📊"}</div>
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{template.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Official
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="blank" className="space-y-6">
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Start from Scratch
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create a completely blank database and customize every aspect
                  including properties, views, and templates.
                </p>
                <Button onClick={handleCreateBlank} size="lg">
                  Create Blank Database
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isCreateMode && !selectedTemplate) {
                  setShowTemplates(true);
                } else {
                  navigate("/app/databases");
                }
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {isCreateMode && !selectedTemplate
                ? "Back to Templates"
                : "Back to Databases"}
            </Button>
            {selectedTemplate && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                From template: {selectedTemplate.name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Database Form */}
      <div className="px-4 py-8">
        <DatabaseViewProvider
          moduleType={EDatabaseType.CUSTOM}
          databaseId={undefined}
        >
          <DatabaseForm />
        </DatabaseViewProvider>
      </div>
    </div>
  );
}
