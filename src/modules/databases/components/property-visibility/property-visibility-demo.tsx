import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Info, Lightbulb } from 'lucide-react';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';
import { PropertyToggle } from './property-toggle';
import { ColumnManager } from './column-manager';
import { HiddenPropertiesPanel } from './hidden-properties-panel';
import type { DatabaseProperty, DatabaseView } from '@/types/database.types';

// Mock data for demonstration
const mockProperties: DatabaseProperty[] = [
    {
        id: '1',
        name: 'Title',
        type: 'TEXT',
        required: true,
        isVisible: true,
        order: 0,
        description: 'The main title of the record'
    },
    {
        id: '2',
        name: 'Status',
        type: 'SELECT',
        required: false,
        isVisible: true,
        order: 1,
        selectOptions: [
            { id: '1', name: 'To Do', color: '#gray' },
            { id: '2', name: 'In Progress', color: '#blue' },
            { id: '3', name: 'Done', color: '#green' }
        ]
    },
    {
        id: '3',
        name: 'Priority',
        type: 'SELECT',
        required: false,
        isVisible: false, // Globally hidden
        order: 2,
        selectOptions: [
            { id: '1', name: 'Low', color: '#green' },
            { id: '2', name: 'Medium', color: '#yellow' },
            { id: '3', name: 'High', color: '#red' }
        ]
    },
    {
        id: '4',
        name: 'Due Date',
        type: 'DATE',
        required: false,
        isVisible: true,
        order: 3,
        description: 'When this task should be completed'
    },
    {
        id: '5',
        name: 'Assignee',
        type: 'TEXT',
        required: false,
        isVisible: true,
        order: 4,
        description: 'Person responsible for this task'
    },
    {
        id: '6',
        name: 'Tags',
        type: 'MULTI_SELECT',
        required: false,
        isVisible: true,
        order: 5,
        selectOptions: [
            { id: '1', name: 'Frontend', color: '#blue' },
            { id: '2', name: 'Backend', color: '#green' },
            { id: '3', name: 'Design', color: '#purple' }
        ]
    },
    {
        id: '7',
        name: 'Internal Notes',
        type: 'TEXT',
        required: false,
        isVisible: false, // Globally hidden
        order: 6,
        description: 'Private notes not visible to clients'
    }
];

const mockView: DatabaseView = {
    id: 'view-1',
    name: 'Main View',
    type: 'TABLE',
    isDefault: true,
    visibleProperties: ['1', '2', '4', '5'], // Title, Status, Due Date, Assignee (Tags is hidden in this view)
    filters: [],
    sorts: []
};

