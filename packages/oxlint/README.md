# @yopem/oxlint-config

Shared Oxlint rules, including `quality/*` and `stylistic/*`, alongside ESLint,
TypeScript, and formatter rules. React, Next.js, React Native, TanStack Start,
and Effect presets are opt-in. Each React framework preset includes React
Doctor's recommended rules.

## Installation

```sh
npm install @yopem/oxlint-config
# or
pnpm add @yopem/oxlint-config
# or
yarn add @yopem/oxlint-config
# or
bun add @yopem/oxlint-config
# or
deno install npm:@yopem/oxlint-config
```

## Extend

Add `oxlint.config.ts` to your project root:

```ts
import baseConfig from "@yopem/oxlint-config"

export default {
  extends: [baseConfig],
  rules: { "quality/no-module-mocking": "warn" },
}
```

Run `oxlint .` to lint. `quality/no-reduce-accumulator-copy` is paired with
Oxlint's `oxc/no-accumulating-spread`.

### React (optional)

Add the React preset alongside base:

```ts
import baseConfig from "@yopem/oxlint-config"
import reactConfig from "@yopem/oxlint-config/react"

export default { extends: [baseConfig, reactConfig] }
```

This enables `jsx-a11y`, `react`, and `react-perf`, plus React Doctor's
`RECOMMENDED_RULES` and `TANSTACK_QUERY_RULES`.

### Next.js (optional)

Add the Next.js preset alongside base and React:

```ts
import baseConfig from "@yopem/oxlint-config"
import reactConfig from "@yopem/oxlint-config/react"
import nextjsConfig from "@yopem/oxlint-config/nextjs"

export default { extends: [baseConfig, reactConfig, nextjsConfig] }
```

This enables `nextjs`, plus React Doctor's `RECOMMENDED_RULES` and
`NEXTJS_RULES`.

### React Native (optional)

```ts
import baseConfig from "@yopem/oxlint-config"
import reactNativeConfig from "@yopem/oxlint-config/react-native"

export default { extends: [baseConfig, reactNativeConfig] }
```

This enables React Doctor's `RECOMMENDED_RULES` and `REACT_NATIVE_RULES`,
including Expo rules, without enabling Oxlint's DOM accessibility plugin.

### TanStack Start (optional)

```ts
import baseConfig from "@yopem/oxlint-config"
import reactConfig from "@yopem/oxlint-config/react"
import tanstackStartConfig from "@yopem/oxlint-config/tanstack-start"

export default { extends: [baseConfig, reactConfig, tanstackStartConfig] }
```

This adds React Doctor's `RECOMMENDED_RULES` and `TANSTACK_START_RULES`. The
React preset supplies TanStack Query rules.

### React Doctor rules

All four framework presets use the upstream exported rule maps at their
warning/error severities. Upstream opt-in rules and Preact rules are not
enabled. `react-doctor/react-in-jsx-scope`, `react-doctor/jsx-no-jsx-as-prop`,
`react-doctor/jsx-max-depth`, and `react-doctor/only-export-components` are
disabled in every preset. Override individual rules in your project's `rules`
when needed.

`react-doctor/jsx-props-no-spreading` is enabled at warning severity. Direct
`props(...)` calls imported from `@stylexjs/stylex`, including namespace,
default, and named import aliases, are allowed; other prop spreads remain
checked. Existing `jsxPropsNoSpreading` settings remain supported.

In files importing `@stylexjs/stylex` (including type-only imports),
`react-doctor/jsx-no-new-array-as-prop` ignores `xstyle` attributes. Inline
StyleX composition arrays do not require `useMemo` to satisfy this rule. Other
array-valued props remain checked. These exceptions are supplied by this
package's framework presets, not the standalone React Doctor CLI.

Project-level security scans and project-analysis checks do not run in the
standalone plugin; use the React Doctor CLI for those checks.

### Effect (optional)

Add the Effect preset alongside base (and any other presets):

```ts
import baseConfig from "@yopem/oxlint-config"
import effectConfig from "@yopem/oxlint-config/effect"

export default { extends: [baseConfig, effectConfig] }
```

This enables `effect/*`.

## Credits

Thanks to
[Dillon Mulroy's anti-slop project](https://github.com/dmmulroy/anti-slop) for
the adapted rules and helpers (source revision:
[`c44ef22`](https://github.com/dmmulroy/anti-slop/tree/c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b/src)),
and to [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
for the vendored rule. Plugin names and entry points are renamed to `quality`,
`stylistic`, and `effect`; upstream tests and skill assets are not bundled.

## License

This package is licensed under the terms of the [MIT license](LICENSE.md),
including notices for the credited upstream projects.
