# @yopem/eslint-plugin

Shared custom rules for Bun lint, ESLint, and Oxlint. The ESLint and Oxlint
config packages use the same rules and preset policies from this package.

## Install

```sh
bun add -d @yopem/eslint-plugin
```

## Bun lint

Use the package paths in `bunfig.toml`. No local JavaScript config is needed.

```toml
[lint]
plugins = [
  { name = "quality", specifier = "@yopem/eslint-plugin/quality" },
  { name = "stylistic", specifier = "@yopem/eslint-plugin/stylistic" },
  { name = "effect", specifier = "@yopem/eslint-plugin/effect" },
]

[lint.rules]
"quality/no-object-parameters" = "error"
"stylistic/require-readable-spacing" = "error"
"effect/prefer-effect-match" = "error"
```

The example enables three rules, not the full config. Bun does not enable a
plugin's recommended config when it loads the plugin. Set each required rule in
`[lint.rules]`. The exports from `@yopem/eslint-plugin/policies` list the base,
Effect, React, Next.js, React Native, and TanStack Start policies.

The package also exports `/react-policy` and `/react-doctor` plugins. Use the
same named-specifier format for these paths.

Bun runs its core, TypeScript, import, Promise, Unicorn, and Oxc rules natively.
Keep these rule names in the Bun config. Set `typeAware` and `typeCheck` when
needed. Bun does not need `typescript-eslint`. The custom rules use syntax and
scope data, not a TypeScript type checker.

## ESLint

```js
import yopem from "@yopem/eslint-plugin"

export default [...yopem.configs.recommended, ...yopem.configs.react]
```

These plugin presets enable custom rules only. For core and typed rules, use
`@yopem/eslint-config/base` with its optional `/react`, `/nextjs`, `/effect`,
`/react-native`, or `/tanstack-start` preset. The ESLint config needs
`typescript-eslint` for parsing and typed rules.

## Oxlint

`@yopem/oxlint-config` loads these plugins and shared policies. Existing
`@yopem/oxlint-config/plugins/*` paths remain available.

For manual setup, use `jsPlugins` with a plugin name and a package specifier.
Enable the required rules in the config's `rules` table.

## Engine differences

All custom rule implementations are shared. The ESLint config maps
`typescript/*` rules to `@typescript-eslint/*`. It uses TypeScript extension
rules instead of duplicate core rules where available.

Native rule sets remain engine-specific. ESLint's recommended presets do not
exactly match Oxlint's `correctness` category. In particular,
`oxc/no-accumulating-spread` has no ESLint implementation in this package. The
custom `quality/no-reduce-accumulator-copy` rule is not a replacement: it does
not cover all accumulating-spread cases.

## License

This package is licensed under the terms of the [MIT license](LICENSE.md),
including notices for the credited upstream projects.
