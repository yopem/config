# @yopem/oxlint-config

Shared Oxlint rules, including `quality/*` and `stylistic/*`, alongside ESLint, TypeScript, and formatter rules. React, Next.js, and Effect plugins are opt-in.

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
import baseConfig from "@yopem/oxlint-config";

export default {
  extends: [baseConfig],
  rules: { "quality/no-module-mocking": "warn" },
};
```

Run `oxlint .` to lint. `quality/no-reduce-accumulator-copy` is paired with Oxlint's `oxc/no-accumulating-spread`.

### React (optional)

Add the React preset alongside base:

```ts
import baseConfig from "@yopem/oxlint-config";
import reactConfig from "@yopem/oxlint-config/react";

export default { extends: [baseConfig, reactConfig] };
```

This enables `jsx-a11y`, `react`, and `react-perf`.

### Next.js (optional)

Add the Next.js preset alongside base and React:

```ts
import baseConfig from "@yopem/oxlint-config";
import reactConfig from "@yopem/oxlint-config/react";
import nextjsConfig from "@yopem/oxlint-config/nextjs";

export default { extends: [baseConfig, reactConfig, nextjsConfig] };
```

This enables `nextjs` without implicitly enabling other plugins.

### Effect (optional)

Add the Effect preset alongside base (and any other presets):

```ts
import baseConfig from "@yopem/oxlint-config";
import effectConfig from "@yopem/oxlint-config/effect";

export default { extends: [baseConfig, effectConfig] };
```

This enables `effect/*`.

## Credits

Thanks to [Dillon Mulroy's anti-slop project](https://github.com/dmmulroy/anti-slop) for the adapted rules and helpers (source revision: [`c44ef22`](https://github.com/dmmulroy/anti-slop/tree/c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b/src)), and to [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic) for the vendored rule. Plugin names and entry points are renamed to `quality`, `stylistic`, and `effect`; upstream tests and skill assets are not bundled.

## License

This package is licensed under the terms of the [MIT license](LICENSE.md), including notices for the credited upstream projects.
