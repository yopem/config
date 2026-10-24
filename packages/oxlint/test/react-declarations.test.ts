import { afterAll, describe, expect, test } from "bun:test"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const directory = mkdtempSync(join(tmpdir(), "oxlint-react-declarations-"))

const binary = fileURLToPath(
  new URL("../node_modules/.bin/oxlint", import.meta.url),
)

const plugin = fileURLToPath(
  new URL("../dist/react-policy.js", import.meta.url),
)

const config = join(directory, "oxlint.config.json")

writeFileSync(
  config,
  JSON.stringify({
    plugins: [],
    jsPlugins: [{ name: "react-policy", specifier: plugin }],
    categories: { correctness: "off" },
    rules: { "react-policy/require-export-function": "error" },
  }),
)

afterAll(() => rmSync(directory, { recursive: true, force: true }))

function lint(source: string, extension = "tsx") {
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

  const output: unknown = JSON.parse(result.stdout.toString())

  if (
    !(output instanceof Object) ||
    !("diagnostics" in output) ||
    !Array.isArray(output.diagnostics)
  ) {
    throw new Error("Missing Oxlint diagnostics")
  }

  for (const diagnostic of output.diagnostics) {
    if (
      !(diagnostic instanceof Object) ||
      !("code" in diagnostic) ||
      diagnostic.code !== "react-policy(require-export-function)"
    ) {
      throw new Error(`Unexpected diagnostic: ${JSON.stringify(diagnostic)}`)
    }
  }

  expect(result.exitCode).toBe(output.diagnostics.length > 0 ? 1 : 0)

  return output.diagnostics.length
}

describe("require-export-function", () => {
  for (const source of [
    "function Card() { return <div /> }",
    "function Card() { if (ready) return <div />; return null }",
    "function Card() { return ready ? <div /> : null }",
    "const Card = () => <></>",
    "export const Card = () => <div />",
    "const Card = function () { return <div /> }",
    "export const Card = function Card() { return <div /> }",
    "function Card() { return <div /> }; export { Card }",
    "export default function Card() { return <div /> }",
    "export default function () { return <div /> }",
    "export default () => <div />",
    "export default function Named() { return <></> }",
    "import { useState } from 'react'; function useCount() { return useState(0) }",
    "import 'react/jsx-runtime'; const useCount = () => 0",
    "import React from 'react'; export const useCount = function () { return 0 }",
    "import 'react'; export default function useCount() { return 0 }",
    "function use2D() { return 0 }; const view = <div />",
    "const useCount = () => 0; const view = <div />",
    "import { type ReactNode, useState } from 'react'; const useCount = () => useState(0)",
    "export function Card() { return <div /> }; export default Card",
    "import 'react'; export function useCount() { return 0 }; export default useCount",
  ]) {
    test(source, () => expect(lint(source)).toBe(1))
  }

  for (const source of [
    "export function Card() { return <div /> }",
    "import 'react'; export function useCount() { return 0 }",
    "function utility() { return <div /> }",
    "function Constructor() { this.value = 1 }",
    "const Constructor = function () { this.value = 1 }",
    "const Utility = () => 42",
    "export default function Utility() { return 42 }",
    "export default () => 42",
    "function useCount() { return 0 }",
    "const useCount = () => 0",
    "import type { ReactNode } from 'react'; function useCount() { return 0 }",
    "import { type ReactNode } from 'react'; const useCount = () => 0",
    "import { useCount } from './store'; const count = useCount()",
    "import { useState } from 'react'; const count = useState(0)",
    "import 'reactive'; function useCount() { return 0 }",
    "import 'react'; function useful() { return 0 }",
    "import 'react'; function use_count() { return 0 }",
    "export function Card() { const Row = () => <div />; function useCount() { return 0 }; return <Row /> }",
    "function Factory() { return () => <div /> }",
    "function Utility(view = <div />) { return 42 }",
    "const Utility = (view = <div />) => 42",
    "function Factory() { class Row { render() { return <div /> } }; return Row }",
    "const Card = memo(() => <div />)",
    "import type { ReactNode } from 'react/jsx-runtime'; const useCount = () => 0",
    "const Factory = () => function Row() { return <div /> }",
    "function Factory() { const Row = () => <div />; return Row }",
    "const items = values.map(function Card() { return <div /> })",
    "const object = { Card() { return <div /> } }",
    "class Factory { Card() { return <div /> } }",
    "export { Card } from './card'",
  ]) {
    test(source, () => expect(lint(source)).toBe(0))
  }

  test("runtime React evidence works in .ts files", () => {
    expect(lint("import 'react'; const useCount = () => 0", "ts")).toBe(1)
  })

  test("local declaration and default reference each violate contract", () => {
    expect(lint("const Card = () => <div />; export default Card")).toBe(2)
  })

  test("file evidence does not leak between files", () => {
    const reactFile = join(directory, "react.ts")
    const utilityFile = join(directory, "utility.ts")
    writeFileSync(
      reactFile,
      "import 'react'; export function useCount() { return 0 }",
    )
    writeFileSync(utilityFile, "const useCount = () => 0")

    const result = Bun.spawnSync([
      binary,
      "--config",
      config,
      "--format",
      "json",
      reactFile,
      utilityFile,
    ])

    expect(result.exitCode).toBe(0)
    expect(JSON.parse(result.stdout.toString()).diagnostics).toEqual([])
  })
})
