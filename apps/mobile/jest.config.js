const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'mobile',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};