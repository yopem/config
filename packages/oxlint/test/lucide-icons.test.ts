import { afterAll, describe, expect, test } from "bun:test"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const directory = mkdtempSync(join(tmpdir(), "oxlint-lucide-icons-"))

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
    categories: { correctness: "off" },
    jsPlugins: [{ name: "react-policy", specifier: plugin }],
    rules: { "react-policy/require-lucide-icon-suffix": "error" },
  }),
)

afterAll(() => rmSync(directory, { recursive: true, force: true }))

function lint(source: string) {
  const file = join(directory, "input.tsx")
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
      code: "react-policy(require-lucide-icon-suffix)",
      severity: "error",
    })
  }

  expect(result.exitCode).toBe(output.diagnostics.length === 0 ? 0 : 1)

  return output.diagnostics.length
}

describe("require-lucide-icon-suffix", () => {
  for (const source of [
    "import { Camera } from 'lucide-react'",
    "import { Camera as Photo } from 'lucide-react'",
    "import { CameraIcon as Camera } from 'lucide-react'",
    "import { Camera as camera } from 'lucide-react'",
    "import { Camera as PhotoIconButton } from 'lucide-react'",
    "import { 'Camera' as Photo } from 'lucide-react'",
    "import { Camera } from 'lucide-react'; function render(Camera) { return <Camera /> }",
    "import { Camera } from 'lucide-react'; const PhotoIcon = Camera",
    "import { Camera } from 'lucide-react'; const iconNode = []; const CustomIcon = createLucideIcon('Custom', iconNode)",
  ]) {
    test(source, () => expect(lint(source)).toBe(1))
  }

  for (const source of [
    "import { CameraIcon } from 'lucide-react'",
    "import { Camera as CameraIcon } from 'lucide-react'",
    "import { CameraIcon as PhotoIcon } from 'lucide-react'",
    "import { Camera as PhotoIcon } from 'lucide-react'",
    "import { 'Camera' as PhotoIcon } from 'lucide-react'",
    "import type { Camera, LucideProps, IconNode } from 'lucide-react'",
    "import { type Camera, type LucideProps, type IconNode } from 'lucide-react'",
    "import { createLucideIcon, icons, defaultAttributes } from 'lucide-react'",
    "import { createLucideIcon as Factory, icons as Catalog } from 'lucide-react'",
    "import { IconNode, LucideProps, LucideIcon } from 'lucide-react'",
    "import { IconNode as Nodes, LucideProps as Props, LucideIcon as Component } from 'lucide-react'",
    "import { createLucideIcon } from 'lucide-react'; const iconNode = []; const Camera = createLucideIcon('Camera', iconNode)",
    "import { Camera } from './icons'",
    "import { Camera } from '@other/icons'",
    "import { Camera } from 'lucide-react-native'",
    "const Camera = () => null; const iconNode = []; const view = <Camera />",
    "import { CameraIcon } from 'lucide-react'; function render(Camera) { return <Camera /> }",
    "import * as Lucide from 'lucide-react'; const view = <Lucide.Camera />",
    "import type * as Lucide from 'lucide-react'",
    "import Lucide from 'lucide-react'",
    "import 'lucide-react'",
  ]) {
    test(source, () => expect(lint(source)).toBe(0))
  }

  test("checks each runtime icon independently of helpers and types", () => {
    expect(
      lint(
        "import { Camera, CameraIcon as Photo, Check as CheckIcon, createLucideIcon as Factory, type LucideProps, IconNode } from 'lucide-react'",
      ),
    ).toBe(2)
  })
})
