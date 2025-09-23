import React, { useState } from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FolderOpen } from "lucide-react";

const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name too long"),
  description: z.string().max(200, "Description too long").optional(),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
});

type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const predefinedColors = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16", // Lime
];

const predefinedIcons = [
  "📁",
  "📂",
  "🏷️",
  "📋",
  "📝",
  "📊",
  "📈",
  "📉",
  "💼",
  "🏠",
  "📚",
  "🎯",
  "⚡",
  "🔥",
  "⭐",
  "🎨",
];

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      color: predefinedColors[0],
      icon: predefinedIcons[0],
    },
  });

  const onSubmit = async (data: CreateCategoryFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual category creation API call
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Category "${data.name}" created successfully!`);

      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Failed to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Create New Category
          </DialogTitle>
          <DialogDescription>
            Create a new category to organize your databases. Categories help
            you group related databases together.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Work, Personal, Projects"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a descriptive name for your category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this category is for..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide additional context about this category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            field.value === color
                              ? "border-gray-900 scale-110"
                              : "border-gray-300 hover:scale-105"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => field.onChange(color)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Choose a color to visually identify this category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-8 gap-2">
                      {predefinedIcons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all text-lg ${
                            field.value === icon
                              ? "border-gray-900 bg-gray-100 scale-110"
                              : "border-gray-300 hover:scale-105 hover:bg-gray-50"
                          }`}
                          onClick={() => field.onChange(icon)}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Choose an icon to represent this category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{form.watch("icon")}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {form.watch("name") || "Category Name"}
                    </h4>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: form.watch("color") + "20",
                        color: form.watch("color"),
                      }}
                    >
                      Preview
                    </Badge>
                  </div>
                  {form.watch("description") && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {form.watch("description")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
