import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Zap, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const SearchPage = () => {
    return (
        <div className="container mx-auto p-6">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Search className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold">Smart Search</h1>
                        <p className="text-muted-foreground">Find anything in your knowledge base</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Intelligent Search
                        </CardTitle>
                        <CardDescription>
                            Search across notes, databases, and documents with AI-powered understanding
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Search your knowledge base..." 
                                className="flex-1"
                            />
                            <Button variant="outline">
                                <Filter className="h-4 w-4" />
                            </Button>
                            <Button>Search</Button>
                        </div>
                        
                        <div className="flex items-center justify-center h-48 bg-muted/50 rounded-lg">
                            <div className="text-center space-y-3">
                                <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                                <p className="text-lg font-medium">Start searching</p>
                                <p className="text-sm text-muted-foreground">
                                    Enter a query to search across your entire knowledge base
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default SearchPage