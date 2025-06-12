# Connect Star 🔴🟡

> A modern Connect Four game built with Turborepo, featuring cross-platform web and mobile applications with shared game logic.

## 📊 Project Status

![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.76+-20232A?logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-53+-000020?logo=expo&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-2.5+-EF4444?logo=turborepo&logoColor=white)

[![Tests](https://img.shields.io/badge/Tests-67%20passing-brightgreen)](docs/TESTING.md)
[![Coverage](https://img.shields.io/badge/Coverage-75%25-yellow)](#testing)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Code Style](https://img.shields.io/badge/Code%20Style-Prettier-ff69b4?logo=prettier)](https://prettier.io/)
[![Linting](https://img.shields.io/badge/Linting-ESLint-4B32C3?logo=eslint)](https://eslint.org/)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **pnpm** 10+ (package manager)
- **Expo CLI** (for mobile development)

### Installation

```bash
# Clone and install
git clone <repository-url>
cd Connect-Star
pnpm install
```

### Development

```bash
# Start all applications
pnpm dev

# Start specific applications
pnpm dev --filter=@connect-star/web      # Web app only
pnpm dev --filter=@connect-star/mobile   # Mobile app only
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test --filter=game-logic -- --watch
```

## 📁 Project Structure

```
Connect-Star/
├── apps/
│   ├── web/              # Next.js 14 web application
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── mobile/           # React Native with Expo
│       ├── src/
│       ├── assets/
│       └── package.json
├── packages/
│   ├── types/            # Shared TypeScript definitions
│   ├── game-logic/       # Connect Four game engine
│   │   ├── src/
│   │   └── __tests__/    # 25 unit tests
│   ├── ui/               # Shared React components
│   │   ├── src/
│   │   └── __tests__/    # 29 component tests
│   └── api-client/       # HTTP & WebSocket client
│       ├── src/
│       └── __tests__/    # 13 integration tests
├── docs/                 # Documentation
└── package.json          # Root workspace configuration
```

## 🧪 Testing

This project maintains high test coverage across all packages:

| Package      | Tests    | Coverage | Focus                                  |
| ------------ | -------- | -------- | -------------------------------------- |
| `game-logic` | 25 tests | 80%+     | Game rules, win detection, board state |
| `ui`         | 29 tests | 80%+     | Component rendering, user interactions |
| `api-client` | 13 tests | 75%+     | HTTP requests, WebSocket connections   |
| `mobile`     | 1 test   | Basic    | Smoke test                             |
| `web`        | 1 test   | Basic    | Smoke test                             |

**Total: 67 tests** - [View Testing Guide](docs/TESTING.md)

## 📦 Packages

### Core Libraries

#### `@connect-star/game-logic`

Pure TypeScript implementation of Connect Four rules:

- Board state management
- Move validation and execution
- Win condition detection (horizontal, vertical, diagonal)
- Game state transitions

#### `@connect-star/types`

Shared TypeScript definitions:

- Game state interfaces
- Player types and moves
- API request/response types

#### `@connect-star/ui`

Reusable React components:

- `GameBoard` - Interactive game grid
- `PlayerIndicator` - Current player display
- `Button` - Styled button variants

#### `@connect-star/api-client`

Server communication utilities:

- HTTP client with TypeScript support
- WebSocket manager for real-time gameplay
- Event-driven architecture

### Applications

#### `@connect-star/web`

Next.js 14 web application:

- App Router with TypeScript
- Tailwind CSS styling
- Responsive design
- Server-side rendering

#### `@connect-star/mobile`

React Native with Expo:

- Cross-platform iOS/Android
- Native mobile components
- Touch-optimized gameplay
- Hot reload development

## 🛠️ Development Scripts

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `pnpm dev`           | Start all development servers |
| `pnpm build`         | Build all packages and apps   |
| `pnpm test`          | Run all tests across packages |
| `pnpm test:coverage` | Generate coverage reports     |
| `pnpm lint`          | Check code style and quality  |
| `pnpm type-check`    | Validate TypeScript types     |
| `pnpm format`        | Format code with Prettier     |
| `pnpm clean`         | Remove build artifacts        |

## 🏗️ Architecture

### Monorepo Benefits

- **Shared Code**: Game logic and components reused across platforms
- **Type Safety**: End-to-end TypeScript with shared types
- **Consistent Tooling**: Unified linting, formatting, and testing
- **Parallel Development**: Independent app development with shared dependencies

### Technology Stack

- **Build System**: Turborepo for task orchestration and caching
- **Language**: TypeScript for type safety across the stack
- **Frontend**: React with Next.js (web) and React Native (mobile)
- **Styling**: Tailwind CSS for consistent design
- **Testing**: Jest with React Testing Library
- **Code Quality**: ESLint + Prettier with pre-commit hooks

## 📚 Documentation

- [Testing Guide](docs/TESTING.md) - Comprehensive testing documentation
- [Contributing Guide](docs/CONTRIBUTING.md) - Development workflow and standards
- [Architecture Decision Records](docs/adr/) - Technical decisions and rationale
- [Deployment Guide](docs/DEPLOYMENT.md) - Build and deployment instructions

## 🤝 Contributing

We welcome contributions from the community! This project is open source and we encourage:

- 🐛 **Bug reports** - Help us identify and fix issues
- ✨ **Feature requests** - Suggest new functionality
- 📖 **Documentation** - Improve guides and examples
- 🧪 **Testing** - Add test coverage and find edge cases
- 💻 **Code contributions** - Implement features and fixes

**Getting Started:**

1. Read the [Contributing Guide](docs/CONTRIBUTING.md)
2. Look for [`good-first-issue`](https://github.com/username/Connect-Star/labels/good-first-issue) labels
3. Follow the established code style and testing practices
4. Ensure all tests pass: `pnpm test`
5. Verify code quality: `pnpm lint && pnpm type-check`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Support

If you find this project helpful, please consider giving it a star on GitHub!
Test change
