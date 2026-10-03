import { defineConfig } from "oxlint"
import { REACT_NATIVE_RULES } from "oxlint-plugin-react-doctor"

import reactDoctorConfig from "./react-doctor-config.js"

export default defineConfig({
  jsPlugins: reactDoctorConfig.jsPlugins,
  rules: { ...reactDoctorConfig.rules, ...REACT_NATIVE_RULES },
})
