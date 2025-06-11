const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'game-logic',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};