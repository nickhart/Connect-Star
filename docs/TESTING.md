# Testing Guide

This document provides comprehensive information about the testing setup and practices in the Connect-Star monorepo.

## Overview

The Connect-Star project maintains high test coverage across all packages with **67 total tests** covering:
- Unit tests for game logic
- Component tests for UI elements
- Integration tests for API communication
- Smoke tests for applications

## Test Configuration

### Framework
- **Jest** - Primary testing framework
- **React Testing Library** - Component testing
- **React Native Testing Library** - Mobile component testing
- **@testing-library/jest-dom** - Enhanced DOM assertions

### Coverage Thresholds

| Package | Branches | Functions | Lines | Statements |
|---------|----------|-----------|-------|------------|
| `game-logic` | 80% | 80% | 80% | 80% |
| `ui` | 80% | 80% | 80% | 80% |
| `api-client` | 75% | 75% | 75% | 75% |
| `mobile` | 70% | 70% | 70% | 70% |
| `web` | 70% | 70% | 70% | 70% |

## Running Tests

### All Tests
```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in CI mode
pnpm test:ci
```

### Package-Specific Tests
```bash
# Individual packages
cd packages/game-logic && pnpm test
cd packages/ui && pnpm test
cd packages/api-client && pnpm test

# Using Turbo filters
pnpm test --filter=game-logic
pnpm test --filter=ui
```

### Watch Mode
```bash
# Watch mode for active development
pnpm test --filter=game-logic -- --watch
pnpm test --filter=ui -- --watch --verbose
```

## Test Details by Package

### @connect-star/game-logic (25 tests)

**Focus**: Core game mechanics and business logic

**Test Coverage**:
- ✅ Board creation and state management
- ✅ Move validation (bounds checking, column availability)
- ✅ Win detection (horizontal, vertical, diagonal)
- ✅ Game state transitions
- ✅ Edge cases and error handling

**Key Test Files**:
- `src/__tests__/index.test.ts` - Main test suite

**Example Test**:
```typescript
describe('checkWinner', () => {
  it('should detect horizontal win', () => {
    const board = createEmptyBoard();
    // Set up horizontal win condition
    board[5][0] = 'red';
    board[5][1] = 'red';
    board[5][2] = 'red';
    board[5][3] = 'red';
    
    expect(checkWinner(board)).toBe('red');
  });
});
```

### @connect-star/ui (29 tests)

**Focus**: Component behavior and user interactions

**Test Coverage**:
- ✅ Button component variants and states
- ✅ GameBoard rendering and click handling
- ✅ PlayerIndicator display logic
- ✅ Component accessibility
- ✅ Prop validation and edge cases

**Key Test Files**:
- `src/__tests__/components/Button.test.tsx`
- `src/__tests__/components/GameBoard.test.tsx`
- `src/__tests__/components/PlayerIndicator.test.tsx`

**Example Test**:
```typescript
describe('GameBoard', () => {
  it('should render empty board correctly', () => {
    const board = createTestBoard();
    render(<GameBoard board={board} />);
    
    const gameBoard = screen.getByLabelText('Drop piece in column 1')
      .closest('.game-board');
    expect(gameBoard).toBeInTheDocument();
  });
});
```

### @connect-star/api-client (13 tests)

**Focus**: HTTP and WebSocket communication

**Test Coverage**:
- ✅ Client initialization and configuration
- ✅ HTTP request methods (createRoom, joinRoom, makeMove)
- ✅ WebSocket connection management
- ✅ Event listener registration
- ✅ Error handling and edge cases

**Key Test Files**:
- `src/__tests__/index.test.ts` - Complete API client test suite

**Example Test**:
```typescript
describe('WebSocket connection', () => {
  it('should connect to WebSocket successfully', () => {
    const client = new ConnectStarApiClient('http://localhost:3000');
    client.connect();
    
    expect(mockWebSocket).toHaveBeenCalledWith('ws://localhost:3000');
  });
});
```

### @connect-star/mobile & @connect-star/web (1 test each)

**Focus**: Basic application functionality

**Test Coverage**:
- ✅ Smoke tests to ensure apps can be instantiated
- ✅ Basic rendering without errors

## Testing Best Practices

### Test Structure
```typescript
describe('Component/Function Name', () => {
  describe('specific behavior', () => {
    it('should do something specific', () => {
      // Arrange
      const input = setupTestData();
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from '../Component';

describe('Component', () => {
  it('should handle user interaction', () => {
    const mockHandler = jest.fn();
    render(<Component onAction={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockHandler).toHaveBeenCalledWith(expectedArgs);
  });
});
```

### Mocking Guidelines

**Global Mocks** (for APIs):
```typescript
// @ts-ignore
global.fetch = jest.fn();
// @ts-ignore  
global.WebSocket = jest.fn();
```

**Module Mocks**:
```typescript
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));
```

## Continuous Integration

### Pre-commit Checks
Tests run automatically on:
- Commit (via git hooks)
- Pull request creation
- CI/CD pipeline

### CI Configuration
```bash
# Full test suite with coverage
pnpm test:ci

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## Coverage Reports

### Generating Reports
```bash
# Generate HTML coverage report
pnpm test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

### Coverage Files
- `coverage/` - HTML reports and LCOV data
- `coverage/lcov-report/index.html` - Main coverage dashboard

## Debugging Tests

### Common Issues

**Jest Configuration**:
- Ensure `jest.config.js` extends base configuration
- Check `setupFilesAfterEnv` paths are correct

**React Testing Library**:
- Use `screen.debug()` to inspect rendered output
- Prefer semantic queries (`getByRole`, `getByLabelText`)

**Async Testing**:
```typescript
// Wait for elements
await waitFor(() => {
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});

// Wait for disappearance
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
```

### Debug Commands
```bash
# Verbose output
pnpm test --filter=package-name -- --verbose

# Run specific test file
pnpm test --filter=package-name -- ComponentName.test.tsx

# Debug mode
pnpm test --filter=package-name -- --detectOpenHandles --forceExit
```

## Adding New Tests

### Test File Structure
```
packages/package-name/
├── src/
│   ├── components/
│   │   └── Component.tsx
│   └── utils/
│       └── helper.ts
└── __tests__/
    ├── components/
    │   └── Component.test.tsx
    └── utils/
        └── helper.test.ts
```

### Test Naming Convention
- Test files: `*.test.ts` or `*.test.tsx`
- Test directories: `__tests__/`
- Describe blocks: Use the component/function name
- Test cases: Start with "should" and describe the expected behavior

## Performance

### Parallel Execution
Tests run in parallel across packages using Turborepo:
```bash
# All packages run simultaneously
pnpm test  # Runs: game-logic, ui, api-client, mobile, web
```

### Test Optimization
- Tests cached by Turborepo based on source changes
- Only affected packages re-run tests
- Coverage reports generated incrementally

## Further Reading

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Guide](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)