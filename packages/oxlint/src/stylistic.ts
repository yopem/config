import { eslintCompatPlugin } from "@oxlint/plugins";

import { requireReadableSpacingRule } from "./rules/require-readable-spacing.ts";

export default eslintCompatPlugin({
  meta: { name: "stylistic" },
  rules: { "require-readable-spacing": requireReadableSpacingRule },
});
