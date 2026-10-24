import { afterAll, describe, expect, test } from "bun:test"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const directory = mkdtempSync(join(tmpdir(), "oxlint-env-"))

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
    rules: { "quality/no-environment-access": "error" },
  }),
)

afterAll(() => rmSync(directory, { recursive: true, force: true }))

function lint(source: string) {
  const file = join(directory, "input.ts")
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

  for (const diagnostic of output.diagnostics) {
    expect(diagnostic).toMatchObject({
      code: "quality(no-environment-access)",
      severity: "error",
    })
  }

  expect(result.exitCode).toBe(output.diagnostics.length === 0 ? 0 : 1)

  return output.diagnostics.length
}

describe("environment adapter boundary", () => {
  for (const source of [
    "const port = process.env.PORT",
    "const port = process['env']['PORT']",
    "const { env } = process",
    "const port = Bun.env.PORT",
    "const port = import.meta.env.PORT",
    "import runtime from 'node:process'; const port = runtime.env.PORT",
    "import * as runtime from 'process'; const { env } = runtime",
    "import { env as config } from 'node:process'; config.PORT",
    "import { env } from 'bun'; env.PORT",
    "const port = globalThis.process.env.PORT",
    "const port = globalThis.Bun.env.PORT",
  ]) {
    test(source, () => expect(lint(source)).toBe(1))
  }

  for (const source of [
    "import { port } from './env'; export { port }",
    "function read(process: { env: string }) { return process.env }",
    "const Bun = { env: 'local' }; export const value = Bun.env",
    "const globalThis = { process: { env: 'local' } }; export const value = globalThis.process.env",
    "const settings = { env: 'test' }; export const value = settings.env",
    "const version = process.version",
    "import { cwd } from 'node:process'; cwd()",
  ]) {
    test(source, () => expect(lint(source)).toBe(0))
  }
})
