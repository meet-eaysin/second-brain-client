import React from "react";
import { Link } from "react-router-dom";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { BillingSettings } from "../components/BillingSettings";

export const BillingSettingsPage: React.FC = () => {
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
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>
          </>
        }
      />

      <Main className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription, billing, and payment methods
          </p>
        </div>

        <BillingSettings />
      </Main>
    </>
  );
};

export default BillingSettingsPage;
