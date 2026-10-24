import { afterAll, describe, expect, test } from "bun:test"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const directory = mkdtempSync(join(tmpdir(), "oxlint-restricted-hooks-"))

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
    rules: {
      "react-policy/no-restricted-hooks": [
        "error",
        { restrictUseEffect: true },
      ],
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
      diagnostic.code !== "react-policy(no-restricted-hooks)"
    ) {
      throw new Error(`Unexpected diagnostic: ${JSON.stringify(diagnostic)}`)
    }
  }

  expect(result.exitCode).toBe(output.diagnostics.length > 0 ? 1 : 0)

  return output.diagnostics.length
}

describe("no-restricted-hooks runtime React provenance", () => {
  for (const hook of ["useCallback", "useEffect", "useMemo"]) {
    for (const source of [
      `import { ${hook} } from 'react'; ${hook}(() => {})`,
      `import { ${hook} as hook } from 'react'; hook(() => {})`,
      `import { '${hook}' as hook } from 'react'; hook(() => {})`,
      `import React from 'react'; React.${hook}(() => {})`,
      `import * as R from 'react'; R.${hook}(() => {})`,
      `import { default as R } from 'react'; R.${hook}(() => {})`,
      `import React from 'react'; React['${hook}'](() => {})`,
      `import * as R from 'react'; R[\`${hook}\`](() => {})`,
      `import React from 'react'; React?.['${hook}']?.(() => {})`,
      `import { ${hook} as hook } from 'react'; const first = hook; const second = first; second(() => {})`,
      `import React from 'react'; const first = React; const second = first; second.${hook}(() => {})`,
      `import * as R from 'react'; const hook = R['${hook}']; const alias = hook; alias(() => {})`,
      `import React from 'react'; const { ${hook}: hook } = React; hook(() => {})`,
      `import * as R from 'react'; const { ['${hook}']: hook } = R; const alias = hook; alias(() => {})`,
      `import React from 'react'; const namespace = React; const { ${hook} } = namespace; ${hook}(() => {})`,
      `import { ${hook} as hook } from 'react'; hook.call(null, () => {})`,
      `import * as R from 'react'; R.${hook}['apply'](null, [])`,
      `import React from 'react'; React.${hook}.bind(null)`,
      `import { ${hook} as hook } from 'react'; function run() { hook(() => {}) }`,
    ]) {
      test(source, () => expect(lint(source)).toBe(1))
    }
  }

  for (const source of [
    "useMemo(() => {})",
    "function useMemo() {}; useMemo()",
    "const useEffect = () => {}; useEffect()",
    "const cache = { useMemo() {} }; cache.useMemo()",
    "const cache = { useMemo() {} }; cache['useMemo']()",
    "const cache = { useMemo() {} }; const { useMemo } = cache; useMemo()",
    "import { useMemo } from './cache'; useMemo()",
    "import React from './cache'; React.useMemo()",
    "import * as React from 'react/cache'; React.useMemo()",
    "import type { useMemo } from 'react'; useMemo()",
    "import { type useMemo } from 'react'; useMemo()",
    "import type React from 'react'; React.useMemo()",
    "import type * as React from 'react'; React.useMemo()",
    "import { type default as React } from 'react'; React.useMemo()",
    "import { useState as useMemo } from 'react'; useMemo()",
    "import { react as cache } from 'react'; cache.useMemo()",
    "import { useMemo } from 'react'; useMemo(); useMemo = local",
    "import React from 'react'; React.useMemo(); React = local",
    "import React from 'react'; const { useMemo } = React; const next = useMemo; useMemo = local; next()",
    "import React from 'react'; let namespace = React; const alias = namespace; alias.useMemo()",
    "import React from 'react'; const { ['useMemo']: hook } = cache; hook()",
    "import { type useMemo as hook, useState } from 'react'; hook()",
    "import React from 'react'; React.cache.useMemo()",
    "import { useMemo } from 'react'; useMemo.useMemo()",
    "import { useMemo } from 'react'; function run(useMemo) { useMemo() }",
    "import React from 'react'; function run(React) { React.useMemo() }",
    "import { useMemo } from 'react'; { const useMemo = () => {}; useMemo() }",
    "import React from 'react'; let alias = React; alias.useMemo()",
    "import { useMemo } from 'react'; let alias = useMemo; alias()",
    "import { useMemo } from 'react'; var alias = useMemo; alias()",
    "import React from 'react'; let { useMemo } = React; useMemo()",
    "import { useMemo } from 'react'; useMemo = local; useMemo()",
    "import React from 'react'; React = local; React.useMemo()",
    "import * as React from 'react'; React = local; const alias = React; alias.useMemo()",
    "import { useMemo } from 'react'; const alias = useMemo; alias = local; alias()",
    "import React from 'react'; const alias = React; alias = local; alias.useMemo()",
    "import React from 'react'; const { useMemo } = React; useMemo = local; useMemo()",
    "import React from 'react'; const { useMemo = local } = React; useMemo()",
    "import React from 'react'; const { cache: { useMemo } } = React; useMemo()",
    "import React from 'react'; const { ...cache } = React; cache.useMemo()",
    "import React from 'react'; React[key]()",
    "import React from 'react'; React[`use${kind}`]()",
    "const first = second; const second = first; first()",
    "import { useMemo } from 'react'; const alias = useMemo; function run(alias) { alias() }",
    "import React from 'react'; const { useMemo } = cache; useMemo()",
    "import { useMemo } from 'react'",
  ]) {
    test(source, () => expect(lint(source)).toBe(0))
  }

  test("shadowed calls do not hide imported calls", () => {
    expect(
      lint(
        "import { useMemo } from 'react'; function run(useMemo) { useMemo() }; useMemo(() => {})",
      ),
    ).toBe(1)
  })
})
