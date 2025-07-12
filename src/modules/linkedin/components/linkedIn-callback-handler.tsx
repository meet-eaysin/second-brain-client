import { useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { parseLinkedInCallback } from "@/modules/linkedin/services/linkedinApi.ts";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";

const LinkedInCallbackHandler: React.FC = () => {
    const [searchParams] = useSearchParams();
    // const navigate = useNavigate();
    const callbackMutation = useLinkedInCallbackMutation();

    const { code, state } = parseLinkedInCallback(searchParams);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                
                await callbackMutation.mutateAsync({ code, state });

                console.log('LinkedIn callback processed successfully:', { code, state });
                toast.success('LinkedIn account connected successfully!');
                // navigate('/social-accounts', { replace: true });
            } catch (error) {
                console.error('LinkedIn callback error:', error);
                toast.error('Failed to connect LinkedIn account');
                // navigate('/social-accounts', { replace: true });
            }
        };
        if (code !== undefined && code !== null) {
            handleCallback();
            console.log(code);
        }
            // navigate('/social-accounts', { replace: true });
        
    }, [code]);

    if (callbackMutation.isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-[#0077b5] rounded-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold mb-2">
                                    Connecting LinkedIn Account
                                </h2>
                                <p className="text-muted-foreground">
                                    Please wait while we connect your LinkedIn account...
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (callbackMutation.isError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Failed to connect LinkedIn account. Please try again.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
};

export default LinkedInCallbackHandler;