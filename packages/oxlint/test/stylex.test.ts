import { expect, test } from "bun:test"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import reactConfig from "@yopem/oxlint-config/react"

const cases: {
  code: string
  spread: boolean
  array: boolean
  settings?: Record<string, unknown>
}[] = [
  {
    code: "export function C(props) { return <div {...props} /> }",
    spread: false,
    array: false,
    settings: { "react-doctor": { jsxPropsNoSpreading: { html: "ignore" } } },
  },
  {
    code: 'export function C() { return <Button {...{ title: "hello" }} /> }',
    spread: false,
    array: false,
    settings: {
      "react-doctor": { jsxPropsNoSpreading: { explicitSpread: "ignore" } },
    },
  },
  {
    code: 'import * as sx from "@stylexjs/stylex"; export function C() { return <div {...sx.props(styles.root)} /> }',
    spread: false,
    array: false,
  },
  {
    code: 'import sx from "@stylexjs/stylex"; export function C() { return <div {...sx["props"](styles.root)} /> }',
    spread: false,
    array: false,
  },
  {
    code: 'import { props as styleProps } from "@stylexjs/stylex"; export function C() { return <div {...styleProps(styles.root)} /> }',
    spread: false,
    array: false,
  },
  {
    code: 'import * as sx from "@stylexjs/stylex"; export function C(props) { return <div {...sx.props(styles.root)} {...props} /> }',
    spread: true,
    array: false,
  },
  {
    code: 'import * as sx from "@stylexjs/stylex"; export function C(sx) { return <div {...sx.props(styles.root)} /> }',
    spread: true,
    array: false,
  },
  {
    code: 'import { props as styleProps } from "@stylexjs/stylex"; export function C(styleProps) { return <div {...styleProps(styles.root)} /> }',
    spread: true,
    array: false,
  },
  {
    code: 'import * as sx from "@stylexjs/stylex"; export function C() { return <div {...sx.create(styles.root)} /> }',
    spread: true,
    array: false,
  },
  {
    code: 'import * as sx from "@stylexjs/stylex"; export function C() { const xstyle = [styles.root]; return <Separator xstyle={xstyle} /> }',
    spread: false,
    array: false,
  },
  {
    code: 'import { props as styleProps } from "other"; export function C() { return <div {...styleProps(styles.root)} /> }',
    spread: true,
    array: false,
  },
  {
    code: 'import * as sx from "@stylexjs/stylex"; export function C(props) { const merged = { ...sx.props(styles.root), ...props }; return <div {...merged} /> }',
    spread: true,
    array: false,
  },
  {
    code: 'import * as sx from "@stylexjs/stylex"; import { memo } from "react"; const Separator = memo(function Separator() { return <div /> }); export function C({xstyle}) { return <Separator xstyle={[styles.item, styles.separator, xstyle]} /> }',
    spread: false,
    array: false,
  },
  {
    code: 'import type { StyleXStyles } from "@stylexjs/stylex"; export function C({xstyle}: {xstyle: StyleXStyles}) { return <Separator xstyle={[styles.item, xstyle]} /> }',
    spread: false,
    array: false,
  },
  {
    code: "export function C() { return <Separator xstyle={[styles.item]} /> }",
    spread: false,
    array: true,
  },
  {
    code: 'import * as sx from "@stylexjs/stylex"; export function C() { return <List items={[1, 2]} /> }',
    spread: false,
    array: true,
  },
]

test("StyleX exceptions preserve React Doctor checks for other props", () => {
  const directory = mkdtempSync(join(tmpdir(), "oxlint-stylex-"))
  const configPath = join(directory, "oxlint.json")
  const fixturePath = join(directory, "component.tsx")
  const oxlintPath = fileURLToPath(
    new URL("../bin/oxlint", import.meta.resolve("oxlint")),
  )

  try {
    for (const entry of cases) {
      writeFileSync(
        configPath,
        JSON.stringify({
          settings: entry.settings,
          jsPlugins: reactConfig.jsPlugins,
          rules: {
            "react-doctor/jsx-props-no-spreading": "warn",
            "react-doctor/jsx-no-new-array-as-prop": "warn",
          },
        }),
      )
      writeFileSync(fixturePath, entry.code)
      const result = Bun.spawnSync([
        "node",
        oxlintPath,
        "-c",
        configPath,
        fixturePath,
      ])
      const output = result.stdout.toString() + result.stderr.toString()
      expect(result.exitCode).toBe(0)
      expect(
        output.includes("react-doctor(jsx-props-no-spreading)"),
        entry.code,
      ).toBe(entry.spread)
      expect(
        output.includes("react-doctor(jsx-no-new-array-as-prop)"),
        entry.code,
      ).toBe(entry.array)
      expect(output).not.toContain("Failed to load")
    }
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}, 30_000)
