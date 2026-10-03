import { defineConfig } from "oxlint";
import { RECOMMENDED_RULES } from "oxlint-plugin-react-doctor";

export default defineConfig({
  jsPlugins: [
    {
      name: "react-doctor",
      specifier: import.meta.resolve("oxlint-plugin-react-doctor"),
    },
  ],
  rules: {
    ...RECOMMENDED_RULES,
    "react-doctor/react-in-jsx-scope": "off",
    "react-doctor/jsx-no-jsx-as-prop": "off",
    "react-doctor/jsx-max-depth": "off",
    "react-doctor/only-export-components": "off",
  },
});
