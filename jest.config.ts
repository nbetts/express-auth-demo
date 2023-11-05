import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/test/**/*.test.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/server.ts',
  ],
  fakeTimers: {
    enableGlobally: true,
  },
  restoreMocks: true,
};

export default config;
