import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NotesPage = () => {
    return (
        <div className="container mx-auto p-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">All Notes</h1>
                            <p className="text-muted-foreground">Manage your personal knowledge base</p>
                        </div>
                    </div>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Note
                    </Button>
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
            </div>
        </div>
    )
}

export default NotesPage