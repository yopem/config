# @yopem/prettier-config

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
