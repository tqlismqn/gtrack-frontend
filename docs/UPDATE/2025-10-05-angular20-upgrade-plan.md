# Angular 20 upgrade plan (2025-10-05)

## Strategy

The Angular CLI migrator performs targeted code modifications and dependency bumps for each
major version. Splitting the upgrade into focused pull requests keeps the diffs reviewable,
ensures that the `/demo` showcase remains functional, and allows us to run the automated
migrations (standalone APIs, typed forms, ESM adjustments) without mixing concerns.

## Pull request breakdown

1. **16/17 → 17 (or rebaseline on 17)**
   - `npx ng update @angular/core@17 @angular/cli@17 --force`
   - If Angular Material is in use: `npx ng update @angular/material@17`
2. **17 → 18**
   - `npx ng update @angular/core@18 @angular/cli@18`
   - Follow up on migrator notes (standalone bootstrap, typed forms, ESM-only builds).
3. **18 → 19**
   - `npx ng update @angular/core@19 @angular/cli@19`
   - Confirm RxJS (≥7.8), zone.js (≥0.15), and TypeScript compatibility per CLI guidance.
4. **19 → 20**
   - `npx ng update @angular/core@20 @angular/cli@20`
   - Angular 20 finalises Signals/reactivity primitives; zoneless mode remains preview-only.
   - Ensure TypeScript ≥5.5 and Node 20.x are installed.
5. **Angular Material finalisation**
   - `npx ng update @angular/material@20`

## Review checklist for every upgrade PR

- `npm run build`
- Run unit and e2e suites if configured.
- Open `/demo` and `/demo/drivers`, exercising navigation, filters, and CRUD flows without
  console errors.
- Commit the refreshed lockfile alongside the code changes.
