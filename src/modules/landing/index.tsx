import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Database,
  Search,
  Share2,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Globe,
  BarChart3,
  FileText,
  Calendar,
  Tag,
  Filter,
  SortAsc,
  Eye,
  Plus,
  Layers,
  Grid,
  Table,
  Kanban,
} from "lucide-react";
import { getSignInLink, getSignUpLink } from "@/app/router/router-link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Second Brain
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to={getSignInLink()}>
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to={getSignUpLink()}>
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              🚀 Your Digital Knowledge Hub
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Build Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Second Brain
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Organize, connect, and discover your knowledge like never before.
              Create powerful databases, manage information, and build your
              personal knowledge management system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={getSignUpLink()}>
                <Button size="lg" className="w-full sm:w-auto">
                  Start Building Your Brain
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={getSignInLink()}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-lg shadow-2xl border p-8 max-w-4xl mx-auto">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-sm text-gray-500">
                  second-brain.app
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-left">
                <div className="flex items-center space-x-2 mb-4">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Project Tasks Database</span>
                  <Badge variant="outline" className="ml-auto">
                    24 records
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="font-medium text-gray-700">Task Name</div>
                  <div className="font-medium text-gray-700">Status</div>
                  <div className="font-medium text-gray-700">Priority</div>
                  <div className="font-medium text-gray-700">Due Date</div>

                  <div>Design landing page</div>
                  <Badge className="bg-blue-100 text-blue-800 w-fit">
                    In Progress
                  </Badge>
                  <Badge className="bg-red-100 text-red-800 w-fit">High</Badge>
                  <div className="text-gray-600">Dec 15</div>

                  <div>Setup database</div>
                  <Badge className="bg-green-100 text-green-800 w-fit">
                    Completed
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 w-fit">
                    Medium
                  </Badge>
                  <div className="text-gray-600">Dec 10</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to organize your knowledge
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help you capture, organize, and
              connect your ideas seamlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Database Feature */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Powerful Databases</CardTitle>
                <CardDescription>
                  Create custom databases with rich property types, views, and
                  relationships.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Multiple property types (text, select, date, etc.)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Table, Kanban, Calendar views
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Advanced filtering and sorting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time collaboration
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Search Feature */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Smart Search</CardTitle>
                <CardDescription>
                  Find anything instantly with powerful search across all your
                  content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Full-text search across databases
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Property-specific filtering
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Saved search queries
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Quick access shortcuts
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Collaboration Feature */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Share databases and collaborate with your team in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Granular permission controls
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time updates
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Comment and mention system
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Activity tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Security Feature */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Your data is protected with enterprise-grade security
                  measures.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    SOC 2 compliance
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Regular security audits
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    GDPR compliant
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Performance Feature */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Optimized for speed with instant loading and real-time
                  updates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Sub-second search results
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Optimistic UI updates
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Efficient data caching
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Progressive loading
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Integration Feature */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Seamless Integration</CardTitle>
                <CardDescription>
                  Connect with your favorite tools and import data effortlessly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    CSV/Excel import/export
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    API access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Webhook support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Third-party integrations
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Database Features Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Database Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create and manage databases like a pro with our comprehensive set
              of tools and features.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Property Types */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Rich Property Types
              </h3>
              <p className="text-gray-600 mb-8">
                Support for 11+ property types to structure your data exactly
                how you need it.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Text</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Number</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <Tag className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Select</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <Calendar className="h-5 w-5 text-red-600" />
                  <span className="font-medium">Date</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Checkbox</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium">Person</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">URL</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <Plus className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">And more...</span>
                </div>
              </div>
            </div>

            {/* Multiple Views */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Multiple Views
              </h3>
              <p className="text-gray-600 mb-8">
                Visualize your data in different ways with our flexible view
                system.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Table className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Table View</h4>
                    <p className="text-sm text-gray-600">
                      Classic spreadsheet-like interface
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Kanban className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Kanban Board</h4>
                    <p className="text-sm text-gray-600">
                      Organize tasks by status or category
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Calendar View</h4>
                    <p className="text-sm text-gray-600">
                      Timeline and date-based visualization
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Grid className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Gallery View</h4>
                    <p className="text-sm text-gray-600">
                      Visual card-based layout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Advanced Database Operations
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Filter className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Advanced Filtering</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Create complex filters with multiple conditions, operators,
                    and property-specific rules.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <SortAsc className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Multi-level Sorting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Sort by multiple properties with custom priority and
                    direction for perfect data organization.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Property Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Show, hide, reorder, and customize properties dynamically to
                    focus on what matters.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfect for Every Use Case
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're managing projects, organizing research, or building
              a knowledge base, Second Brain adapts to your workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <span>Project Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Track tasks, deadlines, and team progress with customizable
                  project databases.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Task tracking and assignment</li>
                  <li>• Timeline and milestone management</li>
                  <li>• Team collaboration tools</li>
                  <li>• Progress reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Knowledge Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Build your personal or team knowledge base with interconnected
                  information.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Research organization</li>
                  <li>• Note-taking and linking</li>
                  <li>• Document management</li>
                  <li>• Knowledge discovery</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>Data Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Organize and analyze data with powerful filtering, sorting,
                  and visualization tools.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Data collection and storage</li>
                  <li>• Advanced filtering</li>
                  <li>• Custom views and reports</li>
                  <li>• Export and sharing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Second Brain?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who have transformed their knowledge
            management with Second Brain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={getSignUpLink()}>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to={getSignInLink()}>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-blue-100 text-sm mt-4">
            No credit card required • Free 14-day trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">Second Brain</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your digital knowledge hub for organizing, connecting, and
                discovering information.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <Share2 className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Databases
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Collaboration
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Second Brain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
