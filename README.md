# Bloke CMS

[![Test](https://github.com/pawelpiotrowski/blokecms/actions/workflows/test.yml/badge.svg)](https://github.com/pawelpiotrowski/blokecms/actions/workflows/test.yml)
**<p style="text-align: center;">Simple CMS built with nestjs and angular</p>**

#### Disclaimer

This project is at MVP stage, please keep that in mind if you decide to use it.

## What

With Bloke CMS you build your content with **blocks**:

- Text blocks
- Code blocks
- Media blocks

Blocks can be re-used across articles, sidebars* and footers* improving content creation efficiency. Content can be published by creating pages.

Client is build with angular universal meaning that first page render occures on a server and then content rendering is handled by a browser upon navigation. This approach supports search engines and provides SPA experience to a user.

_\* WIP feature_

## Why

For educational reasons, mainly to try angular universal and nestjs.

## How

Install Bloke CMS using [blokecms-cli](https://github.com/pawelpiotrowski/blokecms-cli) or fork the repository.

#### Pages

To create a page you must provide a title, slug and optionally add articles, sidebars and footers.
For a public home page create a page with _home_ slug.

#### Navigation

To create public client main navigation use name _main_.

#### Styling

To style public client application create style and use name _main_.

#### Scripting

To add javascript create script and use name _main_.

## Requirements

Node v16 or v18 and Mongo DB. Minimum 2GB RAM.

## Installation

### CLI

For production ready optimised version use [blokecms-cli](https://github.com/pawelpiotrowski/blokecms-cli):

```bash
$ npx blokecms-cli@latest
$ cd blokecms/package/server
$ NODE_ENV=production node dist/main
```

**You may want to seed user if starting the cms for first time**, please read on.

### Fork

See [DEVELOPMENT](https://github.com/pawelpiotrowski/blokecms/blob/main/DEVELOPMENT.md) for details and [package.json](https://github.com/pawelpiotrowski/blokecms/blob/main/package.json) scripts.

For quick setup run:

```bash
$ npm run install
$ npm run build:prepare
$ npm run build:start
```

and navigate to `http://localhost:3000`;

**You may want to seed user if starting the cms for first time**, please read on.

### Seed User

When starting Bloke CMS you can seed user to get access to admin panel.

```bash
$ ADMIN_SEED=your_username node dist/main
```

or (if forked)

```bash
$ ADMIN_SEED=your_username npm run start
```

In terminal you will see 'Admin seed created, pwd: "..."', make a note of the password as it is displayed **only once**.
After app is started you can login to admin panel using previously provided 'your_username' and displayed password. You can then create new admin user and delete the seed if you like.

## Deployment

Tested with [bitnami MEAN stack](https://docs.bitnami.com/azure/infrastructure/mean/get-started/get-started/) on AWS using LightSail. For more details see [DEVELOPMENT Deployment](https://github.com/pawelpiotrowski/blokecms/blob/main/DEVELOPMENT.md#deployment) section.
