import { defineConfig } from "oxlint";
import { ALL_REACT_DOCTOR_RULES } from "oxlint-plugin-react-doctor";

export default defineConfig({
  jsPlugins: [
    {
      name: "react-doctor",
      specifier: import.meta.resolve("oxlint-plugin-react-doctor"),
    },
  ],
  rules: ALL_REACT_DOCTOR_RULES,
});
