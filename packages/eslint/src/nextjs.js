import nextPlugin from "@next/eslint-plugin-next"
import nextConfig from "eslint-config-next"

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...nextConfig.rules,
      "@next/next/no-duplicate-head": "off",
    },
  },
]
