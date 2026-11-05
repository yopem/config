import { mkdir, writeFile } from "node:fs/promises"

import { baseRules, ignorePatterns } from "../../eslint-plugin/src/policies.ts"
import baseConfig from "../src/index.ts"
import effectConfig from "../src/presets/effect.ts"
import nextjsConfig from "../src/presets/nextjs.ts"
import reactNativeConfig from "../src/presets/react-native.ts"
import reactConfig from "../src/presets/react.ts"
import tanstackStartConfig from "../src/presets/tanstack-start.ts"

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

const variants = {
  base: [],
  effect: [effectConfig],
  react: [reactConfig],
  nextjs: [reactConfig, nextjsConfig],
  "react-native": [reactNativeConfig],
  "tanstack-start": [reactConfig, tanstackStartConfig],
  full: [
    reactConfig,
    nextjsConfig,
    reactNativeConfig,
    tanstackStartConfig,
    effectConfig,
  ],
}

if (import.meta.main) {
  for (const [name, presets] of Object.entries(variants)) {
    const pluginNames = new Set(
      presets.flatMap((preset) =>
        (preset.jsPlugins ?? []).map((plugin) =>
          typeof plugin === "string" ? plugin : plugin.name,
        ),
      ),
    )
    const plugins = [
      "eslint-plugin-oxfmt",
      { name: "quality", specifier: "@yopem/eslint-plugin/quality" },
      { name: "stylistic", specifier: "@yopem/eslint-plugin/stylistic" },
      ...["effect", "react-doctor", "react-policy"]
        .filter((plugin) => pluginNames.has(plugin))
        .map((plugin) => ({
          name: plugin,
          specifier: `@yopem/eslint-plugin/${plugin}`,
        })),
    ]
    const lines = [
      `# Generated from the ${name} Oxlint config. Run bun run sync:bun to update.`,
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
      ...Object.entries(
        Object.assign(
          {},
          additionalRules,
          baseRules,
          ...presets.map((preset) => preset.rules),
        ),
      ).map(([key, value]) => `${JSON.stringify(key)} = ${toToml(value)}`),
      ...(baseConfig.overrides ?? []).flatMap((override) => [
        "",
        "[[lint.overrides]]",
        ...Object.entries(override).map(
          ([key, value]) => `${key} = ${toToml(value)}`,
        ),
      ]),
      "",
    ]
    const directory = new URL(`../bunfig/${name}/`, import.meta.url)
    await mkdir(directory, { recursive: true })
    await writeFile(new URL("bunfig.toml", directory), lines.join("\n"))
  }
}
