import { defineConfig } from "oxlint"
import { NEXTJS_RULES } from "oxlint-plugin-react-doctor"

import reactDoctorConfig from "./react-doctor-config.js"

export default defineConfig({
  plugins: ["nextjs"],
  jsPlugins: reactDoctorConfig.jsPlugins,
  rules: { ...reactDoctorConfig.rules, ...NEXTJS_RULES },
})
