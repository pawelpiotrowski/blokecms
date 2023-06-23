module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverageFrom: [
    '<rootDir>/projects/shared-lib/src/lib/**/{!(*.module|*.interface|index),}.(t|j)s',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/projects/shared-lib/src/lib/graphql/',
    '<rootDir>/projects/shared-lib/src/lib/code-edit/',
    '<rootDir>/projects/shared-lib/src/lib/http/http-config.service.ts',
  ],
  displayName: 'CLIENT SHARED',
};
