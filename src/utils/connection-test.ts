import { apiClient } from '@/services/api-client';
import { authApi } from '@/modules/auth/services/authApi';
import { databaseApi } from '@/modules/databases/services/databaseApi';
import { workspaceApi } from '@/modules/workspaces/services/workspaceApi';
import { usersApi } from '@/modules/users/services/usersApi';
import { secondBrainApi } from '@/modules/second-brain/services/second-brain-api';

export interface ConnectionTestResult {
    service: string;
    endpoint: string;
    status: 'success' | 'error' | 'warning';
    message: string;
    responseTime?: number;
    details?: any;
}

export class ConnectionTester {
    private results: ConnectionTestResult[] = [];

    private async testEndpoint(
        service: string,
        endpoint: string,
        testFn: () => Promise<any>,
        expectAuth: boolean = false
    ): Promise<ConnectionTestResult> {
        const startTime = Date.now();
        
        try {
            console.log(`🧪 Testing ${service} - ${endpoint}`);
            const result = await testFn();
            const responseTime = Date.now() - startTime;
            
            return {
                service,
                endpoint,
                status: 'success',
                message: 'Connection successful',
                responseTime,
                details: result
            };
        } catch (error: any) {
            const responseTime = Date.now() - startTime;
            
            // If we expect auth and get 401, that's actually good (server is responding)
            if (expectAuth && error.response?.status === 401) {
                return {
                    service,
                    endpoint,
                    status: 'warning',
                    message: 'Authentication required (expected)',
                    responseTime,
                    details: { status: 401, message: 'Unauthorized' }
                };
            }
            
            return {
                service,
                endpoint,
                status: 'error',
                message: error.message || 'Connection failed',
                responseTime,
                details: {
                    status: error.response?.status,
                    data: error.response?.data,
                    code: error.code
                }
            };
        }
    }

    async runBasicConnectivityTests(): Promise<ConnectionTestResult[]> {
        console.log('🚀 Starting Basic Connectivity Tests...');
        
        const tests = [
            // Basic server health
            {
                service: 'Server Health',
                endpoint: '/health',
                testFn: () => apiClient.get('/health'),
                expectAuth: false
            },
            
            // API info
            {
                service: 'API Info',
                endpoint: '/',
                testFn: () => apiClient.get('/'),
                expectAuth: false
            },
            
            // API status
            {
                service: 'API Status',
                endpoint: '/api',
                testFn: () => apiClient.get('/api'),
                expectAuth: false
            }
        ];

        for (const test of tests) {
            const result = await this.testEndpoint(
                test.service,
                test.endpoint,
                test.testFn,
                test.expectAuth
            );
            this.results.push(result);
        }

        return this.results;
    }

    async runAuthenticationTests(): Promise<ConnectionTestResult[]> {
        console.log('🔐 Starting Authentication Tests...');
        
        const tests = [
            // Check if auth endpoints are accessible
            {
                service: 'Auth',
                endpoint: '/auth/me',
                testFn: () => authApi.getCurrentUser(),
                expectAuth: true
            },
            
            // Test Google OAuth availability
            {
                service: 'Auth',
                endpoint: '/auth/google (availability)',
                testFn: () => authApi.checkGoogleOAuthAvailability(),
                expectAuth: false
            }
        ];

        for (const test of tests) {
            const result = await this.testEndpoint(
                test.service,
                test.endpoint,
                test.testFn,
                test.expectAuth
            );
            this.results.push(result);
        }

        return this.results;
    }

    async runServiceTests(): Promise<ConnectionTestResult[]> {
        console.log('🔧 Starting Service Tests...');
        
        const tests = [
            // Database service
            {
                service: 'Databases',
                endpoint: '/databases',
                testFn: () => databaseApi.getDatabases(),
                expectAuth: true
            },
            
            // Workspace service
            {
                service: 'Workspaces',
                endpoint: '/workspaces',
                testFn: () => workspaceApi.getWorkspaces(),
                expectAuth: true
            },
            
            // Users service
            {
                service: 'Users',
                endpoint: '/users/profile',
                testFn: () => usersApi.getProfile(),
                expectAuth: true
            },
            
            // Second Brain - Dashboard
            {
                service: 'Second Brain',
                endpoint: '/second-brain/dashboard',
                testFn: () => secondBrainApi.getDashboard(),
                expectAuth: true
            },
            
            // Second Brain - Tasks
            {
                service: 'Second Brain',
                endpoint: '/second-brain/tasks',
                testFn: () => secondBrainApi.tasks.getAll(),
                expectAuth: true
            }
        ];

        for (const test of tests) {
            const result = await this.testEndpoint(
                test.service,
                test.endpoint,
                test.testFn,
                test.expectAuth
            );
            this.results.push(result);
        }

        return this.results;
    }

    async runAllTests(): Promise<ConnectionTestResult[]> {
        console.log('🧪 Starting Comprehensive Connection Tests...');
        console.log(`📍 Testing against: ${import.meta.env.VITE_API_BASE_URL}`);
        
        this.results = [];
        
        await this.runBasicConnectivityTests();
        await this.runAuthenticationTests();
        await this.runServiceTests();
        
        return this.results;
    }

    generateReport(): string {
        const successful = this.results.filter(r => r.status === 'success').length;
        const warnings = this.results.filter(r => r.status === 'warning').length;
        const errors = this.results.filter(r => r.status === 'error').length;
        
        let report = `\n📊 CONNECTION TEST REPORT\n`;
        report += `=========================\n`;
        report += `✅ Successful: ${successful}\n`;
        report += `⚠️  Warnings: ${warnings}\n`;
        report += `❌ Errors: ${errors}\n`;
        report += `📍 API Base URL: ${import.meta.env.VITE_API_BASE_URL}\n\n`;
        
        report += `DETAILED RESULTS:\n`;
        report += `-----------------\n`;
        
        this.results.forEach(result => {
            const icon = result.status === 'success' ? '✅' : 
                        result.status === 'warning' ? '⚠️' : '❌';
            
            report += `${icon} ${result.service} - ${result.endpoint}\n`;
            report += `   Status: ${result.status.toUpperCase()}\n`;
            report += `   Message: ${result.message}\n`;
            if (result.responseTime) {
                report += `   Response Time: ${result.responseTime}ms\n`;
            }
            if (result.details && result.status === 'error') {
                report += `   Details: ${JSON.stringify(result.details, null, 2)}\n`;
            }
            report += `\n`;
        });
        
        return report;
    }

    getResults(): ConnectionTestResult[] {
        return this.results;
    }
}

// Export a singleton instance for easy use
export const connectionTester = new ConnectionTester();

// Helper function to run tests and log results
export async function testConnections(): Promise<void> {
    const results = await connectionTester.runAllTests();
    const report = connectionTester.generateReport();
    
    console.log(report);
    
    // Also return results for programmatic use
    return results as any;
}

// Helper to test just basic connectivity
export async function testBasicConnectivity(): Promise<boolean> {
    try {
        const result = await apiClient.get('/health');
        console.log('✅ Basic connectivity test passed:', result.status);
        return true;
    } catch (error: any) {
        console.error('❌ Basic connectivity test failed:', {
            message: error.message,
            status: error.response?.status,
            baseURL: apiClient.defaults.baseURL
        });
        return false;
    }
}