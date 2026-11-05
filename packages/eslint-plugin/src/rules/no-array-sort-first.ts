import { defineRule } from "@oxlint/plugins"

import {
  arrayMethodTarget,
  isKnownArrayExpression,
  unwrapArrayExpression,
} from "@/shared/array-method"

export const noArraySortFirstRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow sorting a known array copy only to read its first item.",
    },
    messages: {
      sortFirst:
        "Avoid sorting the entire array only to read its first item. Consider a single pass if it preserves ordering, sparse-array, and comparator semantics.",
    },
  },
  createOnce(context) {
    return {
      MemberExpression(node) {
        const parent = node.parent

        if (
          (parent.type === "AssignmentExpression" && parent.left === node) ||
          parent.type === "UpdateExpression" ||
          (parent.type === "UnaryExpression" && parent.operator === "delete")
        )
          return

        if (
          !node.computed ||
          node.property.type !== "Literal" ||
          node.property.value !== 0
        )
          return

        const call = unwrapArrayExpression(node.object)

        if (call.type !== "CallExpression" || call.optional) return
        const method = arrayMethodTarget(call.callee)

        if (
          method?.name !== "toSorted" ||
          !isKnownArrayExpression(context.sourceCode, method.object)
        )
          return

        context.report({ node, messageId: "sortFirst" })
      },
    }
  },
})
