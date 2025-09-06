# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application using React 19 with a minimal setup for modern web development.

## Development Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

## Architecture

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite with @vitejs/plugin-react
- **Linting**: ESLint with TypeScript integration
- **Entry Point**: `src/main.tsx` renders the root App component
- **Main Component**: `src/App.tsx` imports and renders WorkationDashboard
- **Primary Component**: `src/WorkationDashboard.tsx` - A comprehensive dashboard component for workation management with real-time features

## Application Features

This is a "Workation" (work + vacation) management dashboard that provides:

- **Real-time Progress Tracking**: Live progress updates with simulated real-time data
- **Team Management**: User check-in/check-out tracking and capacity monitoring
- **Office Management**: Jeju Island office locations with availability and booking status
- **Competition System**: Corporate vs corporate workation competition tracking
- **Event Timeline**: Real-time activity feed and notifications
- **Responsive Design**: Mobile-friendly dashboard with modern glassmorphism UI

## Project Structure

- `src/` - Source code directory
  - `main.tsx` - Application entry point with StrictMode
  - `App.tsx` - Simple wrapper component that renders WorkationDashboard
  - `WorkationDashboard.tsx` - Main dashboard component (780+ lines with embedded CSS-in-JS)
  - `App.css` & `index.css` - Global styling
  - `assets/` - Static assets (images, etc.)
  - `vite-env.d.ts` - Vite environment type definitions
- `public/` - Public static assets served directly
- TypeScript configuration split across multiple files:
  - `tsconfig.json` - Base configuration with project references
  - `tsconfig.app.json` - Application-specific settings
  - `tsconfig.node.json` - Node.js specific settings

## Code Architecture Notes

- **Single File Component**: The main functionality is contained within `WorkationDashboard.tsx` using inline styles and CSS-in-JS
- **State Management**: Uses React hooks (useState, useEffect) for local state management
- **Styling Approach**: Combination of inline styles and CSS-in-JS embedded in the component
- **Component Structure**: Functional components with modern React 19 patterns
- **Data Simulation**: Mock data and simulated real-time updates using setInterval

## Key Dependencies

- **React 19** - Latest React version with modern features
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety and modern JavaScript features
- **ESLint** - Code linting with React hooks and refresh plugins

## ESLint Configuration

Uses modern flat config format with:
- TypeScript ESLint integration
- React hooks rules
- React refresh for Vite
- Browser globals configuration