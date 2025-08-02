import React, { useState } from 'react';
import { Upload, Search, File, Download, Trash2, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetFiles, useDeleteFile, useDownloadFile } from '../services/filesQueries';
import { UploadFileDialog } from './UploadFileDialog';
import type { FileQueryParams } from '@/types/files.types';

export const FilesManager: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

    const queryParams: FileQueryParams = {
        search: searchQuery || undefined,
        category: selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined,
        mimeType: selectedType && selectedType !== 'all' ? selectedType : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit: 20,
    };

    const { data: filesResponse, isLoading, error } = useGetFiles(queryParams);
    const deleteFileMutation = useDeleteFile();
    const downloadFileMutation = useDownloadFile();

    const handleDeleteFile = async (fileId: string) => {
        if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
            await deleteFileMutation.mutateAsync(fileId);
        }
    };

    const handleDownloadFile = async (fileId: string) => {
        await downloadFileMutation.mutateAsync(fileId);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return '🖼️';
        if (mimeType.startsWith('video/')) return '🎥';
        if (mimeType.startsWith('audio/')) return '🎵';
        if (mimeType.includes('pdf')) return '📄';
        if (mimeType.includes('word')) return '📝';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
        if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📈';
        return '📁';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                Failed to load files. Please try again.
            </div>
        );
    }

    const files = filesResponse?.files || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <File className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">Files</h1>
                    <Badge variant="secondary">{filesResponse?.total || 0}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                        {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                    </Button>
                    <Button onClick={() => setIsUploadDialogOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="images">Images</SelectItem>
                        <SelectItem value="videos">Videos</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="archives">Archives</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="image">Images</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="word">Word Documents</SelectItem>
                        <SelectItem value="excel">Spreadsheets</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Files Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {files.map((file) => (
                        <Card key={file.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl">{getFileIcon(file.mimeType)}</span>
                                        <CardTitle className="text-sm truncate">{file.originalName}</CardTitle>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDownloadFile(file.id)}
                                            disabled={downloadFileMutation.isPending}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteFile(file.id)}
                                            disabled={deleteFileMutation.isPending}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">
                                        {formatFileSize(file.size)}
                                    </div>
                                    {file.category && (
                                        <Badge variant="outline" className="text-xs">
                                            {file.category}
                                        </Badge>
                                    )}
                                    {file.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {file.description}
                                        </p>
                                    )}
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(file.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {files.map((file) => (
                        <Card key={file.id} className="hover:shadow-sm transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        <span className="text-xl">{getFileIcon(file.mimeType)}</span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium truncate">{file.originalName}</h3>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <span>{formatFileSize(file.size)}</span>
                                                {file.category && <Badge variant="outline" className="text-xs">{file.category}</Badge>}
                                                <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDownloadFile(file.id)}
                                            disabled={downloadFileMutation.isPending}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteFile(file.id)}
                                            disabled={deleteFileMutation.isPending}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {files.length === 0 && (
                <div className="text-center py-12">
                    <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No files found</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery || (selectedCategory && selectedCategory !== 'all') || (selectedType && selectedType !== 'all')
                            ? 'Try adjusting your filters.'
                            : 'Upload your first file to get started.'}
                    </p>
                    {!searchQuery && (!selectedCategory || selectedCategory === 'all') && (!selectedType || selectedType === 'all') && (
                        <Button onClick={() => setIsUploadDialogOpen(true)}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Files
                        </Button>
                    )}
                </div>
            )}

            {/* Upload Dialog */}
            <UploadFileDialog
                open={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
            />
        </div>
    );
};
