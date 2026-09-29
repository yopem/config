import { defineConfig } from "oxlint";
import baseConfig from "../index.js";

export default defineConfig({
  jsPlugins: [
    {
      name: "better-tailwindcss",
      specifier: import.meta.resolve("@yopem/oxlint-config/plugins/tailwindcss"),
    },
  ],
  rules: {
    "better-tailwindcss/enforce-canonical-classes": "error",
    "better-tailwindcss/enforce-consistent-class-order": "off",
    "better-tailwindcss/enforce-consistent-line-wrapping": "off",
    "better-tailwindcss/enforce-shorthand-classes": "error",
    "better-tailwindcss/no-conflicting-classes": "error",
    "better-tailwindcss/no-deprecated-classes": "error",
    "better-tailwindcss/no-duplicate-classes": "warn",
    "better-tailwindcss/no-restricted-classes": "error",
    "better-tailwindcss/no-unknown-classes": "off",
    "better-tailwindcss/no-unnecessary-whitespace": "warn",
  },
  settings: {
    "better-tailwindcss": {
      entryPoint: "./src/styles/globals.css",
    },
  },
  extends: [baseConfig],
});
