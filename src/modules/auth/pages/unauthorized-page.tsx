import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { getDashboardLink } from '@/app/router/router-link';

const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate(getDashboardLink());
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <ShieldX className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Access Denied
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        You don't have permission to access this resource. 
                        Please contact your administrator if you believe this is an error.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <Button 
                            onClick={handleGoBack}
                            variant="outline"
                            className="w-full"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                        <Button 
                            onClick={handleGoHome}
                            className="w-full"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Go to Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UnauthorizedPage;
