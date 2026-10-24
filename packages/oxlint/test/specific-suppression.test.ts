import { afterAll, describe, expect, test } from "bun:test"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const directory = mkdtempSync(join(tmpdir(), "oxlint-suppression-"))

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
      "quality/require-specific-suppression": "error",
      "no-debugger": "error",
      "typescript/ban-ts-comment": "error",
    },
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

  const codes: string[] = []

  for (const diagnostic of output.diagnostics) {
    if (!(diagnostic instanceof Object) || !("code" in diagnostic)) {
      throw new Error("Missing diagnostic code")
    }

    const code = diagnostic.code

    if (
      code !== policyCode &&
      code !== "eslint(no-debugger)" &&
      code !== "typescript(ban-ts-comment)"
    )
      throw new Error(`Unexpected diagnostic: ${JSON.stringify(diagnostic)}`)
    expect(diagnostic).toMatchObject({ severity: "error" })
    codes.push(code)
  }

  expect(result.exitCode).toBe(codes.length === 0 ? 0 : 1)

  return codes
}

const policyCode = "quality(require-specific-suppression)"

describe("specific lint suppression", () => {
  for (const prefix of ["eslint", "oxlint"]) {
    for (const source of [
      `// ${prefix}-disable-next-line no-debugger -- Debugger required by attached device.\ndebugger`,
      `debugger // ${prefix}-disable-line no-debugger -- Device calibration needs debugger.`,
      `/* ${prefix}-disable-next-line no-debugger -- Device calibration\n   requires attached debugger. */\ndebugger`,
      `// Device calibration needs debugger.\n// ${prefix}-disable-next-line no-debugger\ndebugger`,
      `/* ${prefix}-disable-next-line no-debugger, no-console -- Device calibration. */\ndebugger`,
      `// ${prefix}-disable-next-line no-debugger no-console -- Device calibration.\ndebugger`,
    ]) {
      test(source, () => expect(lint(source)).toEqual([]))
    }

    for (const source of [
      `// ${prefix}-disable-next-line no-debugger\ndebugger`,
      `debugger // ${prefix}-disable-line no-debugger`,
      `// ${prefix}-disable-next-line no-debugger -- \ndebugger`,
      `// ${prefix}-disable no-debugger -- Device calibration.\ndebugger`,
      `/* ${prefix}-disable no-debugger -- Device calibration. */\ndebugger\n/* ${prefix}-enable no-debugger */`,
      `// ${prefix}-disable-next-line * -- Device calibration.\nexport const value = 1`,
      `// ${prefix}-disable-next-line no-debugger, -- Device calibration.\ndebugger`,
      `// Device calibration.\n\n// ${prefix}-disable-next-line no-debugger\ndebugger`,
      `const reason = 'Device calibration.'\n// ${prefix}-disable-next-line no-debugger\ndebugger`,
    ]) {
      test(source, () => expect(lint(source)).toContain(policyCode))
    }

    test(`${prefix} explanation after directive does not move target line`, () => {
      expect(
        lint(
          `// ${prefix}-disable-next-line no-debugger\n// Device calibration needs debugger.\ndebugger`,
        ),
      ).toEqual(["eslint(no-debugger)"])
    })
    test(`${prefix} line suppression affects only one line`, () => {
      expect(
        lint(
          `// ${prefix}-disable-next-line no-debugger -- Device calibration.\ndebugger\ndebugger`,
        ),
      ).toEqual(["eslint(no-debugger)"])
    })
    test(`${prefix} named suppression does not disable checker`, () => {
      expect(
        lint(`// ${prefix}-disable-next-line no-debugger\ndebugger`),
      ).toEqual([policyCode])
    })
    test(`${prefix} rule-free next-line directive remains visible`, () => {
      expect(
        lint(`// ${prefix}-disable-next-line -- Device calibration.\ndebugger`),
      ).toEqual([policyCode])
    })
    test(`${prefix} checker suppression can hide a later broad directive`, () => {
      expect(
        lint(
          `// ${prefix}-disable-next-line quality/require-specific-suppression -- Device calibration.\n// ${prefix}-disable-next-line\ndebugger`,
        ),
      ).toEqual([])
    })
    test(`${prefix} broad directives can suppress checker at comment location`, () => {
      expect(lint(`/* ${prefix}-disable */\ndebugger`)).toEqual([])
      expect(lint(`debugger // ${prefix}-disable-line`)).toEqual([])
      expect(
        lint(
          `/* ${prefix}-disable quality/require-specific-suppression */\n/* ${prefix}-disable no-debugger */\ndebugger`,
        ),
      ).toEqual([])
    })
  }

  for (const source of [
    `export const text = "// eslint-disable"`,
    "export const text = `/* oxlint-disable */`",
    "export const pattern = /eslint-disable/",
    "// Documentation mentions eslint-disable, not a directive.\nexport const value = 1",
    "/* eslint-enable no-debugger */\nexport const value = 1",
    "// @ts-expect-error: Negative type case requires invalid input.\nexport const value: string = 1",
  ]) {
    test(source, () => expect(lint(source)).toEqual([]))
  }

  test("existing TypeScript comment policy remains enabled", () => {
    expect(lint("// @ts-ignore\nexport const value: string = 1")).toEqual([
      "typescript(ban-ts-comment)",
    ])
  })
})
