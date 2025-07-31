export interface User {
    id: string
    email: string
    username: string
    firstName?: string
    lastName?: string
    profilePicture?: string
    role: string
    isActive: boolean
    authProvider: 'LOCAL' | 'GOOGLE'
    googleId?: string
    isEmailVerified: boolean
    lastLoginAt?: string
    createdAt: string
    updatedAt: string
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials {
    username: string
    email: string
    password: string
    firstName?: string
    lastName?: string
}

export interface ChangePasswordCredentials {
    currentPassword: string
    newPassword: string
}

export interface ForgotPasswordCredentials {
    email: string
}

export interface ResetPasswordCredentials {
    accessToken: string
    newPassword: string
}

export interface AuthResponse {
    user: User
    accessToken: string
    refreshToken: string
}

export interface GoogleAuthResponse {
    user: User
    accessToken: string
    refreshToken: string
}

export interface RefreshTokenResponse {
    accessToken: string
}

export interface ApiResponse<T = unknown> {
    success: boolean
    message: string
    data: T
    error?: string
}