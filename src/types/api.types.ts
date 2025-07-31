export interface ApiResponse<T = any> {
    data: T
    message?: string
    success: boolean
}

export interface ApiError {
    message: string
    code?: string
    details?: unknown
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}

export interface QueryParams {
    page?: number
    limit?: number
    search?: string
    sort?: string
    filter?: Record<string, unknown>
}

export interface BaseEntity {
    id: string
    createdAt: string
    updatedAt: string
}

export interface SelectOption {
    value: string
    label: string
}

export interface LoadingState {
    isLoading: boolean
    error: string | null
}
