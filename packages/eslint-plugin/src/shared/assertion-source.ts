import type { ESTree } from "@oxlint/plugins"

export function getAssertionSource(
  node: ESTree.TSAsExpression | ESTree.TSTypeAssertion,
) {
  let expression = node.expression
  while (
    expression.type === "ParenthesizedExpression" ||
    expression.type === "TSAsExpression" ||
    expression.type === "TSTypeAssertion"
  ) {
    expression = expression.expression
  }
  return expression.type === "ChainExpression"
    ? expression.expression
    : expression
}
