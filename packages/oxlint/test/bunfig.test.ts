import { expect, test } from "bun:test"
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import baseConfig from "@yopem/oxlint-config"

import { baseRules, ignorePatterns } from "../../eslint-plugin/src/policies.ts"
import { additionalRules } from "../scripts/sync-bunfig.ts"

const template = fileURLToPath(new URL("../bunfig.toml", import.meta.url))
const modules = fileURLToPath(new URL("../node_modules", import.meta.url))

test("Bun template keeps the default Oxlint policy in sync", async () => {
  const config = Bun.TOML.parse(await Bun.file(template).text())

  if (
    !("lint" in config) ||
    typeof config.lint !== "object" ||
    config.lint === null
  ) {
    throw new Error("Missing Bun lint config")
  }

  const lint = config.lint

  if (
    !("rules" in lint) ||
    typeof lint.rules !== "object" ||
    lint.rules === null
  ) {
    throw new Error("Missing Bun lint rules")
  }

  const rules = new Map(Object.entries(lint.rules))

  expect("typeAware" in lint && lint.typeAware).toBe(
    baseConfig.options?.typeAware,
  )
  expect("typeCheck" in lint && lint.typeCheck).toBe(
    baseConfig.options?.typeCheck,
  )
  expect("plugins" in lint && lint.plugins).toEqual([
    "eslint-plugin-oxfmt",
    { name: "quality", specifier: "@yopem/eslint-plugin/quality" },
    { name: "stylistic", specifier: "@yopem/eslint-plugin/stylistic" },
  ])
  expect("categories" in lint && lint.categories).toEqual(baseConfig.categories)
  expect("ignorePatterns" in lint && lint.ignorePatterns).toEqual(
    ignorePatterns,
  )
  expect("overrides" in lint && lint.overrides).toEqual(baseConfig.overrides)
  expect(Object.fromEntries(rules)).toEqual({
    ...additionalRules,
    ...baseRules,
  })
})

test("the npm package includes the Bun template", () => {
  const directory = fileURLToPath(new URL("..", import.meta.url))
  const result = Bun.spawnSync(
    ["npm", "pack", "--dry-run", "--ignore-scripts", "--json"],
    { cwd: directory },
  )
  const output = result.stdout.toString()

  expect(result.exitCode).toBe(0)
  expect(output).toContain('"path": "bunfig.toml"')
}, 30_000)

test("copied Bun template loads plugins and respects the env override", async () => {
  const directory = mkdtempSync(join(tmpdir(), "bun-lint-template-"))

  try {
    await Bun.write(join(directory, "bunfig.toml"), Bun.file(template))
    symlinkSync(modules, join(directory, "node_modules"), "dir")
    writeFileSync(
      join(directory, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: { noEmit: true, types: ["node"] },
        include: ["*.ts"],
      }),
    )
    writeFileSync(
      join(directory, "env.ts"),
      "export const value = process.env.VALUE\n",
    )
    writeFileSync(
      join(directory, "feature.ts"),
      "export const value = process.env.VALUE\nexport const found = [1, 2].filter(Boolean).length > 0\n",
    )
    const environment = Bun.spawnSync(
      [process.execPath, "lint", "--no-script", "env.ts"],
      { cwd: directory },
    )
    const feature = Bun.spawnSync(
      [process.execPath, "lint", "--no-script", "feature.ts"],
      { cwd: directory },
    )
    const envOutput =
      environment.stdout.toString() + environment.stderr.toString()
    const output = feature.stdout.toString() + feature.stderr.toString()

    expect(environment.exitCode).toBe(0)
    expect(envOutput).not.toContain("quality/no-environment-access")
    expect(feature.exitCode).toBe(1)
    expect(output).toContain("quality/no-environment-access")
    expect(output).toContain("quality/no-array-filter-existence")
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
