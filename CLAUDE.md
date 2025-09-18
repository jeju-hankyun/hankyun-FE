# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application for "Hankyeon" - a comprehensive workation (work + vacation) management platform focused on Jeju Island operations. The application uses React 19 with modern tooling and Emotion CSS-in-JS for styling.

## Development Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

## Architecture

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite with @vitejs/plugin-react configured for Emotion
- **Styling**: Emotion CSS-in-JS with styled-components
- **Routing**: React Router DOM v7 with centralized routing
- **HTTP Client**: Axios for API communication
- **Linting**: ESLint with TypeScript integration and React plugins

## Application Structure

This is a feature-rich workation management platform with the following key areas:

### Core Features
- **Authentication System**: Google OAuth integration with JWT token management
- **Dashboard**: Central workation management dashboard with real-time features
- **Organization Management**: Multi-organization support with hierarchical structure
- **Workation Groups**: Group creation and management within organizations
- **Trip Management**: Trip planning and execution for workation groups
- **CVC (Competition) System**: Corporate vs corporate workation competitions
- **Office Management**: Jeju Island office space management and booking
- **User Management**: Worker and club member registration systems

### Authentication & API Layer

- **Auth Module** (`src/auth/`): Complete authentication system with Google OAuth
  - `api.ts` - Main authentication API functions and token management
  - `api/` directory - Modular API services organized by feature
  - Token-based authentication with automatic refresh handling
  - Navigation integration for auth flows

### Page Structure

The application uses a hierarchical page structure under `src/pages/`:

- **Core Management**: `organizations/`, `workcation-groups/`, `trips/`
- **User Features**: `user-profile/`, `worker-registration/`, `club-member-registration/`
- **Competition System**: `competition/`, `battle-results/`, `cvc/`
- **Operations**: `office-management/`, `plan-management/`, `overview/`

### Shared Resources

- `src/shared/globalStyles.ts` - Emotion styled-components for consistent UI
- `src/shared/types.ts` - TypeScript interfaces for global state and components
- Glassmorphism design system with dark theme and gradient backgrounds

## Key Dependencies

- **React 19** - Latest React with modern features
- **Emotion** - CSS-in-JS with babel plugin integration
- **React Router DOM v7** - Modern routing with nested routes
- **Axios** - HTTP client for API communication
- **Styled-components** - Additional CSS-in-JS utilities
- **TypeScript 5.8** - Type safety with modern features

## Development Configuration

### Vite Configuration
- Emotion integration with jsxImportSource and babel plugin
- React plugin with Emotion-specific settings

### ESLint Configuration
- Modern flat config format with TypeScript integration
- React hooks and refresh rules for development
- Browser globals configuration

### TypeScript Configuration
- Project references setup with separate app and node configurations
- Modern ES2020 target with strict type checking

## API Architecture

The API layer is organized into modular services:
- `auth.ts` - Authentication and token management
- `user.ts` - User profile and registration
- `organization.ts` - Organization management
- `workcationGroup.ts` - Workation group operations
- `trip.ts` - Trip planning and management
- `cvc.ts` - Competition system
- `interfaces.ts` - Shared TypeScript interfaces
- `base.ts` - Common API utilities

## Routing Structure

Centralized routing in `AuthRouter.tsx` with authenticated routes:
- Organization-based URLs: `/organizations/:id/workcation-groups`
- Nested resource routes: `/workcation-groups/:id/trips`
- Feature-specific routes: `/cvc/manage`, `/profile`, etc.
- Google OAuth callback handling

## Code Conventions

- **Component Files**: Use `.tsx` extension for React components
- **Styling**: Emotion styled-components with glassmorphism design patterns
- **API Calls**: Centralized in `src/auth/api/` with proper error handling
- **Type Safety**: Comprehensive TypeScript interfaces in shared types
- **State Management**: React hooks with global state interfaces