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

`react-policy/no-restricted-hooks` rejects calls to React's `useCallback`,
`useMemo`, and `useEffect`. Named imports of these hooks are also rejected. Use
derived values, event handlers, framework APIs, and React Compiler.

`react-policy/require-export-function` requires inline named `export function`
declarations for recognized components and hooks.
`react-policy/no-query-result-spread` rejects spreads of recognized TanStack
Query and mutation results. These are syntax checks, not complete React type
analysis. See the policy limits below.

`react/unsupported-syntax` enables the compiler restriction outside the base
correctness category. Keep the application's React Compiler integration. Lint
checks do not enable the build transform.

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

## Instruction coverage

Source policies use the existing base and React presets. No extra preset is
needed. These checks are stricter than earlier releases. They can report
existing dynamic imports, barrel modules, environment reads, React hooks, and
component declarations.

Next.js route files and some framework files need default exports. Add narrow
file overrides for `react-policy/require-export-function` where the framework
requires a different declaration. Keep the rule active in ordinary React
modules. The standard composition examples above target Oxlint. Verify plugin
and configuration support before using them with native Bun lint or Vite+.

### Checks moved from instructions

| Instruction                                                            | Check                                                                   | Coverage                                                                                                      |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| No `any`, double assertions, or casts that replace validation          | Base TypeScript rules and `quality/*` assertion rules                   | Syntax and configured type checks; runtime validation still needs review                                      |
| Prefer `const`; no `console.log`                                       | Base `prefer-const`, `no-var`, `no-console`                             | Allows `console.error`, `console.warn`, and `console.info`                                                    |
| Use static imports                                                     | Base `quality/no-dynamic-import`                                        | Rejects all dynamic imports, not just awaited imports; static type imports remain allowed                     |
| No re-export-only barrel modules                                       | Base `quality/no-reexport-only-modules`                                 | Checks export-from and import-then-export forwarding; local declarations and side-effect imports are allowed  |
| Read environment values in one adapter                                 | Base `quality/no-environment-access`                                    | Checks direct `process.env`, `Bun.env`, `import.meta.env`, runtime import aliases, and variable destructuring |
| Prefer declarations over named function expressions                    | Base `func-style`                                                       | Arrow functions remain allowed; React declaration checks are separate                                         |
| Components and hooks use inline `export function`, not default exports | React `react-policy/require-export-function`                            | Checks source-level components and hooks; see limits below                                                    |
| No `useEffect`, `useCallback`, or `useMemo`                            | React import restrictions and `react-policy/no-restricted-hooks`        | Rejects named React imports and proven hook calls                                                             |
| Never spread query or mutation results                                 | React `react-policy/no-query-result-spread`                             | Tracks supported imported hooks and immutable local aliases; option objects remain allowed                    |
| No type-check escape comments or unsafe narrowing casts                | Base `typescript/ban-ts-comment`, `typescript/no-unsafe-type-assertion` | Type-aware assertion checks; described `@ts-expect-error` remains available for justified negative cases      |
| No parent-relative imports                                             | Base `import/no-relative-parent-imports`                                | Import resolution must match the project                                                                      |
| Effect tagged values and errors use Effect APIs                        | Effect preset `effect/*`                                                | Does not prove that all errors are typed or all resources are scoped                                          |
| Accessibility and React correctness                                    | React/framework presets                                                 | Static checks only; keyboard and screen-reader workflows need QA                                              |
| Formatting and import order                                            | Oxfmt configuration                                                     | Run the formatter; Oxlint alone does not apply project formatting                                             |

The environment rule is off in `**/env.ts` and `**/env/**`. Replace these
exceptions with the project's actual adapter paths if they differ. Keep the
adapter small: an allowed path is not proof that configuration is validated or
safe for browser use. The rule does not track assignment aliases, dynamic
property names, destructuring assignments, or Cloudflare bindings named by the
application. Type-only imports are allowed.

The query-result rule recognizes five imported React Query hooks and immutable
local result aliases. It does not follow properties, arrays from `useQueries`,
or results returned across function boundaries. The component rule uses JSX and
hook-name evidence. It does not resolve `memo` or `forwardRef` wrappers.

