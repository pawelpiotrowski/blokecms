module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    'shared-lib': '<rootDir>/projects/shared-lib/src/lib',
  },
  collectCoverageFrom: [
    '<rootDir>/projects/admin/src/app/**/{!(*.module|*.interface|*.actions),}.(t|j)s',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/projects/admin/src/app/features/block/form/image-menu/',
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!@angular|@ngneat|apollo-angular|ngx-editor)',
  ],
  displayName: 'CLIENT ADMIN',
};
