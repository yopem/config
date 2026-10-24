import { afterAll, describe, expect, test } from "bun:test"
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
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
  })}`,
)

afterAll(() => rmSync(directory, { recursive: true, force: true }))

function lint(source: string, path: string) {
  const file = join(directory, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, source)

  const result = Bun.spawnSync([
    binary,
    "--config",
    config,
    "--format",
    "json",
    file,
  ])

  const output: unknown = JSON.parse(result.stdout.toString())

  if (
    !(output instanceof Object) ||
    !("diagnostics" in output) ||
    !Array.isArray(output.diagnostics)
  ) {
    throw new Error("Missing Oxlint diagnostics")
  }

  for (const diagnostic of output.diagnostics) {
    expect(diagnostic).not.toMatchObject({ code: "oxlint" })
  }

  return output.diagnostics
}

describe("composed existing base and React presets", () => {
  test("rejects dynamic imports", () => {
    expect(
      lint('export const value = import("./feature")', "dynamic.ts"),
    ).toContainEqual(
      expect.objectContaining({
        code: "quality(no-dynamic-import)",
        severity: "error",
      }),
    )
  })
  test("rejects forwarding modules", () => {
    expect(
      lint('export { value } from "./feature"', "barrel.ts"),
    ).toContainEqual(
      expect.objectContaining({
        code: "quality(no-reexport-only-modules)",
        severity: "error",
      }),
    )
  })
  test("allows environment adapter but rejects application reads", () => {
    expect(
      lint("export const value = process.env.PORT", "env.ts"),
    ).not.toContainEqual(
      expect.objectContaining({ code: "quality(no-environment-access)" }),
    )
    expect(
      lint("export const value = process.env.PORT", "feature.ts"),
    ).toContainEqual(
      expect.objectContaining({
        code: "quality(no-environment-access)",
        severity: "error",
      }),
    )
  })
  test("rejects default React components", () => {
    expect(
      lint("export default function View() { return <div /> }", "view.tsx"),
    ).toContainEqual(
      expect.objectContaining({
        code: "react-policy(require-export-function)",
        severity: "error",
      }),
    )
  })
  test("rejects imported memoization hooks", () => {
    expect(
      lint(
        'import { useMemo } from "react"; export function useValue() { return useMemo(() => 1, []) }',
        "hook.ts",
      ),
    ).toContainEqual(
      expect.objectContaining({
        code: "react-policy(no-restricted-hooks)",
        severity: "error",
      }),
    )
  })
  test("rejects mutation result spreads", () => {
    expect(
      lint(
        'import { useMutation } from "@tanstack/react-query"; export function useSave() { const mutation = useMutation({ mutationFn: async () => 1 }); return { ...mutation } }',
        "mutation.ts",
      ),
    ).toContainEqual(
      expect.objectContaining({
        code: "react-policy(no-query-result-spread)",
        severity: "error",
      }),
    )
  })
})
