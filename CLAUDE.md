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

### CI/CD Monitoring

```bash
# Monitor GitHub Actions runs
pnpm ci:watch              # Auto-monitor current branch
pnpm ci:status             # Show recent runs
pnpm ci:latest             # View latest run details
```

## Project Architecture

### Monorepo Structure

This is a Turborepo monorepo with cross-platform Connect Four game:

```
Connect-Star/
├── apps/
│   ├── web/              # Next.js 14 web app
│   └── mobile/           # React Native + Expo mobile app
├── packages/
│   ├── game-logic/       # Connect Four game engine (25 tests)
│   ├── ui/               # Shared React components (29 tests)
│   ├── api-client/       # HTTP/WebSocket client (13 tests)
│   └── types/            # Shared TypeScript definitions
```

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
- **Code Quality**: ESLint + Prettier + Husky hooks

### Development Workflow

- **Package manager**: pnpm (required)
- **Git hooks**: Pre-commit formatting, pre-push testing
- **Quality gates**: 75%+ test coverage required
- **Testing strategy**: Unit tests (game-logic), component tests (ui), integration tests (api-client)

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

### Notes for Development

- Always run tests before committing: `pnpm test`
- Use `pnpm quality` to run all quality checks
- The monorepo uses workspace dependencies - changes to packages automatically affect apps
- All packages must maintain 75%+ test coverage
- Follow conventional commits for consistent commit messages
