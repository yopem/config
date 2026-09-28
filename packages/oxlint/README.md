# @yopem/oxlint-config

Shared Oxlint rules, including `quality/*`, `stylistic/*`, and `effect/*`. All rules are enabled at error severity alongside the existing ESLint, TypeScript, Tailwind, and formatter rules.

## Installation

````sh
```sh
npm install @yopem/eslint-config
# or
pnpm add @yopem/eslint-config
# or
yarn add @yopem/eslint-config
# or
bun add @yopem/eslint-config
# or
deno install npm:@yopem/eslint-config
````

## Extend

Add `.oxlintrc.json` to your project root:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": ["./node_modules/@yopem/oxlint-config/src/.oxlintrc.json"]
}
```

Oxlint requires a file path in JSON `extends`; `"@yopem/oxlint-config"` alone is not supported. The path above is relative to your project's `.oxlintrc.json`. Merge project-specific rules in the same file:

```json
{
  "extends": ["./node_modules/@yopem/oxlint-config/src/.oxlintrc.json"],
  "rules": {
    "effect/prefer-effect-match": "off",
    "quality/no-module-mocking": "warn"
  }
}
```

Run `bunx oxlint .` (or `npx oxlint .`). `effect/*` rules are included by default; turn individual rules off if your project does not use Effect. `quality/no-reduce-accumulator-copy` is paired with Oxlint's `oxc/no-accumulating-spread`.

## Credits

Rules and required helpers adapted from [Dillon Mulroy's anti-slop project](https://github.com/dmmulroy/anti-slop), licensed under MIT (Copyright © 2026 Dillon Mulroy). Source revision: [`c44ef22`](https://github.com/dmmulroy/anti-slop/tree/c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b/src). Plugin names and entry points are renamed to `quality`, `stylistic`, and `effect`; upstream tests and skill assets are not bundled. Upstream license: [`src/LICENSE`](src/LICENSE). Vendored ESLint Stylistic license: [`src/vendor/eslint-stylistic/LICENSE`](src/vendor/eslint-stylistic/LICENSE).

## License

This project is licensed under the terms of the [MIT license](https://github.com/yopem/config/blob/main/LICENSE.md).
