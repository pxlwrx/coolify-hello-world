# 📁 Project Structure Overview

This document provides a comprehensive overview of the Coolify Hello World project structure, explaining the purpose of each file and directory.

## 🌳 Directory Tree

```
coolify-hello-world/
├── 📄 README.md                     # Main project documentation
├── 📄 DEPLOYMENT.md                 # Coolify deployment guide
├── 📄 PROJECT_STRUCTURE.md          # This file - project structure overview
├── 📄 package.json                  # Node.js dependencies and scripts
├── 📄 package-lock.json             # Locked dependency versions
├── 📄 next.config.js                # Next.js configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 tailwind.config.ts            # Tailwind CSS configuration
├── 📄 postcss.config.js             # PostCSS configuration
├── 📄 .eslintrc.json                # ESLint rules and configuration
├── 📄 .gitignore                    # Git ignored files and directories
├── 📄 .dockerignore                 # Docker ignored files and directories
├── 📄 .env.example                  # Environment variables template
├── 📄 Dockerfile                    # Docker container build instructions
├── 📄 docker-compose.yml            # Production Docker Compose (for Coolify)
├── 📄 docker-compose.local.yml      # Local testing Docker Compose
├── 📄 coolify.yaml                  # Coolify deployment configuration
├── 📄 healthcheck.sh                # Container health check script
├── 📄 next-env.d.ts                 # Next.js TypeScript declarations
├── 📁 public/                       # Static assets served by Next.js
│   └── 📄 README.md                # Public assets documentation
└── 📁 src/                         # Source code directory
    ├── 📁 app/                     # Next.js App Router directory
    │   ├── 📄 globals.css          # Global styles with terminal theme
    │   ├── 📄 layout.tsx           # Root layout component
    │   ├── 📄 page.tsx             # Home page component
    │   └── 📁 api/                 # API routes directory
    │       └── 📁 system/          # System info API endpoint
    │           └── 📄 route.ts     # System information API handler
    ├── 📁 components/              # Reusable React components
    │   ├── 📄 TerminalHeader.tsx   # Terminal window header component
    │   └── 📄 SystemInfoDisplay.tsx # Main system info display component
    ├── 📁 lib/                     # Utility libraries and configurations
    │   ├── 📄 react-query.tsx      # React Query provider setup
    │   └── 📄 utils.ts             # Utility functions and helpers
    └── 📁 types/                   # TypeScript type definitions
        └── 📄 system.ts            # System information type interfaces
```

## 📋 File and Directory Descriptions

### Root Level Files

#### Configuration Files
- **`package.json`** - Node.js project configuration, dependencies, and scripts
- **`tsconfig.json`** - TypeScript compiler configuration with strict mode
- **`next.config.js`** - Next.js framework configuration for standalone builds
- **`tailwind.config.ts`** - Tailwind CSS configuration with custom terminal theme
- **`postcss.config.js`** - PostCSS configuration for CSS processing
- **`.eslintrc.json`** - ESLint rules enforcing code quality and Next.js best practices

#### Docker and Deployment
- **`Dockerfile`** - Multi-stage Docker build for Alpine Linux production container
- **`docker-compose.yml`** - Production Docker Compose configuration for Coolify
- **`docker-compose.local.yml`** - Local development Docker Compose for testing
- **`coolify.yaml`** - Comprehensive Coolify deployment configuration
- **`healthcheck.sh`** - Container health check script with retry logic

#### Environment and Ignore Files
- **`.env.example`** - Template for environment variables with detailed comments
- **`.gitignore`** - Git ignore patterns for Node.js, Next.js, and Docker
- **`.dockerignore`** - Docker ignore patterns to optimize build context

#### Documentation
- **`README.md`** - Main project documentation with setup and usage instructions
- **`DEPLOYMENT.md`** - Comprehensive Coolify deployment guide
- **`PROJECT_STRUCTURE.md`** - This file explaining project organization

### Source Code Structure (`src/`)

#### App Directory (`src/app/`)
Following Next.js 14 App Router conventions:

- **`layout.tsx`** - Root layout with HTML structure, metadata, and providers
- **`page.tsx`** - Home page with terminal interface and system info display
- **`globals.css`** - Global CSS with terminal theme and custom animations
- **`api/system/route.ts`** - API route handler for system information endpoint

