module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    'shared-lib': '<rootDir>/projects/shared-lib/src/lib',
  },
  collectCoverageFrom: [
    '<rootDir>/projects/public/src/app/**/{!(*.module|*.interface),}.(t|j)s',
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  displayName: 'CLIENT PUBLIC',
};
