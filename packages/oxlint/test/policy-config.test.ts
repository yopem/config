import { describe, expect, test } from "bun:test"

import baseConfig from "@yopem/oxlint-config"
import reactConfig from "@yopem/oxlint-config/react"

describe("instruction checks in existing presets", () => {
  test("base enables static source policies", () => {
    expect(baseConfig.rules?.["quality/require-specific-suppression"]).toBe(
      "error",
    )
    expect(baseConfig.rules?.["quality/no-dynamic-import"]).toBe("error")
    expect(baseConfig.rules?.["quality/no-reexport-only-modules"]).toBe("error")
    expect(baseConfig.rules?.["quality/no-environment-access"]).toBe("error")
    expect(baseConfig.rules?.["typescript/no-unsafe-type-assertion"]).toBe(
      "error",
    )
    expect(baseConfig.rules?.["typescript/ban-ts-comment"]).toBe("error")
    expect(baseConfig.overrides).toContainEqual({
      files: ["**/env.ts", "**/env/**"],
      rules: { "quality/no-environment-access": "off" },
    })
  })
  test("React enables declarations, query spreads, hooks, and compiler restrictions", () => {
    expect(reactConfig.rules?.["react-policy/no-restricted-hooks"]).toEqual([
      "error",
      { restrictUseEffect: true },
    ])
    expect(reactConfig.rules?.["react-policy/require-export-function"]).toBe(
      "error",
    )
    expect(reactConfig.rules?.["react-policy/require-lucide-icon-suffix"]).toBe(
      "error",
    )
    expect(reactConfig.rules?.["react-policy/no-query-result-spread"]).toBe(
      "error",
    )
    expect(reactConfig.rules?.["react/unsupported-syntax"]).toBe("error")
    expect(reactConfig.rules?.["react-doctor/prefer-dynamic-import"]).toBe(
      "off",
    )
    expect(reactConfig.rules?.["no-restricted-imports"]).toEqual([
      "error",
      {
        paths: [
          {
            name: "react",
            importNames: ["useEffect", "useCallback", "useMemo"],
            message:
              "Use derived values, event handlers, framework APIs, and React Compiler.",
          },
        ],
      },
    ])
  })
})
