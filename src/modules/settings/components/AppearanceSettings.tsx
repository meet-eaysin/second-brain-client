import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Monitor, Moon, Sun, Palette, Eye, Layout, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const AppearanceSettings: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [fontSize, setFontSize] = React.useState('medium');
    const [sidebarStyle, setSidebarStyle] = React.useState('default');
    const [compactMode, setCompactMode] = React.useState(false);
    const [animationsEnabled, setAnimationsEnabled] = React.useState(true);
    const [highContrast, setHighContrast] = React.useState(false);

    const themeOptions = [
        {
            value: 'light',
            label: 'Light',
            description: 'Clean and bright interface',
            icon: Sun,
        },
        {
            value: 'dark',
            label: 'Dark',
            description: 'Easy on the eyes in low light',
            icon: Moon,
        },
        {
            value: 'system',
            label: 'System',
            description: 'Follows your system preference',
            icon: Monitor,
        },
    ];

    const fontSizeOptions = [
        { value: 'small', label: 'Small', description: '14px base size' },
        { value: 'medium', label: 'Medium', description: '16px base size' },
        { value: 'large', label: 'Large', description: '18px base size' },
    ];

    const sidebarStyleOptions = [
        { value: 'default', label: 'Default', description: 'Standard sidebar with icons and text' },
        { value: 'compact', label: 'Compact', description: 'Smaller sidebar with minimal spacing' },
        { value: 'minimal', label: 'Minimal', description: 'Icons only, text on hover' },
    ];

    const handleSavePreferences = () => {
        // Save preferences to localStorage or API
        const preferences = {
            theme,
            fontSize,
            sidebarStyle,
            compactMode,
            animationsEnabled,
            highContrast,
        };
        
        localStorage.setItem('appearance-preferences', JSON.stringify(preferences));
        toast.success('Appearance preferences saved');
    };

    const handleResetToDefaults = () => {
        setTheme('system');
        setFontSize('medium');
        setSidebarStyle('default');
        setCompactMode(false);
        setAnimationsEnabled(true);
        setHighContrast(false);
        toast.success('Reset to default appearance settings');
    };

    return (
        <div className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Theme
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Choose your preferred color scheme
                    </p>
                </div>
                
                <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                    <Icon className="h-6 w-6 mb-2" />
                                    <span className="font-medium">{option.label}</span>
                                    <span className="text-xs text-muted-foreground text-center">
                                        {option.description}
                                    </span>
                                </Label>
                            </div>
                        );
                    })}
                </RadioGroup>
            </div>

            <Separator />

            {/* Font Size */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Font Size
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Adjust the base font size for better readability
                    </p>
                </div>
                
                <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger className="w-full md:w-64">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {fontSizeOptions.map((option) => (
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

            <Separator />

            {/* Sidebar Style */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Layout className="h-4 w-4" />
                        Sidebar Style
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Choose how the sidebar appears and behaves
                    </p>
                </div>
                
                <Select value={sidebarStyle} onValueChange={setSidebarStyle}>
                    <SelectTrigger className="w-full md:w-64">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {sidebarStyleOptions.map((option) => (
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

            <Separator />

            {/* Interface Options */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium">Interface Options</h3>
                    <p className="text-sm text-muted-foreground">
                        Customize the interface behavior and appearance
                    </p>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="compact-mode">Compact Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                Reduce spacing and padding for a denser layout
                            </p>
                        </div>
                        <Switch
                            id="compact-mode"
                            checked={compactMode}
                            onCheckedChange={setCompactMode}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="animations" className="flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Animations
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Enable smooth transitions and animations
                            </p>
                        </div>
                        <Switch
                            id="animations"
                            checked={animationsEnabled}
                            onCheckedChange={setAnimationsEnabled}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="high-contrast">High Contrast</Label>
                            <p className="text-sm text-muted-foreground">
                                Increase contrast for better accessibility
                            </p>
                        </div>
                        <Switch
                            id="high-contrast"
                            checked={highContrast}
                            onCheckedChange={setHighContrast}
                        />
                    </div>
                </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
                <Button onClick={handleSavePreferences}>
                    Save Preferences
                </Button>
                <Button variant="outline" onClick={handleResetToDefaults}>
                    Reset to Defaults
                </Button>
            </div>
        </div>
    );
};
