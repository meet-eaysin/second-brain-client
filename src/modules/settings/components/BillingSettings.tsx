import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Calendar, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export const BillingSettings: React.FC = () => {
    const handleUpgrade = () => {
        toast.info('Billing management coming soon');
    };

    const handleDownloadInvoice = () => {
        toast.info('Invoice download coming soon');
    };

    return (
        <div className="space-y-6">
            {/* Current Plan */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Current Plan
                    </CardTitle>
                    <CardDescription>
                        Manage your subscription and billing preferences
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Free Plan</h3>
                            <p className="text-sm text-muted-foreground">
                                Perfect for getting started with your second brain
                            </p>
                        </div>
                        <Badge variant="secondary">Current</Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                        <h4 className="font-medium">Plan Features</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Up to 1,000 notes</li>
                            <li>• Basic templates</li>
                            <li>• 100MB storage</li>
                            <li>• Community support</li>
                        </ul>
                    </div>
                    
                    <Button onClick={handleUpgrade} className="w-full">
                        Upgrade to Pro
                    </Button>
                </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Billing History
                    </CardTitle>
                    <CardDescription>
                        View and download your past invoices
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No billing history</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            You're currently on the free plan. Upgrade to see billing history.
                        </p>
                        <Button variant="outline" onClick={handleUpgrade}>
                            View Plans
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Method
                    </CardTitle>
                    <CardDescription>
                        Manage your payment methods and billing information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No payment method</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Add a payment method to upgrade your plan
                        </p>
                        <Button variant="outline" onClick={handleUpgrade}>
                            Add Payment Method
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
