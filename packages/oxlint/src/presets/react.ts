import { defineConfig } from "oxlint"
import { TANSTACK_QUERY_RULES } from "oxlint-plugin-react-doctor"

import reactDoctorConfig from "./react-doctor-config.js"

export default defineConfig({
  plugins: ["jsx-a11y", "react", "react-perf"],
  jsPlugins: reactDoctorConfig.jsPlugins,
  rules: {
    ...reactDoctorConfig.rules,
    ...TANSTACK_QUERY_RULES,
    "no-restricted-imports": [
      "warn",
      {
        paths: [
          {
            name: "react",
            importNames: ["useCallback"],
            message:
              "Rely on React Compiler for memoization instead of useCallback.",
          },
          {
            name: "react",
            importNames: ["useEffect"],
            message:
              "Prefer derived values, event handlers, or framework APIs instead of useEffect.",
          },
        ],
      },
    ],
  },
})
