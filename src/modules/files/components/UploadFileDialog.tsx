import React, { useState, useCallback } from 'react';
import { Upload, X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useUploadFile, useBulkUploadFiles } from '../services/filesQueries';
import type { UploadFileRequest } from '@/types/files.types';

interface UploadFileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const UploadFileDialog: React.FC<UploadFileDialogProps> = ({
    open,
    onOpenChange,
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState<UploadFileRequest>({
        description: '',
        category: '',
        tags: [],
        isPublic: false,
    });
    const [dragActive, setDragActive] = useState(false);

    const uploadFileMutation = useUploadFile();
    const bulkUploadMutation = useBulkUploadFiles();

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const files = Array.from(e.dataTransfer.files);
            setSelectedFiles(prev => [...prev, ...files]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedFiles.length === 0) {
            return;
        }

        try {
            if (selectedFiles.length === 1) {
                await uploadFileMutation.mutateAsync({
                    file: selectedFiles[0],
                    data: {
                        ...formData,
                        description: formData.description?.trim() || undefined,
                        category: formData.category || undefined,
                    },
                });
            } else {
                await bulkUploadMutation.mutateAsync({
                    files: selectedFiles,
                    data: {
                        ...formData,
                        description: formData.description?.trim() || undefined,
                        category: formData.category || undefined,
                    },
                });
            }
            
            // Reset form and close dialog
            setSelectedFiles([]);
            setFormData({
                description: '',
                category: '',
                tags: [],
                isPublic: false,
            });
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    const handleInputChange = (field: keyof UploadFileRequest, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const isUploading = uploadFileMutation.isPending || bulkUploadMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            dragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground/25 hover:border-primary/50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <div className="space-y-2">
                            <p className="text-lg font-medium">
                                Drop files here or click to browse
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Support for images, documents, videos, and more
                            </p>
                        </div>
                        <Input
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <Label
                            htmlFor="file-upload"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4 cursor-pointer"
                        >
                            Browse Files
                        </Label>
                    </div>

                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                            <Label>Selected Files ({selectedFiles.length})</Label>
                            <div className="max-h-32 overflow-y-auto space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <File className="h-4 w-4" />
                                            <span className="text-sm font-medium">{file.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({formatFileSize(file.size)})
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* File Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="documents">Documents</SelectItem>
                                    <SelectItem value="images">Images</SelectItem>
                                    <SelectItem value="videos">Videos</SelectItem>
                                    <SelectItem value="audio">Audio</SelectItem>
                                    <SelectItem value="archives">Archives</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isPublic"
                                    checked={formData.isPublic}
                                    onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                                />
                                <Label htmlFor="isPublic" className="text-sm">
                                    Make files public
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter file description (optional)"
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={selectedFiles.length === 0 || isUploading}
                        >
                            {isUploading
                                ? 'Uploading...'
                                : `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
