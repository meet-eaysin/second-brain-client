import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Table skeleton for data table loading
export function DatabasesTableSkeleton() {
    return (
        <div className="space-y-4">
            {/* Toolbar skeleton */}
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-8 w-[70px]" />
                    <Skeleton className="h-8 w-[70px]" />
                </div>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-[70px]" />
                    <Skeleton className="h-8 w-[100px]" />
                </div>
            </div>

            {/* Table skeleton */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">
                                <Skeleton className="h-4 w-4" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-[120px]" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-[80px]" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-[80px]" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-[100px]" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-[80px]" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-[80px]" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-[80px]" />
                            </TableHead>
                            <TableHead className="w-[60px]">
                                <Skeleton className="h-4 w-[50px]" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(8)].map((_, i) => (
                            <TableRow key={i}>
                                {/* Selection checkbox */}
                                <TableCell>
                                    <Skeleton className="h-4 w-4" />
                                </TableCell>
                                
                                {/* Database name and info */}
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <Skeleton className="h-10 w-10 rounded-lg" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-[140px]" />
                                            <Skeleton className="h-3 w-[100px]" />
                                        </div>
                                    </div>
                                </TableCell>
                                
                                {/* Owner */}
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Skeleton className="h-6 w-6 rounded-full" />
                                        <Skeleton className="h-4 w-[60px]" />
                                    </div>
                                </TableCell>
                                
                                {/* Records count */}
                                <TableCell>
                                    <Skeleton className="h-4 w-[50px]" />
                                </TableCell>
                                
                                {/* Collaborators */}
                                <TableCell>
                                    <div className="flex items-center space-x-1">
                                        <Skeleton className="h-3 w-3" />
                                        <Skeleton className="h-4 w-[20px]" />
                                    </div>
                                </TableCell>
                                
                                {/* Visibility */}
                                <TableCell>
                                    <Skeleton className="h-6 w-[70px] rounded-full" />
                                </TableCell>
                                
                                {/* Updated */}
                                <TableCell>
                                    <div className="flex items-center space-x-1">
                                        <Skeleton className="h-3 w-3" />
                                        <Skeleton className="h-4 w-[70px]" />
                                    </div>
                                </TableCell>
                                
                                {/* Created */}
                                <TableCell>
                                    <div className="flex items-center space-x-1">
                                        <Skeleton className="h-3 w-3" />
                                        <Skeleton className="h-4 w-[70px]" />
                                    </div>
                                </TableCell>
                                
                                {/* Actions */}
                                <TableCell>
                                    <Skeleton className="h-8 w-8" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-[100px]" />
                    <Skeleton className="h-8 w-[70px]" />
                    <Skeleton className="h-8 w-[70px]" />
                    <Skeleton className="h-8 w-[100px]" />
                </div>
            </div>
        </div>
    );
}

// Card skeleton for when using card view
export function DatabasesCardSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div className="space-y-1">
                                    <Skeleton className="h-5 w-[120px]" />
                                    <Skeleton className="h-4 w-[80px]" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[80%]" />
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-4 w-[60px]" />
                            </div>
                            <Skeleton className="h-6 w-[70px] rounded-full" />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                            <Skeleton className="h-4 w-[80px]" />
                            <Skeleton className="h-4 w-[60px]" />
                        </div>
                        
                        <div className="flex gap-2">
                            <Skeleton className="h-8 flex-1" />
                            <Skeleton className="h-8 flex-1" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Stats skeleton - minimal
export function DatabasesStatsSkeleton() {
    return (
        <div className="flex items-center gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-[20px]" />
                    <Skeleton className="h-4 w-[40px]" />
                </div>
            ))}
        </div>
    );
}

// Search and filters skeleton
export function DatabasesFiltersSkeleton() {
    return (
        <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/30">
            <CardContent className="pt-6">
                {/* Search bar skeleton */}
                <div className="mb-6">
                    <Skeleton className="h-12 w-full" />
                </div>

                {/* Filter controls skeleton */}
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-wrap gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-[80px]" />
                                <Skeleton className="h-10 w-[140px]" />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-end gap-4">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-[60px]" />
                            <Skeleton className="h-10 w-[120px]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-[50px] opacity-0" />
                            <Skeleton className="h-10 w-[140px]" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
