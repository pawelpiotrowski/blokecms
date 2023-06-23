const fs = require('fs');
const path = require('path');
const clientPublicDir = path.join(__dirname, '../server/ui-public');
const clientAdminDir = path.join(__dirname, '../server/ui-admin');
const scriptsAdminDir = path.join(__dirname, '../server/ui-admin');

fs.mkdirSync(clientPublicDir, { recursive: true });
fs.writeFileSync(clientPublicDir + '/nestcms.txt', 'NestCMS public files');
fs.mkdirSync(clientAdminDir, { recursive: true });
fs.writeFileSync(clientAdminDir + '/nestcms.txt', 'NestCMS admin files');

console.log('UI directories sreated successfully');

require('child_process').fork(path.join(__dirname, 'build-server-dotenv.js'));
