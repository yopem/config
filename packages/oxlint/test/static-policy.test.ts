import { afterAll, describe, expect, test } from "bun:test"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const directory = mkdtempSync(join(tmpdir(), "oxlint-static-policy-"))

const binary = fileURLToPath(
  new URL("../node_modules/.bin/oxlint", import.meta.url),
)

const plugin = fileURLToPath(new URL("../dist/quality.js", import.meta.url))

const config = join(directory, "oxlint.config.json")

writeFileSync(
  config,
  JSON.stringify({
    categories: { correctness: "off" },
    jsPlugins: [{ name: "quality", specifier: plugin }],
    rules: {
      "quality/no-dynamic-import": "error",
      "quality/no-reexport-only-modules": "error",
    },
  }),
)

afterAll(() => rmSync(directory, { recursive: true, force: true }))

function lint(source: string, extension: string, rule: string, count: number) {
  const file = join(directory, `input.${extension}`)
  writeFileSync(file, source)

  const result = Bun.spawnSync([
    binary,
    "--config",
    config,
    "--format",
    "json",
    file,
  ])

  expect(result.stderr.toString()).toBe("")
  const output: unknown = JSON.parse(result.stdout.toString())

  if (
    !(output instanceof Object) ||
    !("diagnostics" in output) ||
    !Array.isArray(output.diagnostics)
  ) {
    throw new Error("Missing Oxlint diagnostics")
  }

  expect(output.diagnostics).toHaveLength(count)

  for (const diagnostic of output.diagnostics) {
    expect(diagnostic).toMatchObject({
      code: `quality(${rule})`,
      severity: "error",
    })
  }

  expect(result.exitCode).toBe(count === 0 ? 0 : 1)
}

describe("static module policy", () => {
  for (const extension of ["ts", "js"]) {
    describe(extension, () => {
      for (const source of [
        "import('./feature')",
        "const feature = await import('./feature')",
        "async function load() { return import('./feature') }",
        "const load = () => import('./feature')",
        "import('./feature', { with: { type: 'json' } })",
      ]) {
        test(source, () => lint(source, extension, "no-dynamic-import", 1))
      }

      test("reports every dynamic import", () => {
        lint(
          "import('./one'); async function load() { return import('./two') }",
          extension,
          "no-dynamic-import",
          2,
        )
      })

      for (const source of [
        "export { feature } from './feature'",
        "export * from './feature'",
        "export * as feature from './feature'",
        "import { feature } from './feature'; export { feature }",
        "import { feature as local } from './feature'; export { local as feature }",
        "import feature from './feature'; export { feature }",
        "import * as feature from './feature'; export { feature }",
        "export {}; export * from './feature'",
        "import { feature } from './feature'; export { other } from './other'",
        "/* forwarding module */ ; export { feature } from './feature'; ; export * from './other'",
      ]) {
        test(source, () =>
          lint(source, extension, "no-reexport-only-modules", 1),
        )
      }

      for (const source of [
        "",
        "; ;",
        "import { feature } from './feature'",
        "import './setup'",
        "import './setup'; export * from './feature'",
        "import {} from './setup'; export * from './feature'",
        "export const feature = 1; export * from './other'",
        "const feature = 1; export * from './other'",
        "export {}",
        "import './setup'; import { feature } from './feature'; export { feature }",
        "export default 1; export * from './feature'",
        "start(); export * from './feature'",
      ]) {
        test(source || "empty module", () => lint(source, extension, "", 0))
      }
    })
  }

  for (const source of [
    "export type { Feature } from './feature'",
    "import type { Feature } from './feature'; export type { Feature }",
    "export { type Feature } from './feature'",
    "export type * from './feature'",
    "export type * as Feature from './feature'",
    "import type { Feature } from './feature'; export type { Other } from './other'",
    "import type {} from './feature'; export * from './other'",
  ]) {
    test(source, () => lint(source, "ts", "no-reexport-only-modules", 1))
  }

  for (const source of [
    "import type { Feature } from './feature'",
    "type Feature = import('./feature').Feature",
    "type Feature = typeof import('./feature')",
    "type Feature = string; export * from './feature'",
    "interface Feature {}; export type { Other } from './other'",
    "export type Feature = string; export * from './feature'",
    "export interface Feature {}; export * from './feature'",
    "import './setup'; export type { Feature } from './feature'",
  ]) {
    test(source, () => lint(source, "ts", "", 0))
  }
})
