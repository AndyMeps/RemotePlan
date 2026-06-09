# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**RemotePlan** is a real-time collaborative planning application built with .NET 10 (ASP.NET Core) and React 18. It enables multiple users to join virtual "rooms" and participate in synchronous planning sessions with real-time vote synchronization via SignalR.

## Architecture

### Backend (.NET 10 ASP.NET Core)
- **SignalR Hubs** (`RemotePlan.Server/Hubs/PlanHub.cs`): Manages real-time connections, handles room operations (joining, voting, starting new hands)
- **Hall Monitor** (`HallMonitor.cs`): Tracks users across rooms, manages room state in-memory
- **Room Cleanup Service** (`RoomCleanupService.cs`): Hosted service that periodically cleans up idle/empty rooms
- **Endpoints** (`Endpoints/RoomEndpoints.cs`): RESTful endpoints for room management
- **Razor Pages**: Serves the SPA and handles error pages

### Frontend (React 18 + TypeScript)
- **Component Hierarchy**: Follows atomic design pattern
  - **Atoms** (`src/atoms/`): Primitive components (Button, Input, Card, etc.)
  - **Molecules** (`src/molecules/`): Composed components (PlayerCards, Actions, etc.)
  - **Views** (`src/Views/`): Full page views (Home, Room)
- **Routing**: React Router v6 with two main routes: `/` (home) and `/room/:roomId` (collaboration space)
- **SignalR Integration**: `useRoomSignalR` hook manages WebSocket connection to PlanHub
- **State Management**: React Context API for global state, local component state for UI
- **Styling**: styled-components with a centralized theme (dark mode colors defined in `src/App.tsx`)

### Build Pipeline
- **Frontend**: Webpack bundles TypeScript/React → `wwwroot/js/main.js`
- **Manifest**: HTML Webpack Plugin generates `wwwroot/index.html`
- **Backend**: ASP.NET Core serves frontend as static files + APIs + SignalR hub
- **GitHub Actions**: Builds frontend (npm), publishes backend (.NET), uploads artifact

## Development Commands

All npm commands run from `RemotePlan.Server/` directory.

### Frontend Development
```bash
cd RemotePlan.Server
npm ci                # Install dependencies (use in CI, reproducible)
npm install           # Install dependencies (development)
npm run build         # Single webpack build → wwwroot/
npm run watch         # Webpack watch mode (auto-rebuild on save)
```

### Backend Development
```bash
dotnet run                                    # Run server (hot-reload available)
dotnet build                                  # Compile
dotnet publish -c Release -o ./publish        # Production publish
```

### Combined Development Setup
1. In one terminal: `cd RemotePlan.Server && npm run watch`
2. In another terminal: `dotnet run`
3. Visit `https://localhost:5001` (or the port shown by `dotnet run`)

## Key Patterns & Conventions

### Frontend
- **Path Aliases**: Webpack is configured with aliases for cleaner imports:
  - `@atoms` → `src/atoms/`
  - `@molecules` → `src/molecules/`
  - `@views` → `src/Views/`
  - `@hooks` → `src/hooks/`
  - `@contexts` → `src/contexts/`
  
  Use these in imports: `import { Button } from '@atoms'`

- **SignalR Hook**: `useRoomSignalR(roomId, callbacks, deps)` handles connection lifecycle:
  - Establishes WebSocket to `/PlanHub`
  - Registers event listeners (PlayerJoined, PlayerVoted, AllVoted, etc.)
  - Returns connection object and utility methods (castVote, startNewHand, setInitials)
  - Check `src/hooks/useRoomSignalR.ts` for available methods and events

- **Theme & Styling**: styled-components with a DefaultTheme (dark colors, primary/danger/warn variants defined in App.tsx)

### Backend
- **Dependency Injection**: Program.cs wires up:
  - `IHallMonitor` (in-memory room tracker)
  - `RoomCleanupService` (auto-cleanup of idle rooms)
  - SignalR hub at `/PlanHub`
- **Logging**: Use `ILogger<T>` injected in constructors (see PlanHub, HallMonitor)
- **SignalR Group Broadcasting**: Rooms are SignalR groups; use `Clients.Group(roomId)` to broadcast to all players in a room

## TypeScript Configuration
- Strict mode enabled (`strict: true`, `noImplicitAny: true`)
- Target ES6, module ES6 with Node resolution
- JSX set to react (not react-jsx), JSX import not needed per-file

## CI/CD
GitHub Actions (`.github/workflows/build-deploy.yml`):
- On push to `main` or PR: builds frontend (npm), publishes backend (dotnet), uploads artifact
- On push to `main` only: deploys to production environment (steps incomplete; check workflow for full details)

## Common Tasks

### Adding a New Component
1. Create file in `src/atoms/` or `src/molecules/` or `src/Views/` depending on scope
2. Export from that folder's `index.ts` barrel file
3. Use path alias in imports: `import { Button } from '@atoms'`

### Adding SignalR Event Handling
1. Add callback function to your component or custom hook
2. Pass to `useRoomSignalR(roomId, { ...callbacks })` as part of the functions object
3. The hook will register/update the listener when called

### Debugging Real-time Issues
- Browser DevTools → Application → Local Storage: check stored `initials`
- Browser Console: logs from `useRoomSignalR` show connection state
- Network tab → WS: inspect SignalR WebSocket frames for message flow
- Server: check `dotnet run` console for `ILogger` debug output (`LogDebug` in code)

