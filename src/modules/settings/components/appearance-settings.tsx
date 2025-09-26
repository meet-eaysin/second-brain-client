import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/theme-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Monitor, Moon, Sun, Palette, Eye, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { settingsApi } from "../services/settings-api.ts";

export const AppearanceSettings: React.FC = () => {
  const { appearance, setAppearance } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Settings are loaded by the theme context, just show loading state briefly
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const themeOptions = [
    {
      value: "light",
      label: "Light",
      description: "Clean and bright interface",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      description: "Easy on the eyes in low light",
      icon: Moon,
    },
    {
      value: "system",
      label: "System",
      description: "Follows your system preference",
      icon: Monitor,
    },
  ];

  const fontSizeOptions = [
    { value: "small", label: "Small", description: "14px base size" },
    { value: "medium", label: "Medium", description: "16px base size" },
    { value: "large", label: "Large", description: "18px base size" },
  ];

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);
      await settingsApi.updateAppearance(appearance);
      toast.success("Appearance preferences saved");
    } catch (error) {
      console.error("Failed to save appearance settings:", error);
      toast.error("Failed to save appearance settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    try {
      setIsSaving(true);
      await settingsApi.resetSettings("appearance");
      // Reset to defaults
      const defaultSettings = {
        theme: "system" as const,
        fontSize: "medium" as const,
        compactMode: false,
        animationsEnabled: true,
        highContrast: false,
      };
      setAppearance(defaultSettings);
      toast.success("Reset to default appearance settings");
    } catch (error) {
      console.error("Failed to reset appearance settings:", error);
      toast.error("Failed to reset appearance settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading appearance settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme
          </CardTitle>
          <CardDescription>Choose your preferred color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={appearance.theme}
            onValueChange={(value: string) =>
              setAppearance({ theme: value as "light" | "dark" | "system" })
            }
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.value} className="relative">
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={option.value}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="font-medium text-sm">{option.label}</span>
                    <span className="text-xs text-muted-foreground text-center leading-tight">
                      {option.description}
                    </span>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Display
          </CardTitle>
          <CardDescription>Customize your interface appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={appearance.fontSize}
            onValueChange={(value: string) =>
              setAppearance({ fontSize: value as "small" | "medium" | "large" })
            }
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {fontSizeOptions.map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value}
                  id={`font-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`font-${option.value}`}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                >
                  <span className="font-medium text-sm">{option.label}</span>
                  <span className="text-xs text-muted-foreground text-center leading-tight">
                    {option.description}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Interface Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Interface Options</CardTitle>
          <CardDescription>Customize interface behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-mode" className="text-sm font-medium">
                Compact Mode
              </Label>
              <p className="text-xs text-muted-foreground">
                Reduce spacing for denser layout
              </p>
            </div>
            <Switch
              id="compact-mode"
              checked={appearance.compactMode}
              onCheckedChange={(checked) =>
                setAppearance({ compactMode: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="animations"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Zap className="h-3 w-3" />
                Animations
              </Label>
              <p className="text-xs text-muted-foreground">
                Enable smooth transitions
              </p>
            </div>
            <Switch
              id="animations"
              checked={appearance.animationsEnabled}
              onCheckedChange={(checked) =>
                setAppearance({ animationsEnabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast" className="text-sm font-medium">
                High Contrast
              </Label>
              <p className="text-xs text-muted-foreground">
                Better accessibility
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={appearance.highContrast}
              onCheckedChange={(checked) =>
                setAppearance({ highContrast: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={handleSavePreferences}
          disabled={isSaving}
          className="flex-1 sm:flex-none"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleResetToDefaults}
          disabled={isSaving}
          className="flex-1 sm:flex-none"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};
