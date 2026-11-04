import { defineRule } from "@oxlint/plugins"
import type { ESTree } from "@oxlint/plugins"

import { getAssertionSource } from "../shared/assertion-source.ts"
import { resolveVariable } from "../shared/scope.ts"

export const noCatchVariableTypeAssertionRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow type assertions on catch bindings; narrow caught values instead.",
    },
    messages: {
      unvalidated:
        "Narrow or validate the caught value before using it. JavaScript can throw values that are not Error objects.",
    },
  },
  createOnce(context) {
    function check(node: ESTree.TSAsExpression | ESTree.TSTypeAssertion) {
      if (node.typeAnnotation.type === "TSUnknownKeyword") return
      const expression = getAssertionSource(node)
      if (expression.type !== "Identifier") return
      const variable = resolveVariable(context.sourceCode, expression)
      if (
        variable?.defs.some((definition) => definition.type === "CatchClause")
      ) {
        context.report({ node, messageId: "unvalidated" })
      }
    }
    return { TSAsExpression: check, TSTypeAssertion: check }
  },
})
