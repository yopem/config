import baseConfig from "@yopem/oxlint-config"

export default {
  extends: [baseConfig],
  env: { node: true },
  ignorePatterns: ["packages/oxlint/src/**"],
}
