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
    "react-doctor/prefer-dynamic-import": "off",
    "react/unsupported-syntax": "error",
    "react-policy/no-restricted-hooks": ["error", { restrictUseEffect: true }],
    "react-policy/require-export-function": "error",
    "react-policy/no-query-result-spread": "error",
    "react-policy/prefer-named-imports": "error",
    "react-policy/require-lucide-icon-suffix": "error",
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react",
            importNames: ["useEffect", "useCallback", "useMemo"],
            message:
              "Use derived values, event handlers, framework APIs, and React Compiler.",
          },
        ],
      },
    ],
  },
})
