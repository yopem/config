---
"@yopem/prettier-config": patch
"@yopem/eslint-config": patch
---

chore: update dependencies to use workspace versions

Updated various package dependencies to use workspace versions:

- Changed @yopem/typescript-config to workspace:\* in bun.lock,
  packages/eslint/package.json, and packages/prettier/package.json.
- Updated @ianvs/prettier-plugin-sort-imports, prettier, and
  prettier-plugin-tailwindcss to latest versions in bun.lock.
- Updated typescript to latest version in bun.lock.
