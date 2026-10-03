import { defineConfig } from "oxlint";
import { TANSTACK_START_RULES } from "oxlint-plugin-react-doctor";
import reactDoctorConfig from "./react-doctor-config.js";

export default defineConfig({
  jsPlugins: reactDoctorConfig.jsPlugins,
  rules: { ...reactDoctorConfig.rules, ...TANSTACK_START_RULES },
});
