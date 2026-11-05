import { expect, test } from "bun:test"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import config from "./index.ts"

const packageDir = join(import.meta.dir, "..")

async function run(args: string[], cwd: string) {
  const process = Bun.spawn(args, { cwd, stdout: "pipe", stderr: "pipe" })

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ])

  if (exitCode !== 0) {
    throw new Error(
      `Command failed (${exitCode}): ${args.join(" ")}\n${stderr}`,
    )
  }

  return stdout
}

test("generated JSON and Bun template follow the TypeScript config", async () => {
  const jsonPath = join(packageDir, "src/.oxfmtrc.json")
  const templatePath = join(packageDir, "bunfig.toml")
  const originalJson = await readFile(jsonPath, "utf8")
  const originalTemplate = await readFile(templatePath, "utf8")

  await run(["bun", "run", "sync:bun"], packageDir)
  expect(await readFile(jsonPath, "utf8")).toBe(originalJson)
  expect(await readFile(templatePath, "utf8")).toBe(originalTemplate)

  const json: unknown = JSON.parse(
    await readFile(join(packageDir, "src/.oxfmtrc.json"), "utf8"),
  )

  expect(json).toEqual(config)

  const template = Bun.TOML.parse(
    await readFile(join(packageDir, "bunfig.toml"), "utf8"),
  )

  expect(template).toEqual({
    fmt: {
      bracketSpacing: config.bracketSpacing,
      jsxSingleQuote: config.jsxSingleQuote,
      printWidth: config.printWidth,
      proseWrap: config.proseWrap,
      semi: config.semi,
      singleQuote: config.singleQuote,
      tabWidth: config.tabWidth,
      trailingComma: config.trailingComma,
      ignorePatterns: config.ignorePatterns,
      sortPackageJson: true,
      sortImports: config.sortImports,
      sortTailwindcss: config.experimentalTailwindcss,
    },
  })
})

test("Bun formats a consumer project with the template and respects ignores", async () => {
  const dir = await mkdtemp(join(tmpdir(), "yopem-bun-fmt-"))

  try {
    await writeFile(
      join(dir, "bunfig.toml"),
      await readFile(join(packageDir, "bunfig.toml")),
    )
    await writeFile(
      join(dir, "index.ts"),
      'import { b } from "./b"\nimport type { Z } from "z"\nimport { a } from "node:fs"\nconst value = {message:\'hello\'};\n',
    )
    await writeFile(join(dir, "AGENTS.md"), "ignored   content\n")
    await run(["bun", "fmt", "."], dir)
    expect(await readFile(join(dir, "index.ts"), "utf8")).toBe(
      'import type { Z } from "z"\n\nimport { a } from "node:fs"\n\nimport { b } from "./b"\nconst value = { message: "hello" }\n',
    )
    expect(await readFile(join(dir, "AGENTS.md"), "utf8")).toBe(
      "ignored   content\n",
    )
    await run(["bun", "fmt", "--check", "."], dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("package exports the JSON, JavaScript config, types, and Bun template", async () => {
  const output = await run(["npm", "pack", "--dry-run", "--json"], packageDir)
  expect(output).toContain('"path": "src/.oxfmtrc.json"')
  expect(output).toContain('"path": "dist/index.js"')
  expect(output).toContain('"path": "dist/index.d.ts"')
  expect(output).toContain('"path": "bunfig.toml"')

  const resolved = await run(
    [
      "node",
      "--input-type=module",
      "-e",
      `
      import config from "@yopem/oxfmt-config/config"
      import { createRequire } from "node:module"
      import { strict as assert } from "node:assert"
      const require = createRequire(import.meta.url)
      assert.deepEqual(config, require("@yopem/oxfmt-config"))
      assert.deepEqual(config, require("@yopem/oxfmt-config/oxfmtrc.json"))
      console.info(import.meta.resolve("@yopem/oxfmt-config/bunfig.toml"))
    `,
    ],
    packageDir,
  )

  expect(resolved).toContain("bunfig.toml")
})
