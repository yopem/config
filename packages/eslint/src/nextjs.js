import nextPlugin from "@next/eslint-plugin-next"
import yopem from "@yopem/eslint-plugin"

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  ...yopem.configs.nextjs,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-duplicate-head": "off",
    },
  },
]
