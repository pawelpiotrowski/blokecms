/* eslint-env es6 */
/* eslint-disable */
const fse = require('fs-extra');
const path = require('path');
const packageJsonPath = path.join(__dirname, '../package.json');
const sourcePackageJsonPath = path.join(__dirname, '../../../package.json');
const packageJson = require(packageJsonPath);
const sourcePackageJson = require(sourcePackageJsonPath);

try {
  packageJson.version = sourcePackageJson.version;
  fse.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });
  console.log('Package version synced!');
} catch (e) {
  console.error('Error syncing packages versions');
  process.exit(1);
}
