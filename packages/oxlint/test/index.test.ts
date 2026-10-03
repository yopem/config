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

test("React preset warns on restricted hook calls with actionable messages", () => {
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

    for (const [imports, call, message] of [
      [
        'import { useCallback } from "react";',
        "useCallback(() => {}, [])",
        "Rely on React Compiler for memoization instead of useCallback.",
      ],
      [
        'import { useMemo } from "react";',
        "useMemo(() => 1, [])",
        "Rely on React Compiler for memoization instead of useMemo.",
      ],
      [
        'import { useMemo as memo } from "react";',
        "memo(() => 1, [])",
        "Rely on React Compiler for memoization instead of useMemo.",
      ],
      [
        'import * as React from "react";',
        "React.useMemo(() => 1, [])",
        "Rely on React Compiler for memoization instead of useMemo.",
      ],
      [
        'import { useEffect } from "react";',
        "useEffect(() => {}, [])",
        "Prefer derived values, event handlers, or framework APIs instead of useEffect.",
      ],
      [
        'import { useCallback as callback } from "react";',
        "callback(() => {}, [])",
        "Rely on React Compiler for memoization instead of useCallback.",
      ],
      [
        'import * as React from "react";',
        "React.useCallback(() => {}, [])",
        "Rely on React Compiler for memoization instead of useCallback.",
      ],
      [
        'import React from "react";',
        'React["useEffect"](() => {}, [])',
        "Prefer derived values, event handlers, or framework APIs instead of useEffect.",
      ],
      [
        'import { useCallback } from "react"; const callback = useCallback;',
        "callback(() => {}, [])",
        "Rely on React Compiler for memoization instead of useCallback.",
      ],
      [
        "",
        "useCallback(() => {}, [])",
        "Rely on React Compiler for memoization instead of useCallback.",
      ],
      [
        'import React from "react"; const { useEffect: effect } = React;',
        "effect(() => {}, [])",
        "Prefer derived values, event handlers, or framework APIs instead of useEffect.",
      ],
      [
        'import * as R from "react";',
        "R.useCallback?.(() => {}, [])",
        "Rely on React Compiler for memoization instead of useCallback.",
      ],
      [
        'import { useCallback } from "react";',
        "useCallback.call(null, () => {}, [])",
        "Rely on React Compiler for memoization instead of useCallback.",
      ],
    ]) {
      writeFileSync(
        fixturePath,
        `${imports}\nexport function Component() { ${call}; return null; }`,
      )
      const result = Bun.spawnSync([
        "node",
        oxlintPath,
        "-c",
        configPath,
        fixturePath,
      ])
      const output = result.stdout.toString() + result.stderr.toString()
      expect(result.exitCode).toBe(0)
      expect(output).toContain("react-policy(no-restricted-hooks)")
      expect(output.replace(/\s+/g, " ")).toContain(message)
      expect(output).not.toContain("Failed to load")
    }

    writeFileSync(
      fixturePath,
      'import { useCallback, useEffect, useMemo, useState } from "react"; export function Component() { useState(0); return null; }',
    )
    const result = Bun.spawnSync([
      "node",
      oxlintPath,
      "-c",
      configPath,
      fixturePath,
    ])
    const output = result.stdout.toString() + result.stderr.toString()
    expect(result.exitCode).toBe(0)
    expect(output).not.toContain("react-policy(no-restricted-hooks)")
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
