import tailwindcss from "eslint-plugin-tailwindcss"

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      tailwindcss: tailwindcss,
    },
    rules: {
      ...tailwindcss.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        React: "writable",
      },
    },
  },
]
