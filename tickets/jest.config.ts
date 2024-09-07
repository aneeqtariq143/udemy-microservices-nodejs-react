import type { Config } from 'jest';

console.log('./test/setup.ts')
const config: Config = {
  preset: 'ts-jest', // Use ts-jest preset
  testEnvironment: 'node', // Set the test environment to Node.js
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Recognize these file extensions
  setupFilesAfterEnv: ['./src/test/setup.ts'], // Include the setup file
};

export default config;