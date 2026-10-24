import { afterAll, describe, expect, test } from "bun:test"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const directory = mkdtempSync(join(tmpdir(), "oxlint-query-result-spread-"))

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
    rules: { "react-policy/no-query-result-spread": "error" },
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
      code: "react-policy(no-query-result-spread)",
      severity: "error",
    })
  }

  expect(result.exitCode).toBe(output.diagnostics.length === 0 ? 0 : 1)

  return output.diagnostics.length
}

const hooks = [
  "useQuery",
  "useSuspenseQuery",
  "useInfiniteQuery",
  "useSuspenseInfiniteQuery",
  "useMutation",
]

describe("no-query-result-spread", () => {
  for (const hook of hooks) {
    for (const source of [
      `import { ${hook} } from '@tanstack/react-query'; const result = ${hook}({}); const copy = { ...result }`,
      `import { ${hook} as read } from '@tanstack/react-query'; const result = read({}); const alias = result; const other = alias; const view = <View {...other} />`,
      `import * as rq from '@tanstack/react-query'; const result = rq.${hook}({}); const copy = { ...result }`,
      `import * as rq from '@tanstack/react-query'; const copy = { ...rq['${hook}']({}) }`,
      `import { ${hook} } from '@tanstack/react-query'; const view = <View {...${hook}({})} />`,
    ]) {
      test(source, () => expect(lint(source)).toBe(1))
    }
  }

  for (const source of [
    "import { useQuery } from '@tanstack/react-query'; export function useCustom() { const query = useQuery({}); return { ...query, extra: true } }",
    "import { useQuery } from '@tanstack/react-query'; const query = useQuery({}); const alias = (query satisfies object); const copy = { ...(alias as object) }",
    "import { useQuery } from '@tanstack/react-query'; function read() { return { ...useQuery({}) } }",
    "import { useQuery } from '@tanstack/react-query'; const query = useQuery({}); function read() { return <View {...query} /> }",
  ]) {
    test(source, () => expect(lint(source)).toBe(1))
  }

  for (const source of [
    "const query = {}; const copy = { ...query }",
    "const useQuery = () => ({}); const result = useQuery(); const copy = { ...result }",
    "import { useQuery } from './query'; const query = useQuery({}); const copy = { ...query }",
    "import * as rq from './query'; const copy = { ...rq.useQuery({}) }",
    "import rq from '@tanstack/react-query'; const copy = { ...rq.useQuery({}) }",
    "import type { useQuery } from '@tanstack/react-query'; const copy = { ...useQuery({}) }",
    "import { type useQuery } from '@tanstack/react-query'; const copy = { ...useQuery({}) }",
    "import type * as rq from '@tanstack/react-query'; const copy = { ...rq.useQuery({}) }",
    "import { useQuery } from '@tanstack/react-query'; function read(useQuery) { const query = useQuery({}); return { ...query } }",
    "import * as rq from '@tanstack/react-query'; function read(rq) { return <View {...rq.useQuery({})} /> }",
    "import { useQuery } from '@tanstack/react-query'; const query = useQuery({}); function read(query) { return { ...query } }",
    "import { useQuery } from '@tanstack/react-query'; const query = useQuery({}); { const query = {}; const copy = <View {...query} /> }",
    "import { useQuery } from '@tanstack/react-query'; const options = { queryKey: ['key'] }; const query = useQuery({ ...options }); const copy = { ...options }",
    "import { useQuery } from '@tanstack/react-query'; let query = useQuery({}); query = {}; const copy = { ...query }",
    "import { useQuery } from '@tanstack/react-query'; var query = useQuery({}); const copy = { ...query }",
    "import { useQuery } from '@tanstack/react-query'; const query = useQuery({}); let alias = query; const copy = <View {...alias} />",
    "import { useQuery } from '@tanstack/react-query'; const query = useQuery({}); const alias = query; alias = {}; const copy = { ...alias }",
    "import { useQuery } from '@tanstack/react-query'; const query = useQuery({}); const { data } = query; const copy = { ...data }",
    "import { useQuery } from '@tanstack/react-query'; const query = useQuery({}); const holder = { query }; const copy = { ...holder.query }",
    "import { useQueries } from '@tanstack/react-query'; const queries = useQueries({ queries: [] }); const copy = { ...queries[0] }",
    "import { queryOptions } from '@tanstack/react-query'; const options = queryOptions({}); const copy = { ...options }",
    "import * as rq from '@tanstack/react-query'; const key = 'useQuery'; const copy = { ...rq[key]({}) }",
    "import { useQuery } from '@tanstack/react-query'; const query = useQuery({}); consume(...query); const items = [...query]",
    "import { useQuery } from '@tanstack/react-query'; const first = second; const second = first; const copy = { ...first }",
  ]) {
    test(source, () => expect(lint(source)).toBe(0))
  }

  test("shadowed references do not hide violations in outer scope", () => {
    expect(
      lint(
        "import { useQuery } from '@tanstack/react-query'; const query = useQuery({}); function read(query) { return { ...query } }; const copy = { ...query }; const view = <View {...query} />",
      ),
    ).toBe(2)
  })
})
