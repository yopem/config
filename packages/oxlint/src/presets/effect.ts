import { defineConfig } from "oxlint"
export default defineConfig({
  jsPlugins: [
    {
      name: "effect",
      specifier: import.meta
        .resolve("@yopem/oxlint-config/plugins/effect/index"),
    },
  ],
  rules: {
    "effect/no-manual-effect-error-tag": "error",
    "effect/no-manual-tag-comparison": "error",
    "effect/no-manual-tagged-construction": "error",
    "effect/no-service-constructor-imports": "error",
    "effect/prefer-effect-match": "error",
  },
})
