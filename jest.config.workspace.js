module.exports = {
  projects: [
    '<rootDir>/packages/game-logic',
    '<rootDir>/packages/ui',
    '<rootDir>/apps/mobile',
    '<rootDir>/apps/web',
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    'apps/*/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/__tests__/**',
    '!**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
