import { writeFile } from "node:fs/promises"

import config from "./index.ts"

const {
  $schema: _schema,
  experimentalSortPackageJson,
  experimentalTailwindcss,
  sortImports,
  ...options
} = config

const lines = [
  "# Generated from the Oxfmt config. Run bun run sync:bun to update.",
  "[fmt]",
  ...Object.entries(options).map(
    ([key, value]) => `${key} = ${JSON.stringify(value)}`,
  ),
  `sortPackageJson = ${JSON.stringify(experimentalSortPackageJson)}`,
  "",
  "[fmt.sortImports]",
  ...Object.entries(sortImports).map(
    ([key, value]) => `${key} = ${JSON.stringify(value)}`,
  ),
  "",
  "[fmt.sortTailwindcss]",
  ...Object.entries(experimentalTailwindcss).map(
    ([key, value]) => `${key} = ${JSON.stringify(value)}`,
  ),
  "",
]

await Promise.all([
  writeFile(
    new URL("../src/.oxfmtrc.json", import.meta.url),
    `${JSON.stringify(config, null, 2)}\n`,
  ),
  writeFile(new URL("../bunfig.toml", import.meta.url), lines.join("\n")),
])
