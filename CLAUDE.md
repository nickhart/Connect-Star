# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development

```bash
# Start all development servers
pnpm dev

# Start specific applications
pnpm web                    # Web app only
pnpm mobile                 # Mobile app only
pnpm dev --filter=@connect-star/web
pnpm dev --filter=@connect-star/mobile

# Build all packages and apps
pnpm build

# Build specific applications
pnpm web:build
pnpm mobile:build

# Update Simple Game Server client dependency
pnpm update-client          # Rebuilds and updates ../simple-game-server client

# Get development authentication token
pnpm dev-token              # Gets JWT token for API testing
```

### Testing

```bash
# Run all tests across packages
pnpm test

# Run tests with coverage (75%+ required)
pnpm test:coverage

# Run tests in CI mode
pnpm test:ci

# Run tests for specific packages
pnpm test --filter=game-logic
pnpm test --filter=ui
pnpm test --filter=api-client
pnpm web:test
pnpm mobile:test

# Run tests in watch mode
pnpm test --filter=game-logic -- --watch
```

### Code Quality

```bash
# Run all quality checks (lint + type-check + test)
pnpm quality

# Auto-fix formatting and linting
pnpm quality:fix

# Individual quality commands
pnpm lint                   # ESLint across all packages
pnpm type-check            # TypeScript validation
pnpm format                # Prettier formatting
pnpm clean                 # Remove build artifacts
```

### Pre-flight Checks (Manual)

```bash
# Comprehensive pre-flight check (recommended before commit/push)
pnpm preflight              # Interactive check with formatting options

# Quick test runner with coverage
pnpm test:quick             # Run tests and show coverage

# Auto-fix formatting and linting issues
pnpm fix                    # Format code and fix linting issues
```

### CI/CD Monitoring

```bash
# Monitor GitHub Actions runs
pnpm ci:watch              # Auto-monitor current branch
pnpm ci:status             # Show recent runs
pnpm ci:latest             # View latest run details
```

## Project Architecture

### Monorepo Structure

This is a Turborepo monorepo with multi-mode Connect Four game supporting local and online multiplayer:

```
Connect-Star/
├── apps/
│   ├── web/              # Next.js 14 web app (port 3001)
│   └── mobile/           # React Native + Expo mobile app
├── packages/
│   ├── game-logic/       # Connect Four game engine (25 tests)
│   ├── ui/               # Shared React components (29 tests)
│   ├── api-client/       # HTTP/WebSocket client (13 tests)
│   ├── types/            # Shared TypeScript definitions
│   └── store/            # Shared state management (Zustand) - planned
```

### Game Modes

- **Local Play**: Two players alternating on same device (current implementation)
- **Online Multiplayer**: Real-time play via WebSocket against remote opponents
- **Single Player vs AI**: Future ML-powered computer opponent (planned)

### External Dependencies

- **Rails Game Server**: http://localhost:3000 (simple-game-server API)
- **Database**: User accounts, game rooms, and match history
- **WebSocket**: Real-time game updates and player events

### Development Test Accounts

The following test accounts are available for development and testing:

**Player1:**
- Email: `player1@example.com`
- Password: `password123`

**Player2:**
- Email: `player2@example.com`  
- Password: `password123`

**Admin:**
- Email: `admin@example.com`
- Password: `password123`

Use `pnpm dev-token` to generate JWT tokens for API testing with these accounts.

### Key Architectural Patterns

#### Game Logic (`packages/game-logic/src/`)

- **Pure functions** - All game logic is stateless and predictable
- **Immutable state** - Functions return new state objects
- **Core functions**: `createEmptyBoard()`, `makeMove()`, `checkWinner()`, `isValidMove()`
- **Board representation**: 6x7 matrix with Player unions ('red' | 'yellow')

#### UI Components (`packages/ui/src/`)

- **Compound components** - GameBoard manages column/cell interactions
- **Accessibility-first** - ARIA labels, keyboard navigation, screen reader support
- **CSS animations** - Smooth piece-dropping animations in GameBoard.css
- **Main components**: `GameBoard`, `Button`, `PlayerIndicator`

