/// <reference types="./types.d.ts" />

import fs from "fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { includeIgnoreFile } from "@eslint/compat"
import eslint from "@eslint/js"
import yopem from "@yopem/eslint-plugin"
import { baseRules, ignorePatterns } from "@yopem/eslint-plugin/policies"
import eslintConfigPrettier from "eslint-config-prettier"
import importPlugin from "eslint-plugin-import"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import tseslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const gitignorePath = path.resolve(__dirname, ".gitignore")

const prettierignorePath = path.resolve(__dirname, ".prettierignore")

const nativeRules = Object.fromEntries(
  Object.entries(baseRules).filter(
    ([name]) => !name.startsWith("typescript/") && !name.startsWith("oxc/"),
  ),
)

const typedRules = Object.fromEntries(
  Object.entries(baseRules)
    .filter(([name]) => !name.startsWith("oxc/"))
    .flatMap(([name, setting]) => {
      if (name.startsWith("typescript/"))
        return [[name.replace("typescript/", "@typescript-eslint/"), setting]]

      if (tseslint.plugin.rules[name]?.meta.docs?.extendsBaseRule)
        return [
          [name, "off"],
          [`@typescript-eslint/${name}`, setting],
        ]

      return [[name, setting]]
    }),
)

export default tseslint.config(
  fs.existsSync(gitignorePath) ? includeIgnoreFile(gitignorePath) : {},
  fs.existsSync(prettierignorePath)
    ? includeIgnoreFile(prettierignorePath)
    : {},
  { ignores: ignorePatterns },

  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}"],
    plugins: {
      import: importPlugin,
    },
    extends: [eslint.configs.recommended, ...yopem.configs.recommended],
    rules: nativeRules,
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      ...typedRules,
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: true,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/unbound-method": "off",
    },
    languageOptions: { parserOptions: { projectService: true } },
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
  },
)

export const restrictEnvAccess = tseslint.config(
  { ignores: ["**/env.ts"] },
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
    rules: {
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message:
            "Use `import env from '@/env'` instead to ensure validated types.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          name: "process",
          importNames: ["env"],
          message:
            "Use `import env from '@/env'` instead to ensure validated types.",
        },
      ],
    },
  },
)
