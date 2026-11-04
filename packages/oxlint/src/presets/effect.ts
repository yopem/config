import { effectRules } from "@yopem/eslint-plugin/policies"
import { defineConfig } from "oxlint"
export default defineConfig({
  jsPlugins: [
    {
      name: "effect",
      specifier: import.meta.resolve("@yopem/eslint-plugin/effect"),
    },
  ],
  rules: effectRules,
})
