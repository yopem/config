import { defineConfig } from "oxlint";
import { TANSTACK_QUERY_RULES } from "oxlint-plugin-react-doctor";
import reactDoctorConfig from "./react-doctor-config.js";

export default defineConfig({
  plugins: ["jsx-a11y", "react", "react-perf"],
  jsPlugins: reactDoctorConfig.jsPlugins,
  rules: { ...reactDoctorConfig.rules, ...TANSTACK_QUERY_RULES },
});
