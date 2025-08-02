export interface Tag {
    id: string;
    name: string;
    color: string;
    description?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface TagWithUsage extends Tag {
    usedInDatabases: number;
    usedInFiles: number;
    usedInWorkspaces: number;
}

export interface CreateTagRequest {
    name: string;
    color?: string;
    description?: string;
}

export interface UpdateTagRequest {
    name?: string;
    color?: string;
    description?: string;
}

export interface TagQueryParams {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export interface TagsResponse {
    tags: TagWithUsage[];
    total: number;
}
