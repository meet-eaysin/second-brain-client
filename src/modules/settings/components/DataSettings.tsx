import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
    Database, 
    Download, 
    Upload, 
    Trash2, 
    HardDrive, 
    FileText, 
    Image, 
    Archive,
    Cloud,
    RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export const DataSettings: React.FC = () => {
    const [autoBackup, setAutoBackup] = useState(true);
    const [backupFrequency, setBackupFrequency] = useState('daily');
    const [dataRetention, setDataRetention] = useState('1year');

    // Mock data
    const storageUsed = 2.4; // GB
    const storageLimit = 10; // GB
    const storagePercentage = (storageUsed / storageLimit) * 100;

    const handleExportData = () => {
        toast.info('Data export will start shortly');
    };

    const handleImportData = () => {
        toast.info('Data import feature coming soon');
    };

    const handleClearCache = () => {
        toast.success('Cache cleared successfully');
    };

    return (
        <div className="space-y-6">
            {/* Storage Usage */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4" />
                        Storage Usage
                    </CardTitle>
                    <CardDescription>
                        Monitor your storage usage and manage your data
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Used: {storageUsed} GB</span>
                            <span>Limit: {storageLimit} GB</span>
                        </div>
                        <Progress value={storagePercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <Database className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                            <p className="text-sm font-medium">Databases</p>
                            <p className="text-xs text-muted-foreground">1.2 GB</p>
                        </div>
                        <div className="text-center">
                            <Image className="h-8 w-8 mx-auto mb-2 text-green-500" />
                            <p className="text-sm font-medium">Images</p>
                            <p className="text-xs text-muted-foreground">0.8 GB</p>
                        </div>
                        <div className="text-center">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                            <p className="text-sm font-medium">Documents</p>
                            <p className="text-xs text-muted-foreground">0.3 GB</p>
                        </div>
                        <div className="text-center">
                            <Archive className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                            <p className="text-sm font-medium">Archives</p>
                            <p className="text-xs text-muted-foreground">0.1 GB</p>
                        </div>
                    </div>

                    {storagePercentage > 80 && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                You're running low on storage space. Consider upgrading your plan or cleaning up old files.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Backup & Sync */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        Backup & Sync
                    </CardTitle>
                    <CardDescription>
                        Configure automatic backups and data synchronization
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Automatic Backup</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically backup your data to the cloud
                            </p>
                        </div>
                        <Switch
                            checked={autoBackup}
                            onCheckedChange={setAutoBackup}
                        />
                    </div>

                    {autoBackup && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Backup Frequency</Label>
                                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                                    <SelectTrigger className="w-full md:w-64">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hourly">Every Hour</SelectItem>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="p-4 bg-muted rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary">Last Backup</Badge>
                                    <span className="text-sm">2 hours ago</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Next backup scheduled for tomorrow at 2:00 AM
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>
                        Import, export, and manage your data
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            onClick={handleExportData}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Export All Data
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleImportData}
                            className="flex items-center gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Import Data
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>Data Retention Period</Label>
                        <Select value={dataRetention} onValueChange={setDataRetention}>
                            <SelectTrigger className="w-full md:w-64">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30days">30 Days</SelectItem>
                                <SelectItem value="90days">90 Days</SelectItem>
                                <SelectItem value="1year">1 Year</SelectItem>
                                <SelectItem value="forever">Forever</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            How long to keep deleted items before permanent removal
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Cache & Performance */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Cache & Performance
                    </CardTitle>
                    <CardDescription>
                        Manage cache and optimize performance
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Clear Cache</p>
                            <p className="text-sm text-muted-foreground">
                                Clear temporary files and cached data (245 MB)
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleClearCache}>
                            Clear Cache
                        </Button>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Performance Tips</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Regularly clear cache to free up space</li>
                            <li>• Archive old databases you don't actively use</li>
                            <li>• Compress large files before uploading</li>
                            <li>• Use tags to organize content efficiently</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
