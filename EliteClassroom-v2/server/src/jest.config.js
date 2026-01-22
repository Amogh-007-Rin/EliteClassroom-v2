module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Look for files ending in .test.ts or .spec.ts
  testMatch: ['**/*.test.ts'],
  verbose: true,
  forceExit: true,
  // clearMocks: true, // Recommended to reset mocks between tests
};