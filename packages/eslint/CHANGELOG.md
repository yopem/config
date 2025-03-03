# @yopem/eslint-config

## 0.1.7

### Patch Changes

- [`4701431`](https://github.com/yopem/tooling/commit/4701431d627bef2053c320a92f62676b29fd7b4d)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - revert(eslint):
  remove eslint-config-next

  Replace eslint-config-next with direct configuration using
  @next/eslint-plugin-next. This removes unnecessary dependencies while
  maintaining the same linting rules for Next.js projects.

  The change also updates peer dependency version ranges to be more flexible
  using the ^ prefix.

## 0.1.6

### Patch Changes

- [`81df8a6`](https://github.com/yopem/tooling/commit/81df8a6a55bd4a972456f0648dc8f7a5ff3733a6)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(eslint): add
  eslint-config-next for improved Next.js linting

  Adds the official eslint-config-next package which provides specialized
  linting rules for Next.js applications. This enhances our ESLint setup with
  Next.js-specific best practices and optimizations.

  - Add eslint-config-next dependency
  - Import and apply Next.js config rules
  - Update peer dependencies to use caret ranges

## 0.1.5

### Patch Changes

- [`784f3d4`](https://github.com/yopem/tooling/commit/784f3d40bbdb2ed16d3af1428007d0f35547e293)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(eslint): add
  peer dependencies

  Add eslint-plugin-turbo as a dev dependency and include essential ESLint peer
  dependencies to ensure proper functioning and compatibility with other tools.

## 0.1.4

### Patch Changes

- [`dabd250`](https://github.com/yopem/tooling/commit/dabd2502ff436cf94c4367e60f1ce0a5ec41f199)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - Replace
  @types/eslint\_\_js with @types/eslint package to align with correct

## 0.1.3

### Patch Changes

- [`f1e97af`](https://github.com/yopem/tooling/commit/f1e97af56ba714ea7aa737d3b4409bdc096e9647)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - chore(deps): remove
  eslint-plugin-tailwindcss

## 0.1.2

### Patch Changes

- [`63e1cb2`](https://github.com/yopem/tooling/commit/63e1cb219dc1bb6de722db004b5648c1ba00b34f)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - chore: update
  dependencies to use workspace versions

  Updated various package dependencies to use workspace versions:

  - Changed @yopem/typescript-config to workspace:\* in bun.lock,
    packages/eslint/package.json, and packages/prettier/package.json.
  - Updated @ianvs/prettier-plugin-sort-imports, prettier, and
    prettier-plugin-tailwindcss to latest versions in bun.lock.
  - Updated typescript to latest version in bun.lock.

## 0.1.1

### Patch Changes

- 054d2de: update eslint config dependencies
