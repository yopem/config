import { describe, expect, test } from "bun:test"

import baseConfig from "@yopem/oxlint-config"
import reactConfig from "@yopem/oxlint-config/react"

describe("retained instruction policies", () => {
  test("base requires specific suppressions", () => {
    expect(baseConfig.rules?.["quality/require-specific-suppression"]).toBe(
      "error",
    )
  })
  test("React requires Lucide icon suffixes", () => {
    expect(reactConfig.rules?.["react-policy/require-lucide-icon-suffix"]).toBe(
      "error",
    )
  })
})
