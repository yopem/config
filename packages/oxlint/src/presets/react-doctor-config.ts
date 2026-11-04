import { reactDoctorRules } from "@yopem/eslint-plugin/policies"
import { defineConfig } from "oxlint"

export default defineConfig({
  jsPlugins: [
    {
      name: "react-doctor",
      specifier: import.meta.resolve("@yopem/eslint-plugin/react-doctor"),
    },
  ],
  rules: reactDoctorRules,
})
