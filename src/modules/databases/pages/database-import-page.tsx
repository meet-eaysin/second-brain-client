import React from 'react';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Main } from '@/layout/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    Upload, 
    Database,
    CheckCircle,
    AlertCircle,
    FileSpreadsheet,
    FileJson,
    Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDatabasesLink } from '@/app/router/router-link';

interface ImportFormat {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    extensions: string[];
    maxSize: string;
    supported: boolean;
}

const importFormats: ImportFormat[] = [
    {
        id: 'csv',
        name: 'CSV Files',
        description: 'Comma-separated values from Excel, Google Sheets, etc.',
        icon: FileSpreadsheet,
        extensions: ['.csv'],
        maxSize: '50MB',
        supported: true
    },
    {
        id: 'json',
        name: 'JSON Files',
        description: 'JavaScript Object Notation data format',
        icon: FileJson,
        extensions: ['.json'],
        maxSize: '25MB',
        supported: true
    },
    {
        id: 'notion',
        name: 'Notion Export',
        description: 'Import from Notion database exports',
        icon: Database,
        extensions: ['.csv', '.html'],
        maxSize: '100MB',
        supported: true
    },
    {
        id: 'airtable',
        name: 'Airtable',
        description: 'Import from Airtable base exports',
        icon: Database,
        extensions: ['.csv'],
        maxSize: '50MB',
        supported: false
    },
    {
        id: 'google-sheets',
        name: 'Google Sheets',
        description: 'Direct import from Google Sheets',
        icon: Globe,
        extensions: ['URL'],
        maxSize: 'N/A',
        supported: false
    }
];

export default function DatabaseImportPage() {
    const navigate = useNavigate();
    const [selectedFormat, setSelectedFormat] = React.useState<string | null>(null);
    const [dragActive, setDragActive] = React.useState(false);
    const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploadedFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
        }
    };

    const handleImport = () => {
        if (uploadedFile && selectedFormat) {
            // TODO: Implement actual import logic
            console.log('Importing file:', uploadedFile.name, 'as format:', selectedFormat);
            navigate(getDatabasesLink());
        }
    };

    return (
        <>
            <EnhancedHeader showDatabaseActions={true} />
            
            <Main className="space-y-6">
                {/* Page Header */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Import Database</h1>
                    <p className="text-muted-foreground">
                        Import data from various sources to create a new database
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Import Formats */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Import Formats</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Choose the format of your data
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {importFormats.map((format) => (
                                    <div
                                        key={format.id}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                            selectedFormat === format.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                        } ${!format.supported ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => format.supported && setSelectedFormat(format.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-purple-100 to-blue-100">
                                                <format.icon className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-sm">{format.name}</h4>
                                                    {format.supported ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs">
                                                            Coming Soon
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {format.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {format.extensions.join(', ')}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        Max: {format.maxSize}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upload Area */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Upload File</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Drag and drop your file or click to browse
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* File Upload Area */}
                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                        dragActive
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    {uploadedFile ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto">
                                                <CheckCircle className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{uploadedFile.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setUploadedFile(null)}
                                            >
                                                Remove File
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mx-auto">
                                                <Upload className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">Drop your file here</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    or click to browse from your computer
                                                </p>
                                            </div>
                                            <div>
                                                <Input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept=".csv,.json,.html"
                                                    className="hidden"
                                                    id="file-upload"
                                                />
                                                <Label htmlFor="file-upload">
                                                    <Button variant="outline" asChild>
                                                        <span>Browse Files</span>
                                                    </Button>
                                                </Label>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Import Settings */}
                                {uploadedFile && selectedFormat && (
                                    <div className="space-y-4">
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium mb-3">Import Settings</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <Label htmlFor="database-name">Database Name</Label>
                                                    <Input
                                                        id="database-name"
                                                        placeholder="Enter database name"
                                                        defaultValue={uploadedFile.name.replace(/\.[^/.]+$/, "")}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span>First row will be used as column headers</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Import Button */}
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(getDatabasesLink())}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleImport}
                                        disabled={!uploadedFile || !selectedFormat}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                    >
                                        <Database className="h-4 w-4 mr-2" />
                                        Import Database
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Main>
        </>
    );
}
