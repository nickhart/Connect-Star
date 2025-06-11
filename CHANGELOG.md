# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation (README, contributing guide, testing guide)
- Architecture Decision Records (ADRs) for key technical decisions
- Deployment guide with CI/CD pipeline documentation

## [0.2.0] - 2025-01-10

### Added
- Comprehensive testing infrastructure with Jest and React Testing Library
- 67 tests across all packages (game-logic: 25, ui: 29, api-client: 13, apps: 2)
- Coverage reporting with package-specific thresholds
- Parallel test execution via Turborepo
- Test configurations for all packages
- Jest setup files with proper mocking for React Native and DOM environments

### Changed
- Updated TypeScript configurations to exclude test files from builds
- Enhanced Turborepo configuration for test task orchestration
- Improved package.json scripts for testing workflows

### Technical Details
- **game-logic**: Unit tests for board state, move validation, win detection
- **ui**: Component tests for Button, GameBoard, PlayerIndicator with accessibility testing
- **api-client**: Integration tests for HTTP client, WebSocket connections, event handling
- **mobile/web**: Smoke tests for basic application functionality

## [0.1.0] - 2025-01-09

### Added
- Initial monorepo structure with Turborepo
- Core packages: types, game-logic, ui, api-client
- Next.js 14 web application with App Router and Tailwind CSS
- React Native mobile application with Expo SDK 53
- Shared TypeScript type definitions
- Connect Four game logic implementation
- React UI components (Button, GameBoard, PlayerIndicator)
- HTTP and WebSocket API client
- ESLint and Prettier configuration across all packages
- Development and build scripts

### Technical Infrastructure
- **Turborepo**: Task orchestration and caching
- **TypeScript**: End-to-end type safety
- **pnpm**: Workspace package management
- **ESLint 9**: Code quality and consistency
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first styling

### Project Structure
```
Connect-Star/
├── apps/
│   ├── web/          # Next.js 14 web application
│   └── mobile/       # React Native with Expo
├── packages/
│   ├── types/        # Shared TypeScript definitions
│   ├── game-logic/   # Connect Four game engine
│   ├── ui/           # Shared React components
│   └── api-client/   # HTTP/WebSocket client
```

### Game Features
- Complete Connect Four game logic
- Board state management
- Move validation and execution
- Win condition detection (horizontal, vertical, diagonal)
- Cross-platform UI components
- Real-time multiplayer support (client-side)

[unreleased]: https://github.com/username/Connect-Star/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/username/Connect-Star/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/username/Connect-Star/releases/tag/v0.1.0