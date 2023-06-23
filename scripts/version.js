/**
 * Validate arguments
 */
const args = process.argv.slice(2);
const arg = args[0];
const validArgs = [
  'major',
  'minor',
  'patch',
  'premajor',
  'preminor',
  'prepatch',
  'prerelease',
  'show',
];
const argValidationIndex = validArgs.indexOf(arg);

if (arg == undefined || typeof arg !== 'string' || argValidationIndex < 0) {
  console.error('### Invalid or no argument(s)');
  process.exit(1);
}

/**
 * Check if argument is 'show'
 */
const fs = require('fs');
const path = require('path');

if (arg === 'show') {
  const currentMainPackageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'),
  );
  console.log(`Current version is ${currentMainPackageJson.version}`);
  process.exit(0);
}

/**
 * Check for uncommied changes
 */
const { spawnSync } = require('child_process');
const gitStatus = spawnSync('git', ['status', '--porcelain']);
const hasDiff = gitStatus.stdout && gitStatus.stdout.length > 0;

if (hasDiff) {
  console.error('### Version not updated - uncommited changes');
  process.exit(1);
}

/**
 * Update packages
 */
const serverVersionFilePath = path.join(__dirname, '../server/src/version.ts');
console.log('Updating version...');
const commonSpawnNpmVerArgs = [
  'version',
  arg,
  '--no-commit-hooks',
  '--no-git-tag-version',
];
const commonSpawnNpmVerArgsSubdir = [...commonSpawnNpmVerArgs, '--prefix'];
spawnSync('npm', [...commonSpawnNpmVerArgsSubdir, './client']);
spawnSync('npm', [...commonSpawnNpmVerArgsSubdir, './server']);
spawnSync('npm', [...commonSpawnNpmVerArgsSubdir, './e2e']);
spawnSync('npm', [...commonSpawnNpmVerArgs]);

const updatedPackageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'),
);

fs.writeFileSync(
  serverVersionFilePath,
  `// auto-generated do not edit\nexport const version = '${updatedPackageJson.version}';\n`,
);

spawnSync('git', ['add', '.']);
spawnSync('git', ['commit', '-m', `version ${updatedPackageJson.version}`]);
console.log(`Updating version to ${updatedPackageJson.version} DONE!`);
process.exit(0);
