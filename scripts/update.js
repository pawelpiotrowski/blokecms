const { spawnSync } = require('child_process');
console.log('### Starting nest cms update...\n');
const args = process.argv.slice(2);

try {
  console.log('### Stopping nest cms...');
  spawnSync('pm2', ['stop', 'nestCmsStage']);
  console.log('### Done!');

  console.log('### Git pull latest develop');
  spawnSync('git', ['pull', 'origin', 'develop']);
  console.log('### Done!');

  console.log('### Updating npm packages');
  spawnSync('npm', ['run', 'ci']);
  console.log('### Done!');

  if (args.length > 0) {
    console.log('### Building app with absurl');
    spawnSync('npm', [`--absurl=${args[0]}`, 'run', 'build']);
    console.log('### Done!');
  } else {
    console.log('### Building app');
    spawnSync('npm', ['run', 'build']);
    console.log('### Done!');
  }

  console.log('### Starting nest cms...');
  spawnSync('pm2', ['start', 'nestCmsStage']);
  console.log('### Done!');

  console.log('\n### Update completed!');

  process.exit(0);
} catch (error) {
  console.error('\n### Error updating nest cms');
  process.exit(1);
}
