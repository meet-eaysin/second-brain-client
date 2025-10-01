import React from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { BillingSettings } from "../components/billing-settings.tsx";

export const BillingPage: React.FC = () => {
  return (
    <>
      <EnhancedHeader

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

export default BillingPage;
