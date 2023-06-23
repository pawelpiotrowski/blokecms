const fs = require('fs');
const path = require('path');
const npmArgAbsUrl = process.env.npm_config_absurl;

if (npmArgAbsUrl != null && typeof npmArgAbsUrl === 'string') {
  const file = path.join(process.cwd(), 'config.client.json');
  const copy = path.join(process.cwd(), 'config.client.copy.json');

  fs.copyFileSync(file, copy);
  // read file and make object
  let content = JSON.parse(fs.readFileSync(file, 'utf8'));
  // edit or add property
  content.ssrAbsoluteUrl = npmArgAbsUrl;
  //write file
  fs.writeFileSync(file, JSON.stringify(content));
}

process.exit(0);
