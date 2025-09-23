import React from "react";
import { Link } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Github, Chrome } from "lucide-react";

export const AccountSettingsPage: React.FC = () => {
  return (
    <>
      <EnhancedHeader
        contextActions={
          <>
            <Button size="sm" variant="outline" className="h-8 gap-2" asChild>
              <Link to="/app/settings">
                <ArrowLeft className="h-4 w-4" />
                Back to Settings
              </Link>
            </Button>
            <Button size="sm" className="h-8 gap-2">
              <Shield className="h-4 w-4" />
              Account Security
            </Button>
          </>
        }
      />

      <Main className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Account</h1>
          <p className="text-muted-foreground">
            Manage your account settings and connected platforms
          </p>
        </div>

        {/* Connected Platforms */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Platforms</CardTitle>
            <CardDescription>
              Connect your accounts from other platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Chrome className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium">Google Account</div>
                  <div className="text-sm text-muted-foreground">
                    john.doe@gmail.com
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Connected</Badge>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Github className="h-5 w-5 text-gray-800" />
                </div>
                <div>
                  <div className="font-medium">GitHub</div>
                  <div className="text-sm text-muted-foreground">
                    Connect your GitHub account
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Export Account Data</div>
                <div className="text-sm text-muted-foreground">
                  Download all your data in a portable format
                </div>
              </div>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-red-600">Delete Account</div>
                <div className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </div>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  );
};

export default AccountSettingsPage;
