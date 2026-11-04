import { tanstackStartRules } from "@yopem/eslint-plugin/policies"
import { defineConfig } from "oxlint"

import reactDoctorConfig from "./react-doctor-config.js"

export default defineConfig({
  jsPlugins: reactDoctorConfig.jsPlugins,
  rules: tanstackStartRules,
})
