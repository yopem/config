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
```

## Extend

Add `oxlint.config.ts` to your project root:

```ts
import baseConfig from "@yopem/oxlint-config"

export default {
  extends: [baseConfig],
  options: baseConfig.options,
  rules: { "quality/no-module-mocking": "warn" },
}
```

Run `oxlint .` to lint. Base sets `options.typeAware` and `options.typeCheck` to
`true`. Oxlint uses `oxlint-tsgolint`, which this package includes, for these
checks. Your project needs a `tsconfig.json`.

Oxlint reads these options from the root config only. Set
`options: baseConfig.options` when you use `extends`, as shown above. To turn
these checks off, set both options to `false` in your root config.

`quality/no-reduce-accumulator-copy` is paired with Oxlint's
`oxc/no-accumulating-spread`.

`quality/prefer-arrow-for-anonymous-functions` is an error in base. Use arrow
functions for anonymous function expressions, including callbacks. Named
functions, methods, accessors, and generators are allowed. The rule does not
check function declarations. It has no automatic fix: arrows change `this` and
`arguments`. Use a named function when you need these bindings.

Arrow functions with or without parameter parentheses are allowed:

```ts
const getCount = () => 0
const getValue = (value: number) => value
const handleReset = useEventCallback(() => {
  setPressCount(0)
})
```

Anonymous `function () {}` expressions are not allowed:

```ts
const getCount = function () {
  return 0
}
```

### Type assertions at data boundaries

Base enables these rules as errors:

- `quality/no-json-parse-type-assertion`: Do not cast a direct global
  `JSON.parse(...)` result to a domain type. Validate parsed data first. Local
  or imported objects named `JSON` are not checked.
- `quality/no-catch-variable-type-assertion`: Do not cast a catch binding to
  `Error` or another type. Use a type guard or a validator. This includes
  destructured catch bindings and references inside nested functions.

Both rules check `as` and angle-bracket assertions, including parentheses and
assertion chains. An assertion to `unknown` is allowed. They do not track values
through aliases, inspect catch properties, or check validator results. Neither
rule has an automatic fix: validation needs a runtime check.

```ts
// Not allowed:
const user = JSON.parse(text) as User

// Validate instead:
const user = userSchema.parse(JSON.parse(text))

try {
  run()
} catch (error) {
  if (error instanceof Error) {
    report(error.message)
  }
}
```

### React (optional)

Add the React preset alongside base:

```ts
import baseConfig from "@yopem/oxlint-config"
import reactConfig from "@yopem/oxlint-config/react"

export default {
  extends: [baseConfig, reactConfig],
  options: baseConfig.options,
}
```

This enables `jsx-a11y`, `react`, and `react-perf`, plus React Doctor's
`RECOMMENDED_RULES` and `TANSTACK_QUERY_RULES`.

`react-policy/no-restricted-hooks` warns on `useCallback` and `useMemo` calls.
The `useEffect` restriction is off by default. To enable it, add:

```ts
rules: {
  "react-policy/no-restricted-hooks": ["warn", { restrictUseEffect: true }],
}
```

### Next.js (optional)

Add the Next.js preset alongside base and React:

```ts
import baseConfig from "@yopem/oxlint-config"
import nextjsConfig from "@yopem/oxlint-config/nextjs"
import reactConfig from "@yopem/oxlint-config/react"

export default {
  extends: [baseConfig, reactConfig, nextjsConfig],
  options: baseConfig.options,
}
```

This enables `nextjs`, plus React Doctor's `RECOMMENDED_RULES` and
`NEXTJS_RULES`.

### React Native (optional)

```ts
import baseConfig from "@yopem/oxlint-config"
import reactNativeConfig from "@yopem/oxlint-config/react-native"

export default {
  extends: [baseConfig, reactNativeConfig],
  options: baseConfig.options,
}
```

This enables React Doctor's `RECOMMENDED_RULES` and `REACT_NATIVE_RULES`,
including Expo rules, without enabling Oxlint's DOM accessibility plugin.

### TanStack Start (optional)

```ts
import baseConfig from "@yopem/oxlint-config"
import reactConfig from "@yopem/oxlint-config/react"
import tanstackStartConfig from "@yopem/oxlint-config/tanstack-start"

export default {
  extends: [baseConfig, reactConfig, tanstackStartConfig],
  options: baseConfig.options,
}
```

This adds React Doctor's `RECOMMENDED_RULES` and `TANSTACK_START_RULES`. The
React preset supplies TanStack Query rules.

### React Doctor rules

All four framework presets use the upstream exported rule maps at their
warning/error severities. Upstream opt-in rules and Preact rules are not
enabled. `react-doctor/react-in-jsx-scope`, `react-doctor/jsx-no-jsx-as-prop`,
`react-doctor/jsx-max-depth`, `react-doctor/only-export-components`, and
`react-doctor/context-provider-value-from-unmemoized-local-literal` are disabled
in every preset. Override individual rules in your project's `rules` when
needed.

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

export default {
  extends: [baseConfig, effectConfig],
  options: baseConfig.options,
}
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
