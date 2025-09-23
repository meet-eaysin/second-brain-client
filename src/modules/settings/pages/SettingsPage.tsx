import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Palette,
  Building2,
  Bell,
  Shield,
  CreditCard,
  ChevronRight,
  Settings,
} from "lucide-react";

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  // Auto-redirect to profile settings as the main settings page
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/app/settings/profile", { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const quickSettings = [
    {
      name: "Profile",
      description: "Personal information and preferences",
      href: "/app/settings/profile",
      icon: User,
      color: "bg-blue-500",
    },
    {
      name: "Security",
      description: "Password, 2FA, and security settings",
      href: "/app/settings/security",
      icon: Shield,
      color: "bg-red-500",
    },
    {
      name: "Appearance",
      description: "Theme, layout, and visual preferences",
      href: "/app/settings/appearance",
      icon: Palette,
      color: "bg-purple-500",
    },
    {
      name: "Notifications",
      description: "Email, push, and in-app notifications",
      href: "/app/settings/notifications",
      icon: Bell,
      color: "bg-yellow-500",
    },
    {
      name: "Workspace",
      description: "Team settings and permissions",
      href: "/app/settings/workspace",
      icon: Building2,
      color: "bg-green-500",
    },
    {
      name: "Billing",
      description: "Subscription and billing information",
      href: "/app/settings/billing",
      icon: CreditCard,
      color: "bg-indigo-500",
    },
  ];

  return (
    <>
      <EnhancedHeader
        showSearch={false}
        contextActions={
          <Button size="sm" variant="outline" className="h-8 gap-2">
            <Settings className="h-4 w-4" />
            Export Settings
          </Button>
        }
      />

      <Main className="space-y-8">
        {/* Page Description */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Redirecting to your profile settings...
          </p>
        </div>

        {/* Quick Access to Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Settings Access</CardTitle>
            <CardDescription>
              Choose a settings category to manage your preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickSettings.map((setting) => {
                const SettingIcon = setting.icon;
                return (
                  <Button
                    key={setting.name}
                    variant="outline"
                    className="justify-start h-auto p-4 hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(setting.href)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div
                        className={`p-2 rounded-lg ${setting.color} text-white flex-shrink-0`}
                      >
                        <SettingIcon className="h-4 w-4" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {setting.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {setting.description}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  );
};

export default SettingsPage;
