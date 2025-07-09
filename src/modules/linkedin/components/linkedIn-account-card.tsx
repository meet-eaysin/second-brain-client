import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {AlertCircle, Briefcase, Calendar, CheckCircle, ExternalLink, Loader2, RefreshCw} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import React from "react";
import type {LinkedInConnectionStatus} from "@/modules/linkedin/types";

export const LinkedInAccountCard: React.FC<{
    connectionData: LinkedInConnectionStatus;
    onConnect: () => void;
    onDisconnect: () => void;
    onSync: () => void;
    isConnecting: boolean;
    isDisconnecting: boolean;
    isSyncing: boolean;
}> = ({ connectionData, onConnect, onDisconnect, onSync, isConnecting, isDisconnecting, isSyncing }) => {
    const { isConnected, connection } = connectionData;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getProfileImage = () => {
        return connection?.profile?.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier;
    };

    const getFullName = () => {
        const firstName = connection?.profile?.firstName?.localized?.['en_US'] || '';
        const lastName = connection?.profile?.lastName?.localized?.['en_US'] || '';
        return `${firstName} ${lastName}`.trim();
    };

    const getHeadline = () => {
        return connection?.profile?.headline?.localized?.['en_US'] || '';
    };

    const getLinkedInUrl = () => {
        return connection?.profile?.vanityName
            ? `https://linkedin.com/in/${connection.profile.vanityName}`
            : '#';
    };

    if (!isConnected) {
        return (
            <Card className="relative">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#0077b5] rounded-lg flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">LinkedIn</CardTitle>
                                <CardDescription>Connect your LinkedIn account</CardDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Not Connected
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Connect your LinkedIn account to sync your posts, manage your professional network, and enhance your social media presence.
                        </p>
                        <div className="flex space-x-2">
                            <Button
                                onClick={onConnect}
                                disabled={isConnecting}
                                className="bg-[#0077b5] hover:bg-[#005885]"
                            >
                                {isConnecting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Connect LinkedIn
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="relative">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#0077b5] rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">LinkedIn</CardTitle>
                            <CardDescription>Professional networking platform</CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Profile Information */}
                    <div className="flex items-start space-x-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={getProfileImage()} alt="LinkedIn Profile" />
                            <AvatarFallback className="bg-[#0077b5] text-white">
                                {getFullName().split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-semibold truncate">{getFullName()}</h3>
                                <Button variant="ghost" size="sm" asChild>
                                    <a href={getLinkedInUrl()} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{getHeadline()}</p>
                            {connection?.profile?.vanityName && (
                                <p className="text-xs text-muted-foreground">
                                    linkedin.com/in/{connection.profile.vanityName}
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Connection Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Connected</span>
                            </div>
                            <p className="text-sm text-muted-foreground pl-6">
                                {formatDate(connection?.connectedAt || "_")}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Last Sync</span>
                            </div>
                            <p className="text-sm text-muted-foreground pl-6">
                                {formatDate(connection?.lastSyncAt || "")}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={onSync}
                            disabled={isSyncing}
                            size="sm"
                        >
                            {isSyncing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Syncing...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Sync Posts
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onDisconnect}
                            disabled={isDisconnecting}
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                            {isDisconnecting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Disconnecting...
                                </>
                            ) : (
                                'Disconnect'
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};