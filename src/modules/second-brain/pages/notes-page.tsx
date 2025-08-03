import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NotesPage = () => {
    return (
        <>
            <EnhancedHeader
                contextActions={
                    <Button size="sm" className="h-8 gap-2">
                        <Plus className="h-4 w-4" />
                        New Note
                    </Button>
                }
            />

            <Main className="space-y-8">
                {/* Page Description */}
                <div className="space-y-2">
                    <p className="text-muted-foreground">
                        Manage your personal knowledge base
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Notes</CardTitle>
                        <CardDescription>
                            Create, organize, and search through your notes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
                            <div className="text-center space-y-3">
                                <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                                <p className="text-lg font-medium">No notes yet</p>
                                <p className="text-sm text-muted-foreground">
                                    Start building your knowledge base by creating your first note
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Main>
        </>
    )
}

export default NotesPage