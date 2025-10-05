# GTrackFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 20.2.0.

## Angular 20 + DEMO

- Angular CLI, framework packages, Material, and build tooling are upgraded to 20.x.
- Launch the demo with `npm ci && npm start` (or `ng serve`): authentication is disabled and all sections are open for browsing.
- Centralized menu configuration lives in `src/app/layout/menu.config.ts`.
- Toggle demo mode via `src/app/demo.config.ts` and `src/environments/environment*.ts`.

## Upgrade to Angular 20

Each lettered step should land in a dedicated pull request to keep the migrations auditable and
ensure `/demo` keeps working end-to-end.

A) **16/17 → 17 (or rebaseline on the current major)**
   - `npx ng update @angular/core@17 @angular/cli@17 --force`
   - If Angular Material is present: `npx ng update @angular/material@17`

B) **17 → 18**
   - `npx ng update @angular/core@18 @angular/cli@18`
   - Review the CLI hints around standalone bootstrap, typed forms, and the shift to ESM-only packages.

C) **18 → 19**
   - `npx ng update @angular/core@19 @angular/cli@19`
   - Verify RxJS (^7.8), zone.js (^0.15), and TypeScript alignment with the migrator notes.

D) **19 → 20**
   - `npx ng update @angular/core@20 @angular/cli@20`
   - Angular 20 stabilises Signals-based reactivity; zoneless mode stays in developer preview.
   - Require TypeScript ^5.5+ and Node 20.x.

E) **Angular Material 20**
   - `npx ng update @angular/material@20`

After every upgrade step:

- `npm run build`
- Manually open `/demo` and `/demo/drivers` to ensure navigation, filters, and CRUD flows work with no console errors.
- Commit the refreshed lockfile within the PR.

### CI / Vercel deployment

- Framework preset: **Angular**
- Build command: `npm ci && npm run build`
- Output directory: follow the `angular.json` build output (e.g. `dist/g-track-frontend/browser`)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
