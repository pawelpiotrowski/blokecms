const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const dotEnvFileLocation = '../server/.env';

// See server/src/app.config.interface.ts for var names

(function buildServerDotEnvFile() {
  try {
    const dotEnvFile = path.join(__dirname, dotEnvFileLocation);

    if (fs.existsSync(dotEnvFile)) {
      console.warn('.env file already exists!');
      return;
    }
    console.log('creating .env file...');

    let dotEnvContent = '';
    dotEnvContent += 'DOT_ENV_VAR_EXISTS="YES"\n';
    dotEnvContent += `JWT_KEY="${crypto
      .randomBytes(256)
      .toString('base64')}"\n`;
    dotEnvContent += `AUTH_COOKIE_SIGN_SECRET="${crypto
      .randomBytes(20)
      .toString('hex')}"\n`;
    dotEnvContent += `AUTH_COOKIE_NAME="${crypto
      .randomBytes(10)
      .toString('hex')}"\n`;
    dotEnvContent += `AUTH_REFRESH_COOKIE_NAME="${crypto
      .randomBytes(10)
      .toString('hex')}"\n`;

    fs.writeFileSync(dotEnvFile, dotEnvContent);

    console.log(`.env file created ${dotEnvFile}`);
  } catch (err) {
    console.error("Uh oh can't create .env file", err);
  }
})();
