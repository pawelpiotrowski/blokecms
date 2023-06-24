const { spawnSync } = require('child_process');
console.log('### Starting Bloke CMS update...\n');
const args = process.argv.slice(2);

try {
  console.log('### Stopping Bloke CMS...');
  spawnSync('pm2', ['stop', 'blokeCmsStage']);
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

  console.log('### Starting Bloke CMS...');
  spawnSync('pm2', ['start', 'blokeCmsStage']);
  console.log('### Done!');

  console.log('\n### Update completed!');

  process.exit(0);
} catch (error) {
  console.error('\n### Error updating Bloke CMS');
  process.exit(1);
}
