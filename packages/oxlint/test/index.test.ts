import { expect, test } from "bun:test"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import baseConfig from "@yopem/oxlint-config"
import nextjsConfig from "@yopem/oxlint-config/nextjs"
import reactConfig from "@yopem/oxlint-config/react"
import reactNativeConfig from "@yopem/oxlint-config/react-native"
import tanstackStartConfig from "@yopem/oxlint-config/tanstack-start"
import {
  ALL_REACT_DOCTOR_RULES,
  NEXTJS_RULES,
  REACT_NATIVE_RULES,
  RECOMMENDED_RULES,
  TANSTACK_QUERY_RULES,
  TANSTACK_START_RULES,
} from "oxlint-plugin-react-doctor"

test("React preset warns on restricted hooks without blocking other imports", () => {
  const directory = mkdtempSync(join(tmpdir(), "oxlint-react-hooks-"))
  const configPath = join(directory, "oxlint.config.ts")
  const fixturePath = join(directory, "hooks.ts")
  const oxlintPath = fileURLToPath(
    new URL("../bin/oxlint", import.meta.resolve("oxlint")),
  )

  try {
    writeFileSync(
      configPath,
      `import react from ${JSON.stringify(import.meta.resolve("@yopem/oxlint-config/react"))};
export default { ...react, categories: { correctness: "off" } };`,
    )

    for (const source of [
      'import { useCallback } from "react";',
      'import { useEffect } from "react";',
      'import { useCallback as callback, useEffect as effect } from "react";',
      'import * as React from "react";',
    ]) {
      writeFileSync(fixturePath, source)
      const result = Bun.spawnSync([
        "node",
        oxlintPath,
        "-c",
        configPath,
        fixturePath,
      ])
      const output = result.stdout.toString() + result.stderr.toString()
      expect(result.exitCode).toBe(0)
      expect(output).toContain("eslint(no-restricted-imports)")
      expect(output).not.toContain("Failed to load")
    }

    writeFileSync(fixturePath, 'import { useState } from "react";')
    const result = Bun.spawnSync([
      "node",
      oxlintPath,
      "-c",
      configPath,
      fixturePath,
    ])
    const output = result.stdout.toString() + result.stderr.toString()
    expect(result.exitCode).toBe(0)
    expect(output).not.toContain("eslint(no-restricted-imports)")
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}, 30_000)

function recommendedRule(key: string) {
  return key === "react-doctor/jsx-props-no-spreading"
    ? "warn"
    : RECOMMENDED_RULES[key]
}

test("React Doctor rules stay scoped to their framework presets", () => {
  expect(JSON.stringify(baseConfig.jsPlugins)).not.toContain("react-doctor")

  for (const key of Object.keys(ALL_REACT_DOCTOR_RULES)) {
    const disabled = [
      "react-doctor/react-in-jsx-scope",
      "react-doctor/jsx-no-jsx-as-prop",
      "react-doctor/jsx-max-depth",
      "react-doctor/only-export-components",
    ].includes(key)

    expect(baseConfig.rules?.[key]).toBeUndefined()
    expect(reactConfig.rules?.[key]).toEqual(
      disabled ? "off" : (TANSTACK_QUERY_RULES[key] ?? recommendedRule(key)),
    )
    expect(nextjsConfig.rules?.[key]).toEqual(
      disabled ? "off" : (NEXTJS_RULES[key] ?? recommendedRule(key)),
    )
    expect(reactNativeConfig.rules?.[key]).toEqual(
      disabled ? "off" : (REACT_NATIVE_RULES[key] ?? recommendedRule(key)),
    )
    expect(tanstackStartConfig.rules?.[key]).toEqual(
      disabled ? "off" : (TANSTACK_START_RULES[key] ?? recommendedRule(key)),
    )
  }

  const directory = mkdtempSync(join(tmpdir(), "oxlint-react-doctor-"))
  const configPath = join(directory, "oxlint.config.ts")
  const fixturePath = join(directory, "component.jsx")
  const oxlintPath = fileURLToPath(
    new URL("../bin/oxlint", import.meta.resolve("oxlint")),
  )

  try {
    for (const presets of [
      [],
      ["react"],
      ["nextjs"],
      ["react", "nextjs"],
      ["react-native"],
      ["tanstack-start"],
      ["react", "tanstack-start"],
    ]) {
      writeFileSync(
        configPath,
        `import base from ${JSON.stringify(import.meta.resolve("@yopem/oxlint-config"))};
${presets.map((preset, index) => `import preset${index} from ${JSON.stringify(import.meta.resolve(`@yopem/oxlint-config/${preset}`))};`).join("\n")}
export default { extends: [base, ${presets.map((_, index) => `preset${index}`).join(", ")}] };`,
      )
      writeFileSync(fixturePath, "export const answer = 42;\n")
      const clean = Bun.spawnSync([
        "node",
        oxlintPath,
        "-c",
        configPath,
        fixturePath,
      ])
      expect(clean.exitCode).toBe(0)
      expect(clean.stderr.toString()).toBe("")

      writeFileSync(
        fixturePath,
        `import { View } from "react-native";
export const answer = 42;
export function Component() {
  debugger;
  return <View slot={<img />}>Raw text<div><div><div><div><div><div><div><div><div><div>Text</div></div></div></div></div></div></div></div></div></div></View>;
}
`,
      )
      const invalid = Bun.spawnSync([
        "node",
        oxlintPath,
        "-c",
        configPath,
        fixturePath,
      ])
      const output = invalid.stdout.toString() + invalid.stderr.toString()
      expect(invalid.exitCode).toBe(1)
      expect(output).toContain("eslint(no-debugger)")
      expect(output).not.toContain("Failed to load")
      expect(output.includes("react-doctor(alt-text)")).toBe(presets.length > 0)
      expect(output.includes("react-doctor(rn-no-raw-text)")).toBe(
        presets.includes("react-native"),
      )

      for (const id of [
        "react-in-jsx-scope",
        "jsx-no-jsx-as-prop",
        "jsx-max-depth",
        "only-export-components",
        "preact-no-react-hooks-import",
      ]) {
        expect(output).not.toContain(`react-doctor(${id})`)
      }
    }
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}, 30_000)
