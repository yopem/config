import { defineConfig } from "oxlint"
import { RECOMMENDED_RULES } from "oxlint-plugin-react-doctor"

export default defineConfig({
  jsPlugins: [
    {
      name: "react-doctor",
      specifier: new URL("../react-doctor.js", import.meta.url).href,
    },
  ],
  rules: {
    ...RECOMMENDED_RULES,
    "react-doctor/react-in-jsx-scope": "off",
    "react-doctor/jsx-no-jsx-as-prop": "off",
    "react-doctor/jsx-max-depth": "off",
    "react-doctor/only-export-components": "off",
    "react-doctor/context-provider-value-from-unmemoized-local-literal": "off",
  },
})
