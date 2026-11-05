import { defineRule } from "@oxlint/plugins"
import type { ESTree } from "@oxlint/plugins"

import {
  arrayMethodTarget,
  isKnownArrayExpression,
  unwrapArrayExpression,
} from "@/shared/array-method"

function isExistenceComparison(
  operator: ESTree.BinaryExpression["operator"],
  number: number,
  lengthOnLeft: boolean,
) {
  if (number === 0) {
    return (
      operator === "==" ||
      operator === "===" ||
      operator === "!=" ||
      operator === "!==" ||
      (lengthOnLeft ? operator === ">" : operator === "<") ||
      (lengthOnLeft ? operator === "<=" : operator === ">=")
    )
  }

  return (
    number === 1 &&
    ((lengthOnLeft ? operator === ">=" : operator === "<=") ||
      (lengthOnLeft ? operator === "<" : operator === ">"))
  )
}

export const noArrayFilterExistenceRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow filtering a known array only to check whether a match exists.",
    },
    messages: {
      filterExistence:
        "Avoid creating a filtered array just to check for a match. Consider `some` if its short-circuit behavior preserves callback side effects.",
    },
  },
  createOnce(context) {
    return {
      BinaryExpression(node) {
        for (const [lengthNode, numberNode, lengthOnLeft] of [
          [node.left, node.right, true],
          [node.right, node.left, false],
        ] as const) {
          const number = unwrapArrayExpression(numberNode)
          const length = arrayMethodTarget(lengthNode)

          if (
            number.type !== "Literal" ||
            (number.value !== 0 && number.value !== 1) ||
            !isExistenceComparison(node.operator, number.value, lengthOnLeft) ||
            length?.name !== "length"
          )
            continue

          const call = unwrapArrayExpression(length.object)

          if (call.type !== "CallExpression" || call.optional) continue
          const filter = arrayMethodTarget(call.callee)

          if (
            filter?.name !== "filter" ||
            !isKnownArrayExpression(context.sourceCode, filter.object)
          )
            continue

          context.report({ node, messageId: "filterExistence" })

          return
        }
      },
    }
  },
})
