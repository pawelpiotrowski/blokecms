const fs = require('fs');
const path = require('path');
const clientPublicDir = path.join(__dirname, '../server/ui-public');
const clientAdminDir = path.join(__dirname, '../server/ui-admin');

fs.mkdirSync(clientPublicDir, { recursive: true });
fs.writeFileSync(clientPublicDir + '/blokecms.txt', 'Bloke CMS public files');
fs.mkdirSync(clientAdminDir, { recursive: true });
fs.writeFileSync(clientAdminDir + '/blokecms.txt', 'Bloke CMS admin files');

console.log('UI directories created successfully');

require('child_process').fork(path.join(__dirname, 'build-server-dotenv.js'));
