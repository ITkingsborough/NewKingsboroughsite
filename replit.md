# Kingsborough Church Website

## Overview

This is a full-stack web application for Kingsborough Church, built with a modern architecture using React frontend, Express.js backend, and PostgreSQL database. The application serves as both a public church website and a content management system (CMS) for church administrators.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom theme configuration
- **Component Library**: Radix UI components with shadcn/ui styling
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion and GSAP for smooth animations and scroll effects

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with middleware for authentication and file uploads
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (Neon serverless)
- **Authentication**: Passport.js with local strategy and session management
- **File Handling**: Multer for file uploads with organized directory structure

### Database Schema
The application uses PostgreSQL with the following main entities:
- **users**: Admin/editor accounts with role-based permissions
- **contact_messages**: Contact form submissions and prayer requests
- **newsletter_subscribers**: Email subscription management
- **sermons**: Sermon content with audio files and metadata
- **events**: Church events with banners and descriptions
- **gallery_items**: Photo gallery with tagging system
- **magazines**: Digital publications with PDF storage
- **members**: Church membership management
- **attendance**: Service attendance tracking
- **ministry_groups**: Ministry organization and member assignments

## Key Components

### Public Website Features
- **Homepage**: Hero section, welcome message, ministry highlights, upcoming events
- **About Page**: Church history, leadership profiles, mission and values
- **Ministries**: Information about different church ministries
- **Events**: Event listings with RSVP functionality
- **Sermons**: Sermon archive with audio playback and YouTube integration
- **Gallery**: Photo gallery with filtering by ministry groups
- **Giving**: Online donation forms and giving information
- **Contact**: Contact forms including prayer request submissions

### CMS Dashboard Features
- **Authentication System**: Role-based access (admin, editor, media_manager)
- **Content Management**: CRUD operations for sermons, events, gallery items
- **Magazine Publishing**: PDF upload and management system
- **Community Management**: Member directory, attendance tracking, ministry groups
- **Contact Management**: View and manage contact form submissions
- **File Upload System**: Organized file storage for images, audio, and documents

### UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: GSAP and Framer Motion for professional animations
- **Parallax Effects**: Scroll-triggered animations and parallax backgrounds
- **Cookie Consent**: GDPR-compliant cookie management
- **Scroll to Top**: Smooth scrolling navigation
- **Page Transitions**: Smooth transitions between routes

## Data Flow

### Frontend to Backend Communication
- API requests handled through TanStack Query with automatic caching
- RESTful API endpoints for all CRUD operations
- File uploads processed through multipart/form-data
- Authentication state managed through HTTP sessions with cookies

### Database Operations
- Drizzle ORM provides type-safe database queries
- Connection pooling through Neon serverless PostgreSQL
- Database migrations managed through Drizzle Kit
- Enum types for consistent data validation

### File Management
- Organized directory structure: `/public/uploads/{category}/`
- Unique filename generation using UUID
- Support for images, audio files, and PDF documents
- Public URL generation for file access

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Accessible component primitives
- **framer-motion**: Animation library
- **gsap**: Professional animation library
- **passport**: Authentication middleware

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-shadcn-theme-json**: Theme configuration

### File Processing
- **multer**: File upload middleware
- **uuid**: Unique identifier generation
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- Runs on Node.js 20 with PostgreSQL 16
- Development server starts with `npm run dev`
- Hot module replacement through Vite
- Database provisioning through Replit environment

### Production Build
- Frontend built with Vite to static assets
- Backend bundled with esbuild for Node.js execution
- Assets served from `/dist/public/` directory
- Production server starts with `npm run start`

### Database Management
- Schema changes deployed through `npm run db:push`
- Database initialization scripts in `/scripts/` directory
- Default admin user creation for initial setup

### File Storage
- Local file system storage in `/public/uploads/`
- Organized by content type (gallery, sermons, events, magazines)
- Public URL access through Express static middleware

## Changelog

```
Changelog:
- June 17, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```