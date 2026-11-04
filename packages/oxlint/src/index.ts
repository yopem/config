import { baseRules, ignorePatterns } from "@yopem/eslint-plugin/policies"
import { defineConfig } from "oxlint"

export default defineConfig({
  options: {
    typeAware: true,
    typeCheck: true,
  },
  plugins: ["eslint", "import", "oxc", "promise", "typescript", "unicorn"],
  jsPlugins: [
    import.meta.resolve("eslint-plugin-oxfmt"),
    {
      name: "quality",
      specifier: import.meta.resolve("@yopem/eslint-plugin/quality"),
    },
    {
      name: "stylistic",
      specifier: import.meta.resolve("@yopem/eslint-plugin/stylistic"),
    },
  ],
  categories: { correctness: "error" },
  env: { builtin: true },
  rules: baseRules,
  overrides: [
    {
      files: ["**/env.ts", "**/env/**"],
      rules: { "quality/no-environment-access": "off" },
    },
  ],
  ignorePatterns,
})
