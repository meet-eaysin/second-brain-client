import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Network, Brain, Zap } from 'lucide-react'

const KnowledgeGraphPage = () => {
    return (
        <div className="container mx-auto p-6">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Network className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold">Knowledge Graph</h1>
                        <p className="text-muted-foreground">Visualize connections in your knowledge base</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            Interactive Knowledge Network
                        </CardTitle>
                        <CardDescription>
                            Explore relationships between your notes, ideas, and concepts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-96 bg-muted/50 rounded-lg">
                            <div className="text-center space-y-3">
                                <Zap className="h-12 w-12 text-muted-foreground mx-auto" />
                                <p className="text-lg font-medium">Knowledge Graph Coming Soon</p>
                                <p className="text-sm text-muted-foreground">
                                    Interactive visualization of your knowledge connections
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export { KnowledgeGraphPage };