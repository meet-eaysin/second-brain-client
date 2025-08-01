// Centralized auth manager to prevent duplicate API calls
class AuthManager {
    private static instance: AuthManager;
    private isInitializing = false;
    private initPromise: Promise<any> | null = null;
    
    static getInstance(): AuthManager {
        if (!AuthManager.instance) {
            AuthManager.instance = new AuthManager();
        }
        return AuthManager.instance;
    }
    
    isCurrentlyInitializing(): boolean {
        return this.isInitializing;
    }
    
    setInitializing(value: boolean): void {
        this.isInitializing = value;
        if (!value) {
            this.initPromise = null;
        }
    }
    
    getInitPromise(): Promise<any> | null {
        return this.initPromise;
    }
    
    setInitPromise(promise: Promise<any>): void {
        this.initPromise = promise;
    }
    
    reset(): void {
        this.isInitializing = false;
        this.initPromise = null;
    }
}

export const authManager = AuthManager.getInstance();
