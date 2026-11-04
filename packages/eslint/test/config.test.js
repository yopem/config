import console from "node:console"
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import base from "@yopem/eslint-config/base"
import effect from "@yopem/eslint-config/effect"
import nextjs from "@yopem/eslint-config/nextjs"
import react from "@yopem/eslint-config/react"
import reactNative from "@yopem/eslint-config/react-native"
import tanstackStart from "@yopem/eslint-config/tanstack-start"
import { baseRules } from "@yopem/eslint-plugin/policies"
import { expect, test } from "bun:test"
import { ESLint } from "eslint"
import tseslint from "typescript-eslint"

const directory = mkdtempSync("/tmp/opencode/eslint-config-")

mkdirSync(join(directory, "pages"))

writeFileSync(
  join(directory, "tsconfig.json"),
  JSON.stringify({
    compilerOptions: {
      strict: true,
      target: "ESNext",
      module: "ESNext",
      moduleResolution: "bundler",
      jsx: "react-jsx",
    },
    include: ["*.ts", "*.tsx"],
  }),
)

const filePath = join(directory, "fixture.ts")

const code =
  "export const result: unknown = { id: 1 }\n\nconsole.log(result)\n\nexport async function save() { return 1 }\n\nsave()\n"

writeFileSync(filePath, code)

test("Base enables mapped policies, custom rules, ignores, and typed lint", async () => {
  const eslint = new ESLint({
    cwd: directory,
    overrideConfigFile: true,
    overrideConfig: base,
  })

  const config = await eslint.calculateConfigForFile(filePath)

  for (const [id, setting] of Object.entries(baseRules)) {
    if (id.startsWith("oxc/")) continue

    const mapped = id.startsWith("typescript/")
      ? id.replace(/^typescript\//, "@typescript-eslint/")
      : tseslint.plugin.rules[id]?.meta.docs?.extendsBaseRule
        ? `@typescript-eslint/${id}`
        : id

    const severity = Array.isArray(setting) ? setting[0] : setting
    expect(config.rules[mapped]?.[0], mapped).toBe(severity === "warn" ? 1 : 2)
  }

  const results = await eslint.lintFiles([filePath])
  writeFileSync(
    join(directory, "base-report.json"),
    JSON.stringify(results, null, 2),
  )
  const ids = results[0].messages.map((message) => message.ruleId)
  expect(ids).toContain("quality/no-known-value-widening")
  expect(ids).toContain("no-console")
  expect(ids).toContain("@typescript-eslint/no-floating-promises")
  expect(results[0].fatalErrorCount).toBe(0)
  mkdirSync(join(directory, "dist"))
  expect(await eslint.isPathIgnored(join(directory, "dist/file.ts"))).toBe(true)
  expect(await eslint.isPathIgnored(join(directory, "tool.config.ts"))).toBe(
    true,
  )
})

for (const [name, preset, expected] of [
  ["react", react, "react-policy/prefer-named-imports"],
  ["nextjs", nextjs, "react-doctor/alt-text"],
  ["react-native", reactNative, "react-doctor/rn-no-raw-text"],
  ["tanstack-start", tanstackStart, "react-doctor/alt-text"],
  ["effect", effect, "effect/prefer-effect-match"],
]) {
  test(`${name} composes with base and preserves framework scope`, async () => {
    const eslint = new ESLint({
      cwd: directory,
      overrideConfigFile: true,
      overrideConfig: [...base, ...preset],
    })

    const config = await eslint.calculateConfigForFile(
      join(directory, "component.tsx"),
    )

    expect(config.rules[expected][0]).toBeGreaterThan(0)

    if (name !== "effect") {
      expect(config.rules["react-doctor/react-in-jsx-scope"][0]).toBe(0)
      expect(
        config.rules[
          "react-doctor/context-provider-value-from-unmemoized-local-literal"
        ][0],
      ).toBe(0)
    }

    const fixturePath = join(directory, `${name}.tsx`)

    const source =
      name === "react"
        ? 'import React from "react"\n\nexport function Component() { return null }\n'
        : name === "react-native"
          ? 'import { View } from "react-native"\n\nexport function Component() { return <View>Raw text</View> }\n'
          : name === "effect"
            ? 'export function label(value: string) { return value === "a" ? 1 : value === "b" ? 2 : 0 }\n'
            : "export function Component() { return <img /> }\n"

    writeFileSync(fixturePath, source)
    const results = await eslint.lintFiles([fixturePath])
    writeFileSync(
      join(directory, `${name}-report.json`),
      JSON.stringify(results, null, 2),
    )
    expect(results[0].fatalErrorCount).toBe(0)
    expect(results[0].messages.map((message) => message.ruleId)).toContain(
      expected,
    )
  })
}

console.info(`Config artifacts: ${directory}`)
