# @yopem/oxlint-config

Shared Oxlint rules, including `quality/*` and `stylistic/*`, alongside ESLint, TypeScript, and formatter rules. Effect and Tailwind CSS rules are opt-in.

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

### Effect (optional)

In an Effect project, use the Effect preset instead of the base preset:

```ts
import effectConfig from "@yopem/oxlint-config/effect";

export default { extends: [effectConfig] };
```

This includes every base rule plus `effect/*`. Non-Effect projects keep the base preset.

### Tailwind CSS (optional)

In a Tailwind project, use the Tailwind preset instead of the base preset:

```ts
import tailwindConfig from "@yopem/oxlint-config/tailwindcss";

export default { extends: [tailwindConfig] };
```

This includes every base rule plus `better-tailwindcss/*`. The plugin is an optional dependency of this package, installed automatically by default; if your package manager did not install it, add `eslint-plugin-better-tailwindcss` to your Tailwind project. Your Tailwind project also needs `tailwindcss` installed. The preset expects `./src/styles/globals.css`; override `settings.better-tailwindcss.entryPoint` in your own config if the CSS entry point differs.

Non-Tailwind projects should keep the base preset: it never loads the Tailwind plugin, even if the optional dependency was installed.

## Credits

Thanks to [Dillon Mulroy's anti-slop project](https://github.com/dmmulroy/anti-slop) for the adapted rules and helpers (source revision: [`c44ef22`](https://github.com/dmmulroy/anti-slop/tree/c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b/src)), and to [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic) for the vendored rule. Plugin names and entry points are renamed to `quality`, `stylistic`, and `effect`; upstream tests and skill assets are not bundled.

## License

This package is licensed under the terms of the [MIT license](LICENSE.md), including notices for the credited upstream projects.
