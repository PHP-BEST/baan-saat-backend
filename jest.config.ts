import { createDefaultPreset } from 'ts-jest';
import type { Config } from 'jest';

const tsJestTransformCfg = createDefaultPreset().transform;

const config: Config = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },

  maxWorkers: 1,
  setupFiles: ['dotenv/config'],

  collectCoverage: true,

  collectCoverageFrom: [
    'src/post/filterPost.ts',
    '!src/**/*.test.ts',
    '!src/models/**',
    '!src/tests/**',
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json', 'text-summary'],

  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
    'src/post/filterPost.ts': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },

  testMatch: ['**/tests/filterPost.test.ts'],

  verbose: true,

  rootDir: '.',
};

export default config;
