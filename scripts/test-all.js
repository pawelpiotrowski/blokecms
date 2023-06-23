const { spawn } = require('child_process');

/**
 *
 * PRIVATE
 */

function _onStdout(data) {
  console.log(`${data}`);
}

function _onStderr(data) {
  console.log(`${data}`);
}

function _onClose(msgPartial, code, clbk) {
  console.log(
    '\x1b[32m%s\x1b[0m',
    `--> ${msgPartial} finished with code: ${code}`,
  );
  // exit on error
  if (code === 1) {
    process.exit(1);
  }
  clbk();
}

function _onError(error, prefix) {
  console.log('\x1b[31m%s\x1b[0m', `--> ${prefix} error: ${error.message}`);
}

function _onStart(msgPartial) {
  console.log('\x1b[32m%s\x1b[0m', `--> ${msgPartial} started...`);
}

function _getSpawnFor(label, args) {
  _onStart(label);
  return spawn('npm', ['run', ...args]);
}

function _spawnFactory(spawnArgs, label, clbk) {
  const spawnSource = _getSpawnFor(label, spawnArgs);
  spawnSource.stdout.on('data', _onStdout);
  spawnSource.stderr.on('data', _onStderr);
  spawnSource.on('error', (error) => {
    _onError(error, label);
  });
  spawnSource.on('close', (code) => {
    _onClose(label, code, clbk);
  });
}

const _clientSpawnArgs = [
  '--prefix',
  './client',
  '--',
  '--coverage',
  // TODO bring it back - started failing after update angular to v14 and jest to v28
  // '--coverageReporters="text-summary"',
];

const _serverSpawnArgs = [
  '--prefix',
  './server',
  '--',
  '--coverageReporters="text-summary"',
];

/**
 *
 * PUBLIC
 */

function done() {
  console.log('\x1b[32m%s\x1b[0m', '--> TEST finished');
}

function testClientAdmin() {
  _spawnFactory(['test:admin', ..._clientSpawnArgs], 'TEST CLIENT ADMIN', done);
}

function testClientPublic() {
  _spawnFactory(
    ['test:public', ..._clientSpawnArgs],
    'TEST CLIENT PUBLIC',
    testClientAdmin,
  );
}

function testClientShared() {
  _spawnFactory(
    ['test:shared', ..._clientSpawnArgs],
    'TEST CLIENT SHARED',
    testClientPublic,
  );
}

function testServer() {
  _spawnFactory(
    ['test:cov', ..._serverSpawnArgs],
    'TEST SERVER',
    testClientShared,
  );
}

function build() {
  _spawnFactory(['build'], 'BUILD', testServer);
}

function start() {
  // color log setting pattern:
  // \desiredColor%sbackToPreviousColor\
  console.log('\x1b[32m%s\x1b[0m', '--> TEST started...');
  build();
}

start();
