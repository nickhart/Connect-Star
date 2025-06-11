# Connect Star

A Connect Four game built with Turborepo, featuring both web and mobile applications sharing common game logic.

## Project Structure

```
Connect-Star/
├── apps/
│   ├── web/          # Next.js 14 web application
│   └── mobile/       # React Native with Expo
├── packages/
│   ├── types/        # TypeScript type definitions
│   ├── game-logic/   # Shared Connect Four game rules
│   ├── ui/           # Shared React components
│   └── api-client/   # Server communication utilities
└── package.json      # Root package.json with Turborepo config
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (for mobile development)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Connect-Star
```

2. Install dependencies:

```bash
npm install
```

### Development

Start all applications in development mode:

```bash
npm run dev
```

Start specific applications:

```bash
# Web app only
npm run dev --filter=@connect-star/web

# Mobile app only
npm run dev --filter=@connect-star/mobile
```

### Building

Build all packages and applications:

```bash
npm run build
```

Build specific packages:

```bash
npm run build --filter=@connect-star/game-logic
```

## Package Details

### @connect-star/types

TypeScript definitions for the Connect Four game, including game state, player types, and API interfaces.

### @connect-star/game-logic

Core game logic including:

- Board management
- Move validation
- Win condition checking
- Game state transitions

### @connect-star/ui

Shared React components:

- GameBoard component
- PlayerIndicator component
- Button component

### @connect-star/api-client

HTTP client for server communication with WebSocket support for real-time gameplay.

### @connect-star/web

Next.js 14 web application with:

- App Router
- TypeScript
- Tailwind CSS
- Responsive design

### @connect-star/mobile

React Native app with Expo featuring:

- Cross-platform compatibility
- Native mobile UI components
- Touch-optimized gameplay

## Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build all packages
- `npm run lint` - Run linting
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run clean` - Clean build artifacts

## Technologies

- **Turborepo** - Monorepo build system
- **TypeScript** - Type safety
- **Next.js 14** - Web framework
- **React Native + Expo** - Mobile development
- **Tailwind CSS** - Styling
- **React** - UI library
