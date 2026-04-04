# packqi

MediaWiki-friendly CSS and JS bundler, linter, and formatter.

Produces deployment-ready assets for a MediaWiki wiki. Source is written in modern TypeScript and CSS; the build step downlevels output to what MediaWiki's JS/CSS pipeline can actually parse.

> [!NOTE]
> This was made specifically for the Where Winds Meet Wiki and MediaWiki 1.43+. You can fork this repository and adapt it to your needs. If there's enough interest, I may refactor into into an agnostic package in the future.

## Requirements

- [pnpm](https://pnpm.io/) ≥ 10
- Node.js LTS (≥ 24). PNPM can handle it with `pnpm env global install lts`

## Install

```sh
pnpm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Bundle JS and CSS into `dist/` |
| `pnpm lint` | Lint TypeScript with [oxlint](https://oxc.rs/docs/guide/usage/linter) |
| `pnpm format` | Format source with [oxfmt](https://oxc.rs/docs/guide/usage/formatter) |

## Source layout

```
src/
  css/
    citizen.css         # Entry point — Citizen skin styles
    citizen/            # Partials imported by citizen.css
    common.css          # Entry point — styles for all skins
  ts/
    citizen.ts          # Entry point — Citizen skin scripts
    common.ts           # Entry point — scripts for all skins
```

## Deploying

Copy the files from `dist/` to the corresponding MediaWiki system pages:

| File | Page |
|------|------|
| `dist/citizen.css` | `MediaWiki:Citizen.css` |
| `dist/citizen.js` | `MediaWiki:Citizen.js` |
| `dist/common.css` | `MediaWiki:Common.css` |
| `dist/common.js` | `MediaWiki:Common.js` |

## Why
- Big wikis need to split their CSS files, leading to client-side @import calls.
- Outdated linter does not accurately inform of issues or unsupported syntax
- Writing JS for wikis is often a chore, as latest ECMAScript support has a few gotchas due to server-side parsing

## Outputs

| File | Loaded on |
|------|-----------|
| `dist/citizen.css` | Citizen skin only |
| `dist/citizen.js` | Citizen skin only |
| `dist/common.css` | All skins |
| `dist/common.js` | All skins |

## How it works

**CSS** — [LightningCSS](https://lightningcss.dev/) bundles `src/css/citizen.css` and `src/css/common.css` (resolving `@import` chains) and compiles modern CSS for browsers with ≥ 0.25% global usage share.

**JS/TS** — [tsup](https://tsup.egoist.dev/) (backed by esbuild) compiles `src/ts/citizen.ts` and `src/ts/common.ts` to IIFE bundles targeting Chrome 120. Provides MediaWiki API type information. Several syntax features that MediaWiki's ResourceLoader linter rejects are explicitly downleveled:

| Feature | Compiled to |
|---------|-------------|
| Private fields / methods (`#x`) | WeakMap helpers |
| Nullish coalescing (`??`) | ternary |
| Optional chaining (`?.`) | `&&`-chain |
| Public class fields | constructor assignment |

`mediawiki`, `jquery`, and `oojs` are treated as externals so they provide type information.

Comments are preserved to indicate wiki editors where to find the original source code.

Although the JS/TS linter will try its best to make it compatible (by transforming code and using pollyfills), the Oxc linter will warn you, which will result in more predictable and cleaner code.

## To-do
- Implement testing with Vitest (requires mocking MediaWiki API)
- Migrate to tsdown when rolldown matures enough (it bundles well, but downleveling is hard)
- Refactor this PoC into an agnostic package
- Add client-side scripts that link back to GitHub