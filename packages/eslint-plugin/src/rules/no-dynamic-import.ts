import { defineRule } from "@oxlint/plugins"

export const noDynamicImportRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow dynamic imports. Use static imports instead.",
    },
    messages: {
      dynamicImport: "Replace this dynamic import with a static import.",
    },
  },
  createOnce(context) {
    return {
      ImportExpression(node) {
        context.report({ node, messageId: "dynamicImport" })
      },
    }
  },
})
