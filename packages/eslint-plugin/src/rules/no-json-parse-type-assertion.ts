import { defineRule } from "@oxlint/plugins"
import type { ESTree } from "@oxlint/plugins"

import { getAssertionSource } from "../shared/assertion-source.ts"
import { resolveVariable } from "../shared/scope.ts"

export const noJsonParseTypeAssertionRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow type assertions that treat parsed JSON as validated data.",
    },
    messages: {
      unvalidated:
        "Validate parsed JSON before using it as a domain type. A type assertion does not check data at runtime.",
    },
  },
  createOnce(context) {
    function check(node: ESTree.TSAsExpression | ESTree.TSTypeAssertion) {
      if (node.typeAnnotation.type === "TSUnknownKeyword") return
      const expression = getAssertionSource(node)
      if (expression.type !== "CallExpression") return
      const callee = expression.callee
      if (
        callee.type !== "MemberExpression" ||
        callee.object.type !== "Identifier" ||
        callee.object.name !== "JSON"
      )
        return
      const property = callee.property
      const isParse = callee.computed
        ? property.type === "Literal" && property.value === "parse"
        : property.type === "Identifier" && property.name === "parse"
      if (!isParse) return
      const variable = resolveVariable(context.sourceCode, callee.object)
      if (variable !== null && variable.defs.length > 0) return
      context.report({ node, messageId: "unvalidated" })
    }
    return { TSAsExpression: check, TSTypeAssertion: check }
  },
})
