# @yopem/oxfmt-config

Yopem oxfmt configuration.

## Installation

```sh
npm install @yopem/oxfmt-config
# or
pnpm add @yopem/oxfmt-config
# or
yarn add @yopem/oxfmt-config
# or
bun add @yopem/oxfmt-config
```

## Usage

Use the JSON config at `@yopem/oxfmt-config`. You can also use the
`@yopem/oxfmt-config/oxfmtrc.json` path.

For a JavaScript or TypeScript Oxfmt config, import the shared config:

```ts
import config from "@yopem/oxfmt-config/config"

export default config
```

## Bun formatter

Copy `node_modules/@yopem/oxfmt-config/bunfig.toml` to your project root. If
your project already has a `bunfig.toml`, add the `[fmt]` tables from the file
to it. Then run `bun fmt` or `bun fmt --check`. You need a Bun version that
supports `bun fmt`.

Bun and Oxfmt can format files differently. Bun also reads other formatter
config files. Check the result when you use this template with an existing
config. Tailwind class sorting needs Tailwind CSS in the consuming project.

## Licence

This project is licensed under the terms of the
[MIT license](https://github.com/yopem/config/blob/main/LICENSE.md).
