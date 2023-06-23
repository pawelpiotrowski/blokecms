# Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

To create feature module with routing declaration:
`npx ng g m features/<feature_name> --route <feature_route> --module app.module.ts --project=<project_name>`

### Elf Code scaffolding

To create repository
`npx @ngneat/elf-cli repo`
During interactive session you can provide repo name and location.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Jest](https://jestjs.io).
Run `ng test -- --watch` to execute the unit tests in watch mode
Run `ng test -- --coverage` to execute the unit tests and generate coverage
Run `ng test:admin|public|shared` to execute the unit tests in one project
For single test run: `npm run test:admin|public|shared -- -t <TEST_MAIN_DESCRIBE>`

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Updating

Run `npx ng update` to find available angular packages updates.
Run `npm outdated` to find available packages updates.

**Gotcha:**
If you see this error after checking updates: `An unhandled exception occurred: Cannot locate bin for temporary package: @angular/cli.` run: `npm update @angular/cli`.

There are 2 types of updates:

- available through angular cli
- available directly with npm

To perform a basic update to the current stable release of angular core framework and CLI run the following command:

`npx ng update @angular/cli @angular/core`

To update non angular packages run:

`npm update <package1> <package2>...`
or
`npm update`
to update all outdated packages at once.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
