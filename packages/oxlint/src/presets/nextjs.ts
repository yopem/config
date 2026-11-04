import { nextjsRules } from "@yopem/eslint-plugin/policies"
import { defineConfig } from "oxlint"

import reactDoctorConfig from "./react-doctor-config.js"

export default defineConfig({
  plugins: ["nextjs"],
  jsPlugins: reactDoctorConfig.jsPlugins,
  rules: nextjsRules,
})
