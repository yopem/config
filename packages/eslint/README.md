# @yopem/eslint-config

The base config uses `@yopem/eslint-plugin` for shared custom rules. Oxlint
uses the same package. Core and typed rules use each engine's native checks.

```js
import base from "@yopem/eslint-config/base"
import react from "@yopem/eslint-config/react"

export default [...base, ...react]
```

Other presets: `/nextjs`, `/effect`, `/react-native`, and `/tanstack-start`.
Typed files need a TypeScript project. JavaScript files do not use typed
linting. See the plugin README for Bun setup and native rule differences.

Yopem ESLint configuration.

## Installation

```sh
npm install @yopem/eslint-config
# or
pnpm add @yopem/eslint-config
# or
yarn add @yopem/eslint-config
# or
bun add @yopem/eslint-config
```

## Licence

This project is licensed under the terms of the
[MIT license](https://github.com/yopem/config/blob/main/LICENSE.md).
