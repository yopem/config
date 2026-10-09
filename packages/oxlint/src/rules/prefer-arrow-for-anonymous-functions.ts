import { defineRule } from "@oxlint/plugins"

export const preferArrowForAnonymousFunctionsRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require arrow functions instead of anonymous function expressions.",
    },
    messages: {
      preferArrow:
        "Use an arrow function instead of an anonymous function expression. Use a named function if you need its own this or arguments.",
    },
  },
  createOnce(context) {
    return {
      FunctionExpression(node) {
        if (node.id || node.generator) return

        const parent = node.parent
        if (
          parent.type === "MethodDefinition" ||
          (parent.type === "Property" &&
            (parent.method || parent.kind !== "init"))
        )
          return

        context.report({ node, messageId: "preferArrow" })
      },
    }
  },
})
