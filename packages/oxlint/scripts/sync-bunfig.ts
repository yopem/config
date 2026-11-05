import { writeFile } from "node:fs/promises"

import { baseRules, ignorePatterns } from "../../eslint-plugin/src/policies.ts"
import baseConfig from "../src/index.ts"

function toToml(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(toToml).join(", ")}]`
  }

  if (value !== null && typeof value === "object") {
    return `{ ${Object.entries(value)
      .map(([key, entry]) => `${JSON.stringify(key)} = ${toToml(entry)}`)
      .join(", ")} }`
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value)
  }

  throw new TypeError("Unsupported Bun config value")
}

export const additionalRules = {
  "bun:test/*": "off",
  "react/*": "off",
  "react/jsx-uses-react": "off",
  "typescript/no-meaningless-void-operator": "error",
  "typescript/no-unnecessary-parameter-property-assignment": "error",
  "typescript/no-useless-default-assignment": "error",
  "typescript/no-useless-empty-export": "error",
  "typescript/require-array-sort-compare": "error",
  "typescript/restrict-template-expressions": "error",
  "typescript/unbound-method": "error",
}

const plugins = [
  "eslint-plugin-oxfmt",
  { name: "quality", specifier: "@yopem/eslint-plugin/quality" },
  { name: "stylistic", specifier: "@yopem/eslint-plugin/stylistic" },
]

const lines = [
  "# Generated from the default Oxlint config. Run bun run sync:bun to update.",
  "[lint]",
  `plugins = ${toToml(plugins)}`,
  `typeAware = ${toToml(baseConfig.options?.typeAware)}`,
  `typeCheck = ${toToml(baseConfig.options?.typeCheck)}`,
  `ignorePatterns = ${toToml(ignorePatterns)}`,
  "",
  "[lint.categories]",
  ...Object.entries(baseConfig.categories ?? {}).map(
    ([key, value]) => `${JSON.stringify(key)} = ${toToml(value)}`,
  ),
  "",
  "[lint.rules]",
  ...Object.entries({ ...additionalRules, ...baseRules }).map(
    ([key, value]) => `${JSON.stringify(key)} = ${toToml(value)}`,
  ),
  ...(baseConfig.overrides ?? []).flatMap((override) => [
    "",
    "[[lint.overrides]]",
    ...Object.entries(override).map(
      ([key, value]) => `${key} = ${toToml(value)}`,
    ),
  ]),
  "",
]

if (import.meta.main) {
  await writeFile(new URL("../bunfig.toml", import.meta.url), lines.join("\n"))
}