The barrel rule checks syntax, not purpose. A module with a local declaration
can still be a needless forwarding layer. The function rules do not prove that a
component has one responsibility. Wrappers, generated code, and framework
exports need project-specific review and scope.

### Project-specific boundaries

Keep architecture restrictions in project configuration. Workspace names, source
aliases, route paths, and runtime entrypoints differ between the six instruction
templates. Do not assume that one application's import paths apply to another
application.

Use `no-restricted-imports` with file overrides for these boundaries:

- Browser sources must not import database, server, or runtime adapters.
- Database runtime imports belong in database modules.
- Shared RPC contracts must not import server implementations.
- Platform adapters must not import feature handlers.
- Domain services must not import runtime runners or concrete service assembly.
- Effect applications must not import Hono, Zod, or parallel validators.
- Hono applications must use their selected schema and RPC libraries.

Cover real package names, subpaths, aliases, and relative paths. Allow type-only
imports only where the contract permits them. Test accepted and rejected paths
with the application's resolver. A string-pattern restriction does not prove
transitive browser safety. Effect version selection, package versions, lockfile
ownership, Dockerfiles, task caching, and deployment resources need manifest or
CI checks, not a JavaScript AST rule.

Use the existing Yopem UI lint plugin for StyleX, semantic tokens, and copied
component rules. Do not duplicate those checks here. Keep React Compiler lint
checks in the application's supported integration; React Doctor alone is not a
replacement.

### Instructions that must stay

The source review covered these six templates (7,011 lines total) in
`Resources/Agents Instructions`: `Bun Effect Monorepo.md`,
`Bun Hono Monorepo.md`, `Node Workers Effect Monorepo.md`,
`bun-effect-standalone.md`, `bun-hono-standalone.md`, and
`node-workers-effect-standalone.md`.

Keep these instruction groups. Static lint cannot enforce them completely:

- Scope, user approval, code discovery, preservation of user changes, and
  dependency installation policy.
- Business names, clear workflow order, useful abstractions, actual reuse,
  component responsibility, and decisions about when to split modules.
- Stack selection, pinned API compatibility, repository layout, process count,
  single-origin routing, build output, and deployment ownership.
- Authorization, tenant isolation, safe redirects, token lifecycle, cookies,
  secret handling, SQL safety, idempotency, cache isolation, and recovery.
- Effect resource lifetime, bounded concurrency, retries, durable jobs, and
  request-scoped credentials.
- Route composition, query ownership, meaningful loading/error states,
  accessibility behavior, and runtime performance.
- QA approval, scenario design, isolated data, evidence, generated-file safety,
  commit scope, license preservation, and final handoff.

Do not replace these with arbitrary line-count, complexity, naming, or comment
limits. Those limits do not prove code quality. Do not delete instructions
merely because a nearby lint rule has a similar name.

### Existing policy differences

Some older base rules are stricter than the templates. In particular,
`quality/no-runtime-typeof`, the `unknown` parameter rules, and dictionary-type
rules can reject valid narrowing or untrusted-input contracts. Effect matching
rules also use syntax patterns, not proof that a branch needs Effect Match.
These existing rules are unchanged. Review these differences before removing
boundary-validation or simple-control-flow guidance from instructions.

### Short instruction block

After project configuration and its boundary checks pass, replace repeated
syntax and formatting instructions with a block like this:

```text
Use the project's configured formatter, type checks, and lint presets.
Fix violations in source. Do not weaken checks or add broad suppressions.
Keep changes within the request. Preserve unrelated work and generated files.
Use existing modules and the selected stack. Verify pinned APIs before use.
Keep workflows clear. Add layers or shared modules only for actual needs.
Enforce server/browser, domain, and environment boundaries in project config.
Review authorization, secrets, validation, resource lifetime, and data safety.
Follow this project's QA approval, evidence, deployment, and commit rules.
Report checks run, checks not run, enforcement gaps, and remaining risks.
```

Keep stack-specific setup and security contracts in project documentation.
Reference their paths from `AGENTS.md` instead of copying every example into all
six templates. Do not remove the detailed policy until the replacement checks
run in the actual project. The original note files are not changed by this
package.

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
