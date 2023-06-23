const fs = require('fs');
const path = require('path');
const npmArgAbsUrl = process.env.npm_config_absurl;

if (npmArgAbsUrl != null && typeof npmArgAbsUrl === 'string') {
  try {
    const file = path.join(process.cwd(), 'config.client.json');
    const copy = path.join(process.cwd(), 'config.client.copy.json');

    if (fs.existsSync(file) && fs.existsSync(copy)) {
      fs.rmSync(file, {
        force: true,
      });
      fs.renameSync(copy, file);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

process.exit(0);
