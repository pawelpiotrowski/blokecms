# Bloke CMS Development

## Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.
Find more in client's [README](client/README.md).

## Server

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
Find more in server's [README](server/README.md).

## E2E

[Playwright](https://playwright.dev) a reliable end-to-end testing for modern web apps..
Find more in e2e's [README](e2e/README.md).

## CLI

There is dedicated [cli tool](https://www.npmjs.com/package/nestcms-cli) to install and manage the CMS.

Details: TBA

## Package Scripts

```bash
# build (production mode only)
$ npm run build

# build (production mode only) and start server
$ npm run build:start

# clean install in all apps
$ npm run ci

# install in all apps
$ npm run install

# start (production mode only)
$ npm run start

# run all unit tests with coverage reports
$ npm run test

# update app version (major,minor,path or semver string)
$ npm run version <ARG>

# print app version
$ npm run version

# start local server and run e2e tests
$ npm run e2e
```

_Please note that installing dependencies for e2e tests is not included in above `ci` or `install` commands_

## Seed User

When starting your deployment you can seed user to get access to admin panel.

```bash
$ ADMIN_SEED=your_username npm run start
```

In terminal you will see 'Admin seed created, pwd: "<RANDOM_PASSWORD>"', make a note of the <RANDOM_PASSWORD> as it is displayed only **once**.
After app is started you can login to admin panel using previously provided 'your_username' and <RANDOM_PASSWORD>. You can then create new admin user and delete the seed if you like.

## Git

### Branch Model

Following [this guide](https://gist.github.com/Rishav-Git/b774bc5a1e3332395f214b02f1006687) and ensuring [linear git history](https://www.bitsnbites.eu/a-tidy-linear-git-history/)

### Pull Requests

When merging **PR to develop branch** please use "Squash merging" option

When merging **PR to main branch** please use "Rebase merging" option

**After merging develop to main merge main back to develop**
`git merge main --no-ff`

## Development

For details on running app in development mode see: [Server's README](server/README.md) and [Client's README](client/README.md)

## CI

Continuous integration is set via [Github Actions](https://docs.github.com/en/actions). For details see workflows located in [github workflows directory](.github/workflows).

## Deployment

Using [bitnami MEAN stack](https://docs.bitnami.com/azure/infrastructure/mean/get-started/get-started/) with AWS LightSail.

### Create instance with MEAN stack

Use min 1GB RAM. Make sure you download instance ssh key.

### Ensure correct node version

Check [.nvmrc](.nvmrc) file for node version and if needed install it on deployment server using [nvm](https://github.com/nvm-sh/nvm).

### Setup git

As per [github instruction](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys)

### Establish ssh connection and setup git

To setup CD pipeline with github actions:

**For github -> server communication**

- download ssh key created with Lightsail (as .pem)
- add content of pem file as secret in github (open in editor and c/p)
- use it to establish ssh connection with lightsail from github's action see [test-and-deploy.yml](.github/workflows/test-and-deploy.yml).

**For server -> github communication git pull/clone**

- add lightsail public ssh key as deploy key in repo settings (recommended: as read-only)
- when using git on server make sure that [git does not require sudo](https://docs.github.com/en/authentication/troubleshooting-ssh/error-permission-denied-publickey#should-the-sudo-command-or-elevated-privileges-be-used-with-git).

Create 'projects' directory
`sudo mkdir /opt/bitnami/projects`
`sudo chown $USER /opt/bitnami/projects`

Git clone repository and `cd` to it.
Install dependencies: `npm run install`.
Create '.env' file in [server directory](./server/) - _hint_ you can use script to generate it:
`node ./scripts/build-server-dotenv.js`

### Setup MongoDB

Setup user and db for cms:

Login to mongo:
`mongo admin --username root -p password`
or
`mongosh admin --username root -p password`
Password will be your 'bitnami' user password (find in 'bitnami_credentials'):
`cat ~/bitnami_credentials`

Create db:
`use <DB_NAME>;`

Add user:
`db.createUser({ user: "<USER_NAME>", pwd: "<USER_PWD>", roles: ["dbOwner"] });`

Exit:
`exit;`

Add DB_URL to .env file:
`DB_URL="mongodb://<USER_NAME>:<USER_PWD>@localhost/<DB_NAME>"`

### Build the app providing absolute url for client graphql setup

`npm --absurl=<YOUR_CMS_URL> run build`

**!** If you don't provide absolute url default value "http://localhost:3000" will be used.

### Setup https

`sudo /opt/bitnami/bncert-tool`

**!** If you don't and run CMS over http you must disable required https for auth cookies in .env file:

`AUTH_COOKIES_REQUIRE_HTTPS="false"`

### Setup and Restart Apache

Set apache vhost.
Copy the file to remove the .disabled suffix:
`sudo cp /opt/bitnami/apache/conf/vhosts/sample-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-vhost.conf`
`sudo cp /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf`
You will need to edit path in both files to match nestcms location:
`DocumentRoot` and `<Directory...`
**Note: you must point to server dist directory**

Restart Apache for the changes to be taken into effect:
`sudo /opt/bitnami/ctlscript.sh restart apache`

### Start the app providing (optional) user seed

`ADMIN_SEED=<YOUR_ADMIN_SEED_USERNAME> npm run start`

Look for log 'Admin seed created <PASSWORD>' to make a note of your seed username password.

### Updates (optional)

With [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/).

_If you are using nvm sudo won't be required_

Install it globally:
`sudo npm install pm2@latest -g`
Start the app providing a name and start script:
`pm2 start npm --name "blokeCmsStage" -- run "start"`
Since this may take a while you can check logs when build is finished and app is running:
`pm2 logs`
You can now start using update script
`node /opt/bitnami/projects/blokecms/scripts/update.js`
