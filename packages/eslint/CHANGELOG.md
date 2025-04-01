# @yopem/eslint-config

## 0.1.11

### Patch Changes

- [#63](https://github.com/yopem/tooling/pull/63)
  [`39bf0c4`](https://github.com/yopem/tooling/commit/39bf0c47fff6373c3e86ed435109a51dd41cf49d)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `@next/eslint-plugin-next` to `15.2.4`.

## 0.1.10

### Patch Changes

- [#57](https://github.com/yopem/tooling/pull/57)
  [`a4c7926`](https://github.com/yopem/tooling/commit/a4c7926f2c39cbf1be7448bba4ac634ac5f7c106)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `@next/eslint-plugin-next` to `15.2.4`.

- [#58](https://github.com/yopem/tooling/pull/58)
  [`fb7237b`](https://github.com/yopem/tooling/commit/fb7237bc06837af34c0805e285f796ab90d5de8e)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `eslint-plugin-prettier` to `5.2.5`.

- [#61](https://github.com/yopem/tooling/pull/61)
  [`47086a0`](https://github.com/yopem/tooling/commit/47086a08cce146c7bf68f1f1a64f9d6540efabdb)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `eslint` to `9.23.0`. Updated dependency `@eslint/js` to `9.23.0`.

- [#60](https://github.com/yopem/tooling/pull/60)
  [`a315fbd`](https://github.com/yopem/tooling/commit/a315fbda02411443b723a38334f193951726a6c0)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `typescript-eslint` to `8.28.0`.

## 0.1.9

### Patch Changes

- [#52](https://github.com/yopem/tooling/pull/52)
  [`55136d8`](https://github.com/yopem/tooling/commit/55136d8a90391d5a255a920ee0ca55aa3f7d29c4)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `@next/eslint-plugin-next` to `15.2.3`.

- [#54](https://github.com/yopem/tooling/pull/54)
  [`e6be48e`](https://github.com/yopem/tooling/commit/e6be48e9dc2036a2b630cdd36e5e82279d84b065)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `eslint` to `9.22.0`. Updated dependency `@eslint/js` to `9.22.0`.

- [#53](https://github.com/yopem/tooling/pull/53)
  [`692830d`](https://github.com/yopem/tooling/commit/692830d2d9d21e756adcb8b2d46421632f17fbf5)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `typescript-eslint` to `8.26.1`.

## 0.1.8

### Patch Changes

- [`15ec070`](https://github.com/yopem/tooling/commit/15ec07066d60d113509d23f964a7fc27697f001e)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - chore(eslint):
  disable no-unsafe-return typescript rule

  Disables the TypeScript ESLint rule that warns about returning any typed
  values, consistent with other disabled unsafe rules in the configuration.

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
