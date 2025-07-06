export interface User {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
    role: string
    isEmailVerified: boolean
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
    firstName: string
    lastName: string
}

export interface AuthResponse {
    user: User
    token: string
    refreshToken: string
}

export interface GoogleAuthResponse {
    user: User
    token: string
    refreshToken: string
}
