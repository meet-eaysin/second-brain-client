import { useSearchParams } from "react-router-dom";
import React from "react";
import { toast } from "sonner";
import { AlertCircle, Building2, Globe, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { LinkedInAccountCard } from "@/modules/linkedin/components/linkedIn-account-card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import LinkedInCallbackHandler from "@/modules/linkedin/components/linkedIn-callback-handler.tsx";
import {
    useSocialAuthMutation,
    useSocialConnectionsQuery, useSocialDisconnectMutation, useSocialSyncMutation
} from "@/modules/social-connections/services/social-connection-queries.ts";

const SocialAccounts: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { data: connectionsData, isLoading, error, refetch } = useSocialConnectionsQuery();
    const authMutation = useSocialAuthMutation("LINKEDIN");
    const disconnectMutation = useSocialDisconnectMutation("LINKEDIN");
    const syncMutation = useSocialSyncMutation("LINKEDIN");

    console.log("** connectionsDat", connectionsData)
    if (searchParams.has('code') && searchParams.has('state')) {
        return <LinkedInCallbackHandler />;
    }

    const handleConnect = () => {
        const state = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        authMutation.mutate(state, {
            onSuccess: (data) => {
                console.log("LinkedIn auth initiated:", data);
                if (data?.authUrl) {
                    window.location.href = data.authUrl;
                }
            },
            onError: (error) => {
                console.error('LinkedIn auth error:', error);
                toast.error('Failed to initiate LinkedIn authentication');
            }
        });
    };

    const handleDisconnect = () => {
        disconnectMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success('LinkedIn account disconnected successfully');
                refetch();
            },
            onError: (error) => {
                console.error('LinkedIn disconnect error:', error);
                toast.error('Failed to disconnect LinkedIn account');
            }
        });
    };

    const handleSync = () => {
        syncMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success('LinkedIn posts synced successfully');
                refetch();
            },
            onError: (error) => {
                console.error('LinkedIn sync error:', error);
                toast.error('Failed to sync LinkedIn posts');
            }
        });
    };

    if (isLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center space-x-2 mb-6">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading social accounts...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load social accounts. Please try again.
                    </AlertDescription>
                </Alert>
                <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                </Button>
            </div>
        );
    }

    const connectedCount = connectionsData?.totalConnections || 0;
    const totalAvailable = 3;
    const linkedInConnection = connectionsData?.platforms?.linkedin
    const linkedInConnectionData = linkedInConnection ? {
        platform: 'LINKEDIN' as const,
        isConnected: linkedInConnection.isConnected,
        connection: linkedInConnection.isConnected ? {
            profile: linkedInConnection.profile,
            connectedAt: linkedInConnection.connectedAt!,
            lastSyncAt: linkedInConnection.lastSyncAt!,
            email: linkedInConnection.email || undefined
        } : null
    } : null;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Social Media Accounts</h1>
                <p className="text-muted-foreground">
                    Connect and manage your social media accounts to streamline your content creation and engagement.
                </p>
            </div>

            <div className="space-y-6">
                {/* Connected Accounts Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Account Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {connectedCount}
                                </div>
                                <div className="text-sm text-muted-foreground">Connected</div>
                            </div>
                            <Separator orientation="vertical" className="h-8" />
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {totalAvailable}
                                </div>
                                <div className="text-sm text-muted-foreground">Available</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* LinkedIn Account */}
                {linkedInConnectionData && (
                    <LinkedInAccountCard
                        connectionData={linkedInConnectionData || {}}
                        onConnect={handleConnect}
                        onDisconnect={handleDisconnect}
                        onSync={handleSync}
                        isConnecting={authMutation.isPending}
                        isDisconnecting={disconnectMutation.isPending}
                        isSyncing={syncMutation.isPending}
                    />
                )}

                {/* Coming Soon Cards */}
                <Card className="opacity-60">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#1877f2] rounded-lg flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Facebook</CardTitle>
                                    <CardDescription>Social networking platform</CardDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-muted-foreground">
                                Coming Soon
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Facebook integration will be available soon. Connect your Facebook account to manage your posts and engage with your audience.
                        </p>
                    </CardContent>
                </Card>

                <Card className="opacity-60">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] rounded-lg flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Instagram</CardTitle>
                                    <CardDescription>Photo and video sharing platform</CardDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-muted-foreground">
                                Coming Soon
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Instagram integration will be available soon. Connect your Instagram account to share your visual content and stories.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SocialAccounts;