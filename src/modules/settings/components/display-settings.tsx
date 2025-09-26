import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Monitor, Layout, Grid, Maximize, Zap } from "lucide-react";
import { toast } from "sonner";

export const DisplaySettings: React.FC = () => {
  const [layoutDensity, setLayoutDensity] = useState("comfortable");
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [contentWidth, setContentWidth] = useState("full");
  const [showGridLines, setShowGridLines] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [autoHideSidebar, setAutoHideSidebar] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const layoutDensityOptions = [
    {
      value: "compact",
      label: "Compact",
      description: "Minimal spacing, more content visible",
    },
    {
      value: "comfortable",
      label: "Comfortable",
      description: "Balanced spacing for optimal readability",
    },
    {
      value: "spacious",
      label: "Spacious",
      description: "Extra spacing for a relaxed layout",
    },
  ];

  const contentWidthOptions = [
    { value: "narrow", label: "Narrow", description: "Max 800px width" },
    { value: "medium", label: "Medium", description: "Max 1200px width" },
    { value: "wide", label: "Wide", description: "Max 1600px width" },
    {
      value: "full",
      label: "Full Width",
      description: "Use full screen width",
    },
  ];

  const handleSaveSettings = () => {
    const settings = {
      layoutDensity,
      sidebarWidth,
      contentWidth,
      showGridLines,
      enableAnimations,
      autoHideSidebar,
      fullscreenMode,
      zoomLevel,
    };

    localStorage.setItem("display-settings", JSON.stringify(settings));
    toast.success("Display settings saved");
  };

  const handleResetSettings = () => {
    setLayoutDensity("comfortable");
    setSidebarWidth(280);
    setContentWidth("full");
    setShowGridLines(false);
    setEnableAnimations(true);
    setAutoHideSidebar(false);
    setFullscreenMode(false);
    setZoomLevel(100);
    toast.success("Display settings reset to defaults");
  };

  return (
    <div className="space-y-6">
      {/* Layout Density */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout Density
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose how much content fits on your screen
          </p>
        </div>

        <RadioGroup
          value={layoutDensity}
          onValueChange={setLayoutDensity}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {layoutDensityOptions.map((option) => (
            <div key={option.value} className="relative">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={option.value}
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground text-center">
                  {option.description}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Sidebar Settings */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Sidebar Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Customize sidebar behavior and appearance
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sidebarWidth">Sidebar Width (px)</Label>
            <Input
              id="sidebarWidth"
              type="number"
              value={sidebarWidth}
              onChange={(e) => setSidebarWidth(Number(e.target.value))}
              min={200}
              max={400}
              className="w-full md:w-32"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-hide Sidebar</Label>
              <p className="text-sm text-muted-foreground">
                Automatically hide sidebar when not in use
              </p>
            </div>
            <Switch
              checked={autoHideSidebar}
              onCheckedChange={setAutoHideSidebar}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Content Area */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Maximize className="h-4 w-4" />
            Content Area
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure the main content display area
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Content Width</Label>
            <Select value={contentWidth} onValueChange={setContentWidth}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentWidthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zoomLevel">Zoom Level (%)</Label>
            <Input
              id="zoomLevel"
              type="number"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              min={75}
              max={150}
              className="w-full md:w-32"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Visual Aids */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Visual Aids
          </h3>
          <p className="text-sm text-muted-foreground">
            Enable visual helpers for better navigation
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Grid Lines</Label>
              <p className="text-sm text-muted-foreground">
                Display subtle grid lines for alignment
              </p>
            </div>
            <Switch
              checked={showGridLines}
              onCheckedChange={setShowGridLines}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Enable Animations
              </Label>
              <p className="text-sm text-muted-foreground">
                Smooth transitions and hover effects
              </p>
            </div>
            <Switch
              checked={enableAnimations}
              onCheckedChange={setEnableAnimations}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Fullscreen Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Hide browser chrome for distraction-free work
              </p>
            </div>
            <Switch
              checked={fullscreenMode}
              onCheckedChange={setFullscreenMode}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSaveSettings}>Save Display Settings</Button>
        <Button variant="outline" onClick={handleResetSettings}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};