export function PropertyVisibilityDemo() {
    const [properties, setProperties] = useState<DatabaseProperty[]>(mockProperties);
    const [currentView, setCurrentView] = useState<DatabaseView>(mockView);

    const handleToggleProperty = (propertyId: string, isVisible: boolean) => {
        setProperties(prev => prev.map(prop => 
            prop.id === propertyId 
                ? { ...prop, isVisible }
                : prop
        ));
    };

    const handleUpdateViewVisibility = (visibleProperties: string[]) => {
        setCurrentView(prev => ({
            ...prev,
            visibleProperties
        }));
    };

    const handleShowAll = () => {
        const allVisiblePropertyIds = properties
            .filter(p => p.isVisible !== false)
            .map(p => p.id);
        setCurrentView(prev => ({
            ...prev,
            visibleProperties: allVisiblePropertyIds
        }));
    };

    const handleHideNonRequired = () => {
        const requiredPropertyIds = properties
            .filter(p => p.required && p.isVisible !== false)
            .map(p => p.id);
        setCurrentView(prev => ({
            ...prev,
            visibleProperties: requiredPropertyIds
        }));
    };

    const handleRestoreAllGlobal = () => {
        setProperties(prev => prev.map(prop => ({ ...prop, isVisible: true })));
    };

    const handleRestoreAllView = () => {
        const allVisiblePropertyIds = properties
            .filter(p => p.isVisible !== false)
            .map(p => p.id);
        setCurrentView(prev => ({
            ...prev,
            visibleProperties: allVisiblePropertyIds
        }));
    };

    const visibleInView = properties.filter(p =>
        p.isVisible !== false && currentView?.visibleProperties?.includes(p.id)
    );
    const globallyHidden = properties.filter(p => p.isVisible === false);
    const viewHidden = properties.filter(p =>
        p.isVisible !== false && !currentView?.visibleProperties?.includes(p.id)
    );

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Property Visibility System Demo</h1>
                <p className="text-muted-foreground">
                    Interactive demonstration of the database property visibility features
                </p>
            </div>

            {/* Overview Alert */}
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>How Property Visibility Works</AlertTitle>
                <AlertDescription className="space-y-2">
                    <p>
                        <strong>Global Visibility:</strong> Controls whether a property appears anywhere in the database.
                        When globally hidden, the property won't show in any view.
                    </p>
                    <p>
                        <strong>View-Specific Visibility:</strong> Controls which properties are shown in specific views.
                        This allows different views to show different sets of columns.
                    </p>
                </AlertDescription>
            </Alert>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{properties.length}</div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Eye className="h-4 w-4 text-green-500" />
                            Visible in View
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{visibleInView.length}</div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <EyeOff className="h-4 w-4 text-red-500" />
                            Globally Hidden
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{globallyHidden.length}</div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <EyeOff className="h-4 w-4 text-orange-500" />
                            View Hidden
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{viewHidden.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Column Manager Demo */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Column Manager
                        <Badge variant="outline">Interactive</Badge>
                    </CardTitle>
                    <CardDescription>
                        Use the column manager to control which properties are visible in the current view.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                        <ColumnManager
                            properties={properties}
                            currentView={currentView}
                            databaseId="demo-db"
                            onToggleProperty={handleToggleProperty}
                            onUpdateViewVisibility={handleUpdateViewVisibility}
                            onShowAll={handleShowAll}
                            onHideNonRequired={handleHideNonRequired}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Property Toggles Demo */}
            <Card>
                <CardHeader>
                    <CardTitle>Individual Property Toggles</CardTitle>
                    <CardDescription>
                        Click the eye icons to toggle individual property visibility.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {properties.map((property) => {
                        const isVisible = property.isVisible !== false && currentView?.visibleProperties?.includes(property.id);
                        const isGloballyHidden = property.isVisible === false;
                        const isViewHidden = !isGloballyHidden && !currentView?.visibleProperties?.includes(property.id);

                        return (
                            <PropertyToggle
                                key={property.id}
                                property={property}
                                isVisible={isVisible}
                                isGloballyHidden={isGloballyHidden}
                                isViewHidden={isViewHidden}
                                onToggle={handleToggleProperty}
                                showLabel={true}
                                showType={true}
                            />
                        );
                    })}
                </CardContent>
            </Card>

            {/* Hidden Properties Panel Demo */}
            {(globallyHidden.length > 0 || viewHidden.length > 0) && (
                <HiddenPropertiesPanel
                    properties={properties}
                    currentView={currentView}
                    onToggleProperty={handleToggleProperty}
                    onRestoreAllGlobal={handleRestoreAllGlobal}
                    onRestoreAllView={handleRestoreAllView}
                />
            )}

            {/* Tips */}
            <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Pro Tips</AlertTitle>
                <AlertDescription className="space-y-2">
                    <ul className="list-disc list-inside space-y-1">
                        <li>Use <strong>global hiding</strong> for properties that should never be visible (like internal IDs)</li>
                        <li>Use <strong>view-specific hiding</strong> to create focused views for different use cases</li>
                        <li>Required properties cannot be hidden and will always remain visible</li>
                        <li>Hidden properties are still stored and can be restored at any time</li>
                        <li>Use the "Quick Actions" in the column manager for bulk operations</li>
                    </ul>
                </AlertDescription>
            </Alert>
        </div>
    );
}
