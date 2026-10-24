import { afterAll, describe, expect, test } from "bun:test"
import { mkdtempSync, writeFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import baseConfig from "@yopem/oxlint-config"
import reactConfig from "@yopem/oxlint-config/react"

const directory = mkdtempSync(join(tmpdir(), "oxlint-preset-integration-"))

const binary = fileURLToPath(
  new URL("../node_modules/.bin/oxlint", import.meta.url),
)

const config = join(directory, "oxlint.config.ts")

writeFileSync(
  config,
  `export default ${JSON.stringify({
    extends: [baseConfig, reactConfig],
    options: { typeAware: false, typeCheck: false },
    rules: { "no-debugger": "error" },
  })}`,
)

afterAll(() => rmSync(directory, { recursive: true, force: true }))

function lint(source: string) {
  const file = join(directory, "input.tsx")
  writeFileSync(file, source)

  const result = Bun.spawnSync(
    [binary, "--config", config, "--format", "json", file],
    { cwd: directory },
  )

  expect(result.stderr.toString()).toBe("")
  const output: unknown = JSON.parse(result.stdout.toString())

  if (
    !(output instanceof Object) ||
    !("diagnostics" in output) ||
    !Array.isArray(output.diagnostics)
  )
    throw new Error("Missing Oxlint diagnostics")
  const diagnostics: unknown[] = output.diagnostics
  let hasErrors = false

  for (const diagnostic of diagnostics) {
    if (
      !(diagnostic instanceof Object) ||
      !("severity" in diagnostic) ||
      (diagnostic.severity !== "error" && diagnostic.severity !== "warning")
    )
      throw new Error("Invalid Oxlint diagnostic")

    if (diagnostic.severity === "error") hasErrors = true
    expect(diagnostic).not.toMatchObject({ code: "oxlint" })
  }

  expect(result.exitCode).toBe(hasErrors ? 1 : 0)

  return diagnostics
}

describe("retained policies in composed base and React presets", () => {
  test("rejects Lucide component names without Icon suffix", () => {
    expect(
      lint(
        "import { Plus } from 'lucide-react';\n\nexport function View() { return <Plus /> }",
      ),
    ).toContainEqual(
      expect.objectContaining({
        code: "react-policy(require-lucide-icon-suffix)",
        severity: "error",
      }),
    )
  })
  test("allows Lucide component aliases with Icon suffix", () => {
    expect(
      lint(
        "import { Plus as PlusIcon } from 'lucide-react';\n\nexport function View() { return <PlusIcon /> }",
      ),
    ).toEqual([])
  })
  test("rejects a named suppression without a reason", () => {
    expect(
      lint("// oxlint-disable-next-line no-debugger\ndebugger"),
    ).toContainEqual(
      expect.objectContaining({
        code: "quality(require-specific-suppression)",
        severity: "error",
      }),
    )
  })
  test("allows a named line suppression with a reason", () => {
    expect(
      lint(
        "// oxlint-disable-next-line no-debugger -- Device calibration needs debugger.\ndebugger",
      ),
    ).toEqual([])
  })
})