#### API Client (`packages/api-client/src/`)

- **Class-based client** - `ConnectStarApiClient` with HTTP/WebSocket methods
- **Event-driven** - WebSocket listeners for real-time game updates
- **Promise-based** - Modern async/await patterns
- **Methods**: `createRoom()`, `joinRoom()`, `makeMove()`, `getRoom()`

#### Type System (`packages/types/src/`)

- **Strict typing** - No `any` types, complete type coverage
- **Core types**: `Player`, `Board`, `GameState`, `GameRoom`, `ApiResponse<T>`
- **Union types** - Constrained string literals for game states

### Technology Stack

- **Build System**: Turborepo with caching
- **Language**: TypeScript 5.2+ (strict mode)
- **Web**: Next.js 14 (App Router) + Tailwind CSS
- **Mobile**: React Native + Expo 53
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier + GitHub Actions

### Development Workflow

- **Package manager**: pnpm (required)
- **Quality gates**: GitHub Actions for PR validation, 75%+ test coverage required
- **Manual pre-flight**: Use `pnpm preflight` before committing for local validation
- **Testing strategy**: Unit tests (game-logic), component tests (ui), integration tests (api-client)
- **CI/CD**: Automated quality checks on PRs, coverage reporting, build validation

### Common Patterns

- **Dependency flow**: Apps depend on all packages; packages depend on types
- **Error handling**: Graceful degradation with proper error boundaries
- **State management**: React useState (could benefit from Redux/Zustand for complex state)
- **Code sharing**: Game logic shared between web and mobile platforms
- **Testing**: Comprehensive test coverage with quality gates

### Key Files to Understand

- `packages/game-logic/src/index.ts` - Core game engine implementation
- `packages/ui/src/components/GameBoard.tsx` - Main interactive game component
- `packages/types/src/index.ts` - Shared type definitions
- `apps/web/src/app/page.tsx` - Next.js main game page
- `apps/mobile/src/screens/GameScreen.tsx` - React Native game screen

## Multiplayer Implementation Plan

### Phase 1: Game Mode Foundation

- Add game mode selection to main menu (`local` | `multiplayer` | `ai`)
- Enhance GameBoard component to accept mode parameter
- Keep existing local play completely unchanged for testing
- Add optional authentication layer

### Phase 2: Authentication & User Management

- Extend API client for auth methods (login, register, logout, profile)
- Create shared auth store with Zustand
- Build login/register components
- Add user profile and statistics

### Phase 3: Online Multiplayer

- Implement game lobby with active game listing (newest first)
- Add create/join game functionality
- Real-time gameplay via WebSocket with polling fallback
- Connection management and error handling

### Phase 4: Enhanced Features

- User statistics and game history
- About screen and navigation improvements
- Connection status indicators
- Prepare architecture for future AI integration

### Development Strategy

- **Preserve local play**: Current single-player mode unchanged
- **Progressive enhancement**: Multiplayer as additional mode
- **Shared components**: Reuse UI between game modes
- **Future-ready**: Architecture supports AI opponent addition

### Notes for Development

- Use `pnpm preflight` before committing to catch issues early
- GitHub Actions will run quality checks on PRs automatically
- The monorepo uses workspace dependencies - changes to packages automatically affect apps
- All packages must maintain 75%+ test coverage
- Follow conventional commits for consistent commit messages
- Rails game server must be running on localhost:3000 for multiplayer features

### Recommended Development Workflow

1. **Start development**: `pnpm dev` (or specific app with `pnpm web`, `pnpm mobile`)
2. **Before committing**: `pnpm preflight` - comprehensive check with interactive fixes
3. **Quick fixes**: `pnpm fix` - auto-format and lint
4. **Test focus**: `pnpm test:quick` - run tests with coverage
5. **Create PR**: GitHub Actions will validate quality gates automatically
6. **Merge**: Quality gates must pass before merging
