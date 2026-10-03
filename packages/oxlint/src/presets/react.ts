import { defineConfig } from "oxlint"
import { TANSTACK_QUERY_RULES } from "oxlint-plugin-react-doctor"

import reactDoctorConfig from "./react-doctor-config.js"

export default defineConfig({
  plugins: ["jsx-a11y", "react", "react-perf"],
  jsPlugins: [
    ...(reactDoctorConfig.jsPlugins ?? []),
    {
      name: "react-policy",
      specifier: new URL("../react-policy.js", import.meta.url).href,
    },
  ],
  rules: {
    ...reactDoctorConfig.rules,
    ...TANSTACK_QUERY_RULES,
    "react-policy/no-restricted-hooks": "warn",
    "react-policy/prefer-named-imports": "error",
  },
})
