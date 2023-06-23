const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const clientPublicInput = path.join(__dirname, '../client/dist/public');
const clientPublicOutput = path.join(__dirname, '../server/ui-public');
const clientAdminInput = path.join(__dirname, '../client/dist/admin');
const clientAdminOutput = path.join(__dirname, '../server/ui-admin');

function setBaseHref(outputDir) {
  const yamlconfig = spawnSync('npx', [
    'js-yaml',
    path.join(__dirname, '..', 'config.default.yaml'),
  ]);
  const { ui } = JSON.parse(yamlconfig.stdout.toString());
  const isAdmin = outputDir === clientAdminOutput;
  const configUrl = isAdmin ? ui.admin.url : ui.public.url;
  const label = isAdmin ? 'admin' : 'public';

  if (configUrl.length === 0) {
    return;
  }

  const indexFile = `${
    isAdmin ? clientAdminOutput : `${clientPublicOutput}/browser`
  }/index.html`;
  const indexContent = fs.readFileSync(indexFile, 'utf-8');
  const baseHrefTag = '<base href="/">';
  const baseHrefTagReplacement = baseHrefTag.replace('/', `/${configUrl}/`);
  const indexContentWithBaseHref = indexContent.replace(
    baseHrefTag,
    baseHrefTagReplacement,
  );
  fs.writeFileSync(indexFile, indexContentWithBaseHref);
  console.log(
    `### Replaced base href to "${baseHrefTagReplacement}" in ${label} index.html`,
  );
}

function rimrafClientDir(clientDirPath) {
  fs.rmSync(clientDirPath, { recursive: true });
  fs.mkdirSync(clientDirPath);
  fs.openSync(path.join(clientDirPath, '.gitkeep'), 'w');
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  console.log('### Deleting any existing client public files...');
  rimrafClientDir(clientPublicOutput);
  console.log('### Deleting any existing client public files  -> DONE!\n');

  console.log('### Copying client public...');
  copyRecursiveSync(clientPublicInput, clientPublicOutput);
  setBaseHref(clientPublicOutput);
  console.log('### Copying client public -> DONE!\n');

  console.log('### Deleting any existing client admin files...');
  rimrafClientDir(clientAdminOutput);
  console.log('### Deleting any existing client admin files  -> DONE!\n');

  console.log('### Copying client admin...');
  copyRecursiveSync(clientAdminInput, clientAdminOutput);
  setBaseHref(clientAdminOutput);
  console.log('### Copying client admin -> DONE!\n');

  console.log('### Copying client files -> DONE!');
} catch (err) {
  console.error('### Error copying client files', err);
  process.exit(1);
}
