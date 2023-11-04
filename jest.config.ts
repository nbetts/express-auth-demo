import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/test/**/*.test.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
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
