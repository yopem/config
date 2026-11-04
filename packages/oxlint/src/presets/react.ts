import { reactRules } from "@yopem/eslint-plugin/policies"
import { defineConfig } from "oxlint"

import reactDoctorConfig from "./react-doctor-config.js"

export default defineConfig({
  plugins: ["jsx-a11y", "react", "react-perf"],
  jsPlugins: [
    ...(reactDoctorConfig.jsPlugins ?? []),
    {
      name: "react-policy",
      specifier: import.meta.resolve("@yopem/eslint-plugin/react-policy"),
    },
  ],
  rules: { ...reactRules, "react/unsupported-syntax": "error" },
})
