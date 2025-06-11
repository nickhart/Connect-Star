const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'api-client',
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};