#### Components (`src/components/`)
Reusable React components following atomic design principles:

- **`TerminalHeader.tsx`** - Terminal window header with macOS-style buttons
- **`SystemInfoDisplay.tsx`** - Main component displaying system information in terminal style

#### Libraries (`src/lib/`)
Utility libraries and configuration:

- **`react-query.tsx`** - React Query client provider with optimized settings
- **`utils.ts`** - Utility functions for data formatting, calculations, and display

#### Types (`src/types/`)
TypeScript type definitions:

- **`system.ts`** - Comprehensive interfaces for system information data structures

### Public Assets (`public/`)

Static assets served directly by Next.js:
- **`README.md`** - Documentation for public assets directory

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom terminal theme
- **Data Fetching**: TanStack React Query for server state management
- **API**: Next.js API Routes with Node.js system information
- **Containerization**: Docker with Alpine Linux base image
- **Deployment**: Coolify with Docker Compose

### Design Patterns
- **Component Architecture**: Functional components with TypeScript interfaces
- **State Management**: React Query for server state, React hooks for local state
- **Error Handling**: Comprehensive error boundaries and API error responses
- **Security**: Non-root container execution, minimal privileges, input validation

### Data Flow
1. **Client** → React components request system data
2. **React Query** → Manages caching and background refetching
3. **API Route** → `/api/system` endpoint gathers system information
4. **Node.js OS APIs** → Collect system metrics and information
5. **Response** → JSON data formatted for terminal display

## 🔧 Development Workflow

### Local Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
```

### Docker Development
```bash
# Local testing
docker-compose -f docker-compose.local.yml up -d

# Production build
docker build -t coolify-hello-world .
docker run -p 3000:3000 coolify-hello-world
```

### Code Quality
- **TypeScript**: Strict mode enabled with explicit types
- **ESLint**: Custom rules for Next.js and React best practices
- **Prettier**: (Can be added) Code formatting
- **Accessibility**: WCAG compliance with semantic HTML

## 📦 Build Process

### Development Build
1. TypeScript compilation
2. Next.js optimization
3. CSS processing with Tailwind
4. Hot reloading for development

### Production Build
1. **Builder Stage**:
   - Install all dependencies
   - TypeScript compilation
   - Next.js standalone build
   - CSS optimization and purging

2. **Runtime Stage**:
   - Alpine Linux base image
   - Copy built application
   - Non-root user setup
   - Health check configuration

## 🌐 API Structure

### Endpoints
- **`GET /api/system`** - System information endpoint
  - Returns: System specs, memory usage, CPU info, network interfaces
  - Headers: No-cache directives for real-time data
  - Error handling: Structured error responses

### Data Models
- **SystemInfo**: Basic system information
- **MemoryInfo**: Memory usage statistics
- **CpuInfo**: Processor information
- **NetworkInterface**: Network configuration
- **ContainerInfo**: Container runtime detection

## 🎨 Styling Architecture

### Theme System
- **Terminal Colors**: Green, amber, blue, red, cyan color palette
- **Typography**: JetBrains Mono for authentic terminal feel
- **Animations**: Cursor blinking, scanning effects, loading states
- **Responsive**: Mobile-first design with terminal aesthetics

### CSS Organization
- **Base Layer**: Global resets and typography
- **Components Layer**: Reusable component styles
- **Utilities Layer**: Custom utility classes for terminal effects

## 🚀 Deployment Architecture

### Container Specifications
- **Base Image**: `node:18-alpine` for security and size optimization
- **User**: Non-root execution (nextjs:1001)
- **Ports**: Single port 3000 exposure
- **Health Checks**: Built-in endpoint monitoring
- **Security**: Dropped capabilities, no new privileges

### Coolify Integration
- **Docker Compose**: Primary deployment method
- **Environment Variables**: Comprehensive configuration options
- **Domain Management**: SSL/TLS with automatic certificates
- **Monitoring**: Health checks and log aggregation

This structure provides a scalable foundation for a production-ready system monitoring application while maintaining simplicity and ease of deployment with Coolify.