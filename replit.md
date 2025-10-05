# YouTube Channel Analyzer

## Overview

YouTube Channel Analyzer is a full-stack web application that provides AI-powered analytics for YouTube channels. Users input a YouTube channel URL, and the application resolves the channel ID, fetches channel data via the YouTube Data API, sends it to an n8n webhook for AI analysis, and displays comprehensive insights including revenue estimates, engagement metrics, risk analysis, and growth predictions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing

**UI Framework**
- Tailwind CSS for utility-first styling with custom design tokens
- Shadcn/ui component library built on Radix UI primitives
- Custom design system inspired by Linear's clean aesthetics and Vercel's dashboard patterns
- Dark mode by default with light mode support via ThemeProvider context

**State Management**
- TanStack Query (React Query) for server state management, caching, and data fetching
- React Context API for theme state (dark/light mode)
- Local component state with React hooks for form inputs and UI interactions

**Data Visualization**
- Chart.js with react-chartjs-2 wrapper for subscriber growth charts
- Custom MetricCard components for displaying analytics data

**Design Principles**
- Progressive disclosure: Simple input form → Complex analytics dashboard
- Data clarity: Metrics designed for instant scannability
- Responsive design: Mobile-first approach with breakpoints for tablet/desktop

### Backend Architecture

**Server Framework**
- Node.js with Express for REST API endpoints
- TypeScript for type safety across the full stack
- ESM module system for modern JavaScript features

**API Design**
- `/api/analyze` endpoint that orchestrates the analysis workflow:
  1. Accepts YouTube channel URL
  2. Resolves channel ID using multiple strategies (direct ID, @handle, username)
  3. Fetches channel metadata from YouTube Data API
  4. Retrieves recent videos and top-performing videos
  5. Forwards request to n8n webhook for AI analysis
  6. Stores analysis results in database
  7. Returns combined data to frontend

**YouTube Integration Strategy**
- Direct channel ID extraction from URLs
- Handle resolution via YouTube Data API v3 (`forHandle` parameter)
- Username resolution via YouTube Data API v3 (`forUsername` parameter)
- Parallel fetching of channel info, recent videos, and top videos for performance

**Middleware & Error Handling**
- Custom logging middleware for API request/response tracking
- Global error handler with status code and message extraction
- Request body parsing with express.json() and urlencoded()

### Data Storage Solutions

**Database**
- PostgreSQL as the primary relational database
- Neon serverless PostgreSQL for cloud hosting
- Drizzle ORM for type-safe database queries and migrations

**Schema Design**
- `users` table: User authentication (id, username, password)
- `channel_analyses` table: Stores analysis results with channel metadata, revenue metrics, engagement data, risk levels, subscriber growth, and AI insights
- `videos` table: Stores individual video data linked to channel analyses

**Data Persistence Strategy**
- Analysis results cached in database to avoid redundant API calls
- Timestamp tracking (createdAt) enables historical analysis comparison
- JSONB fields for flexible storage of chart data (subscriber_chart_data, subscriber_chart_labels)

**Repository Pattern**
- DatabaseStorage class implements IStorage interface for abstraction
- Separate storage methods for users, channel analyses, and videos
- Supports future storage backend swaps without changing business logic

### External Dependencies

**YouTube Data API v3**
- Purpose: Fetch channel metadata, subscriber counts, video lists, and statistics
- API Key authentication stored in VITE_YT_API_KEY environment variable
- Endpoints used:
  - `/channels?part=id&forHandle={handle}` for @username resolution
  - `/channels?part=id&forUsername={username}` for legacy username resolution
  - `/channels?part=snippet,statistics` for channel info
  - `/search?part=id&channelId={id}` for video discovery
  - `/videos?part=snippet,statistics` for video details

**n8n Webhook Integration**
- Purpose: AI-powered channel analysis and insights generation
- Webhook URL: `https://n8n.obtv.io/webhook-test/analyze-channel`
- Request payload: `{ "channelId": "UCxxxxx" }`
- Response contains AI-generated insights, revenue estimates, and recommendations
- Backend acts as proxy to handle CORS restrictions

**Database Connection**
- Neon Serverless PostgreSQL via @neondatabase/serverless driver
- Connection string stored in DATABASE_URL environment variable
- Serverless architecture enables automatic scaling and connection pooling

**Build & Development Tools**
- Vite plugins for development:
  - @replit/vite-plugin-runtime-error-modal for error overlays
  - @replit/vite-plugin-cartographer for code navigation (Replit-specific)
  - @replit/vite-plugin-dev-banner for development indicators
- ESBuild for production server bundling
- TypeScript compiler for type checking (noEmit mode)

**UI Component Dependencies**
- Radix UI primitives for accessible, unstyled components
- Lucide React for consistent iconography
- class-variance-authority for variant-based component styling
- react-hook-form with @hookform/resolvers for form validation
- date-fns for date formatting and manipulation