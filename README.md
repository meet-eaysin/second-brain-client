# Second Brain Client

<div align="center">

**A Modern React Frontend for Personal Knowledge Management**

A comprehensive, feature-rich React application built with TypeScript, Vite, and modern UI libraries. Provides an intuitive interface for managing personal knowledge, tasks, notes, databases, and productivity workflows.

[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.0-646CFF)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React_Query-5.81.5-FF4154)](https://tanstack.com/query)

[![GitHub stars](https://img.shields.io/github/stars/meet-eaysin/second-brain-client?style=social)](https://github.com/meet-eaysin/second-brain-client/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/meet-eaysin/second-brain-client?style=social)](https://github.com/meet-eaysin/second-brain-client/network/members)
[![GitHub issues](https://img.shields.io/github/issues/meet-eaysin/second-brain-client)](https://github.com/meet-eaysin/second-brain-client/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/meet-eaysin/second-brain-client)](https://github.com/meet-eaysin/second-brain-client/pulls)

</div>

## Overview

The Second Brain Client is a modern, responsive React application that serves as the frontend interface for a comprehensive personal knowledge management system. Built with performance and user experience in mind, it provides an intuitive way to manage databases, tasks, notes, calendars, and various productivity tools.

### Key Features

- **Modern UI/UX**: Built with Radix UI components and Tailwind CSS for a polished, accessible interface
- **Database Management**: Notion-like database system with custom properties and views
- **Task Management**: Complete task tracking with priorities, assignees, and time management
- **Rich Text Editing**: Advanced note-taking with TipTap editor and rich formatting
- **CalendarTypes Integration**: Full calendar functionality with external service integration
- **Advanced Search**: Global search across all content with fuzzy matching
- **AI Assistant**: Integrated AI features for content generation and assistance
- **Real-time Updates**: WebSocket-based real-time notifications and updates
- **Responsive Design**: Mobile-first design that works across all devices
- **Dark/Light Themes**: Complete theme system with user preferences
- **Offline Support**: Progressive Web App capabilities

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [Yarn](https://yarnpkg.com/) (v4.9.2 or higher) - Package manager
- [Second Brain Server](https://github.com/meet-eaysin/second-brain-server) - Backend API

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/meet-eaysin/second-brain-client.git
cd second-brain-client
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Optional: Additional configuration
VITE_APP_NAME=Second Brain
VITE_APP_VERSION=1.0.0
```

### 4. Start the development server

```bash
yarn dev
```

The application will be available at `http://localhost:5173`.

## Development Scripts

### Core Development Commands

```bash
# Development Server
yarn dev                  # Start development server with hot reload

# Building & Compilation
yarn build               # Build for production
yarn preview             # Preview production build locally

# Code Quality & Testing
yarn lint                # Run ESLint
yarn test                # Run tests with Vitest
yarn test:ui             # Run tests with UI
yarn test:run            # Run tests once
yarn test:coverage       # Run tests with coverage report
yarn test:watch          # Run tests in watch mode
yarn test:ci             # Run tests for CI/CD

# Bundle Analysis
yarn analyze             # Analyze bundle size
yarn build:analyze       # Build and analyze bundle
```

## Project Architecture

### Core Technologies

- **Framework**: React 19.1.0 with TypeScript 5.8.3
- **Build Tool**: Vite 7.0.0 for fast development and optimized builds
- **Styling**: Tailwind CSS 4.1.11 with custom design system
- **State Management**: Zustand for global state, Jotai for atomic state
- **Data Fetching**: TanStack Query (React Query) 5.81.5 for server state
- **Routing**: React Router DOM 7.6.3 with code splitting
- **UI Components**: Radix UI primitives with custom components
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **CalendarTypes**: React Big CalendarTypes for calendar functionality
- **Rich Text**: TipTap editor with extensions
- **Icons**: Lucide React and Tabler Icons
- **Testing**: Vitest with React Testing Library
- **Drag & Drop**: @dnd-kit for advanced drag and drop

### Directory Structure

```
src/
├── app/                    # Application core
│   ├── config.ts          # Application configuration
│   ├── main.tsx           # Application entry point
│   ├── App.tsx            # Main App component
│   ├── index.css          # Global styles
│   ├── providers/         # React context providers
│   │   ├── auth-providers.tsx
│   │   ├── error-boundary.tsx
│   │   ├── index.tsx
│   │   ├── query-provider.tsx
│   │   └── theme-context.tsx
│   ├── router/            # Routing configuration
│   │   ├── index.tsx
│   │   ├── lazy-components/
│   │   └── router-link.ts
│   └── vite-env.d.ts
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Radix-based)
│   ├── command-menu.tsx  # Global command palette
│   ├── confirm-dialog.tsx
│   ├── enhanced-header.tsx
│   ├── error-boundary.tsx
│   ├── error-fallback.tsx
│   ├── header.tsx
│   ├── loading-spinner.tsx
│   ├── no-data-message.tsx
│   ├── not-found.tsx
│   ├── password-input.tsx
│   ├── profile-dropdown.tsx
│   ├── search.tsx
│   ├── select-dropdown.tsx
│   ├── sidebar.tsx
│   ├── skip-to-main.tsx
│   ├── theme-switch.tsx
│   └── data-table/       # Data table components
├── constants/            # Application constants
│   ├── api-endpoints.ts
│   └── query-keys.ts
├── context/              # React contexts
│   ├── font-context.tsx
│   ├── search-context.tsx
│   └── theme-context.tsx
├── hooks/                # Custom React hooks
│   ├── use-mobile.ts
│   ├── useLocalStorage.ts
│   └── usePageHeader.tsx
├── lib/                  # Utility libraries
│   ├── api.ts           # API client configuration
│   └── utils.ts         # General utilities
├── modules/             # Feature modules
│   ├── ai-assistant/    # AI assistant functionality
│   ├── auth/           # Authentication system
│   ├── books/          # Book management
│   ├── calendar/       # CalendarTypes integration
│   ├── categories/     # Content categorization
│   ├── core/           # Core types and utilities
│   ├── dashboard/      # Dashboard views
│   ├── data-table/     # Data table management
│   ├── database/       # Database system
│   ├── database-view/  # Database view components
│   ├── files/          # File management
│   ├── finances/       # Financial tracking
│   ├── home/           # Home page
│   ├── journal/        # Journaling system
│   ├── my-day/         # Daily planning
│   ├── notes/          # Note-taking system
│   ├── notifications/  # Notification system
│   ├── para/           # PARA method implementation
│   ├── people/         # Contact management
│   ├── projects/       # Project management
│   ├── search/         # Global search
│   ├── second-brain/   # Second Brain core features
│   ├── second-brain-dashboard/
│   ├── settings/       # User settings
│   ├── tags/           # Tag management
│   ├── tasks/          # Task management
│   ├── templates/      # Template system
│   ├── users/          # User management
│   └── workspaces/     # Workspace management
├── services/           # External service integrations
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Component Architecture

The application follows a modular component architecture:

- **UI Components**: Reusable, accessible components built on Radix UI primitives
- **Feature Modules**: Self-contained modules with their own components, hooks, and logic
- **Layout Components**: Consistent layout patterns for different page types
- **Form Components**: Standardized form handling with validation
- **Data Components**: Components for displaying and managing data

## Key Features & Modules

### Authentication System
- Email/password authentication
- Google OAuth integration
- JWT token management
- Protected and public routes
- User registration and login flows

### Database Management
- Notion-like database creation and management
- Custom property types (text, number, select, date, etc.)
- Multiple view types (table, board, list, calendar, gallery)
- Advanced filtering and sorting
- Real-time collaboration

### Task Management
- Comprehensive task tracking
- Priority levels and status management
- Time tracking and estimation
- Assignee management
- Checklist support
- Project integration

### Rich Text Editor
- TipTap-based rich text editing
- Code syntax highlighting
- Table support
- Image and file embedding
- Collaborative editing capabilities

### CalendarTypes Integration
- Full calendar functionality
- External calendar service integration
- Event management and scheduling
- Time blocking and reminders

### Search & Discovery
- Global search across all content
- Fuzzy matching and filters
- Recent searches and suggestions
- Advanced query capabilities

### AI Assistant
- Content generation and suggestions
- Smart categorization and tagging
- Writing assistance and proofreading

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` |
| `VITE_APP_NAME` | Application name | `Second Brain` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

### Build Configuration

The application is configured for optimal performance:

- **Code Splitting**: Automatic route-based code splitting
- **Bundle Optimization**: Vendor chunking and tree shaking
- **Asset Optimization**: Image optimization and font loading
- **PWA Support**: Service worker and manifest configuration

## Development Workflow

### Setting Up Development Environment

1. **Prerequisites**: Node.js 18+, Yarn 4+
2. **Clone Repository**: `git clone <repository-url>`
3. **Install Dependencies**: `yarn install`
4. **Environment Setup**: Copy `.env.example` to `.env`
5. **Start Backend**: Ensure Second Brain Server is running
6. **Start Development**: `yarn dev`

### Code Quality Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Comprehensive linting rules
- **Prettier**: Consistent code formatting
- **Testing**: Unit and integration tests required
- **Accessibility**: WCAG 2.1 AA compliance

### Testing Strategy

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration and user flow testing
- **E2E Tests**: Critical user journey testing
- **Visual Testing**: Component visual regression testing

## Deployment

### Build for Production

```bash
# Build the application
yarn build

# Preview the build
yarn preview
```

### Deployment Options

- **Vercel**: Optimized for Vercel deployment
- **Netlify**: Static hosting with functions
- **Docker**: Containerized deployment
- **Static Hosting**: Deploy to any static host

### Environment Configuration

For production deployment, set the following environment variables:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
VITE_APP_NAME=Your App Name
VITE_APP_VERSION=1.0.0
```

## Contributing

We welcome contributions to improve the Second Brain Client! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/second-brain-client.git`
3. Install dependencies: `yarn install`
4. Set up environment: `cp .env.example .env`
5. Start development: `yarn dev`
6. Run tests: `yarn test`
7. Create a feature branch and make changes
8. Submit a pull request

### Development Guidelines

- Follow the existing code style and patterns
- Write tests for new features
- Update documentation as needed
- Ensure accessibility compliance
- Test across different browsers and devices

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

The application is optimized for performance:

- **Bundle Size**: Code splitting and lazy loading
- **Image Optimization**: Automatic image optimization
- **Caching**: Intelligent caching strategies
- **PWA**: Offline functionality and fast loading

## Security

- **Content Security Policy**: Strict CSP headers
- **XSS Protection**: Input sanitization and validation
- **CSRF Protection**: Token-based protection
- **Secure Headers**: Security headers configuration

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [API Docs](https://your-api-domain.com/docs) (when backend is running)
- **Issues**: [GitHub Issues](https://github.com/meet-eaysin/second-brain-client/issues)
- **Discussions**: [GitHub Discussions](https://github.com/meet-eaysin/second-brain-client/discussions)
- **Email**: [eaysin.dev@gmail.com](mailto:eaysin.dev@gmail.com)

## Acknowledgments

Built with ❤️ by [Eaysin Arafat](https://github.com/meet-eaysin)

*"Transforming how we capture, organize, and leverage personal knowledge"*

---

<div align="center">

**🌟 Star this repo if you find it useful! 🌟**

**Happy Building! 🚀🧠✨**

</div>
