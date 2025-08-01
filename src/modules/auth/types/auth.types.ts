export interface User {
    id: string
    email: string
    username: string
    firstName?: string
    lastName?: string
    role: string
    authProvider: 'email' | 'google'
    isEmailVerified: boolean
    createdAt: string
    updatedAt: string
}

export interface AuthResponse {
    user: User
    accessToken: string
    refreshToken: string
}

export interface RefreshTokenResponse {
    accessToken: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials {
    email: string
    username: string
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
    resetToken: string
    newPassword: string
}

export interface ApiResponse<T = any> {
    success: boolean
    message: string
    data: T
    errors?: Record<string, string[]>
}

export interface AuthError {
    message: string
    code?: string
    field?: string
}

export interface GoogleAuthResult {
    accessToken: string
    refreshToken: string
    user: User
}

export interface PopupMessage {
    type: 'GOOGLE_AUTH_SUCCESS' | 'GOOGLE_AUTH_ERROR'
    data?: GoogleAuthResult
    error?: string
}
