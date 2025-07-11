# @yopem/prettier-config

## 0.1.8

### Patch Changes

- [#121](https://github.com/yopem/tooling/pull/121)
  [`9acbf22`](https://github.com/yopem/tooling/commit/9acbf22308c2f3444163d088e33a8ab44db1bbf4)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `@ianvs/prettier-plugin-sort-imports` to `4.5.1`.

- [#120](https://github.com/yopem/tooling/pull/120)
  [`28122aa`](https://github.com/yopem/tooling/commit/28122aa982a10c5634851b4183999d272d54b13c)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `prettier-plugin-tailwindcss` to `0.6.14`.

## 0.1.7

### Patch Changes

- [`1206ad9`](https://github.com/yopem/tooling/commit/1206ad9e2dbdcd92f5e0528698d22671a3d3413d)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(prettier): add
  support for JSONC files

  Added configuration for JSONC files in Prettier. This includes specifying
  `trailingComma` as "none" for JSONC files in both `base.js` and `react.js`.

## 0.1.6

### Patch Changes

- [#100](https://github.com/yopem/tooling/pull/100)
  [`cd7a98f`](https://github.com/yopem/tooling/commit/cd7a98f45c3cf5b7b4c20cd223a78f302407d85c)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `prettier-plugin-tailwindcss` to `0.6.12`.

## 0.1.5

### Patch Changes

- [#95](https://github.com/yopem/tooling/pull/95)
  [`d8c9f9f`](https://github.com/yopem/tooling/commit/d8c9f9ff2b70ae99297367a6ce50116702d91bf2)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `@ianvs/prettier-plugin-sort-imports` to `4.4.2`.

## 0.1.4

### Patch Changes

- [#78](https://github.com/yopem/tooling/pull/78)
  [`6c1f7b3`](https://github.com/yopem/tooling/commit/6c1f7b3a47540214dfcfbb991e6af2f36c399ea2)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `typescript` to `5.8.3`.

## 0.1.3

### Patch Changes

- [`5fa853f`](https://github.com/yopem/tooling/commit/5fa853f7f2007dfc53a0fdb4bc9e417d2a4ad77d)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(packages): add
  tailwindcss plugin to prettier deps

## 0.1.2

### Patch Changes

- [`1fbad2a`](https://github.com/yopem/tooling/commit/1fbad2a1d6ce0edc36e31605ebabc5454ac6e718)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(prettier): add
  peer dependencies

  Add explicit peer dependencies for prettier and import sort plugin to ensure
  consistent versioning across projects using this package.

## 0.1.1

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
