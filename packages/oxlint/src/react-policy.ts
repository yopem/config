import { defineRule, eslintCompatPlugin } from "@oxlint/plugins"
import type { ESTree, SourceCode } from "@oxlint/plugins"

import { resolveVariable } from "./shared/scope.ts"

function restrictedHookName(
  expression: ESTree.Expression,
  sourceCode: SourceCode,
  seen = new Set<object>(),
): "useCallback" | "useEffect" | "useMemo" | null {
  if (seen.has(expression)) return null
  seen.add(expression)

  if (expression.type === "ChainExpression") {
    return restrictedHookName(expression.expression, sourceCode, seen)
  }

  let name: string | null = null
  if (expression.type === "Identifier") {
    name = expression.name
    const variable = resolveVariable(sourceCode, expression)
    for (const definition of variable?.defs ?? []) {
      const node = definition.node
      if (node.type === "ImportSpecifier") {
        name =
          node.imported.type === "Identifier"
            ? node.imported.name
            : String(node.imported.value)
      } else if (node.type === "VariableDeclarator" && node.init) {
        if (node.id.type === "ObjectPattern") {
          for (const property of node.id.properties) {
            if (
              property.type !== "Property" ||
              property.value.type !== "Identifier" ||
              property.value.name !== expression.name
            )
              continue
            if (!property.computed && property.key.type === "Identifier")
              name = property.key.name
            else if (
              property.key.type === "Literal" &&
              typeof property.key.value === "string"
            )
              name = property.key.value
          }
        } else {
          const hook = restrictedHookName(node.init, sourceCode, seen)
          if (hook) return hook
        }
      }
    }
  } else if (expression.type === "MemberExpression") {
    const property = expression.property
    if (!expression.computed && property.type === "Identifier") {
      name = property.name
    } else if (
      expression.computed &&
      property.type === "Literal" &&
      typeof property.value === "string"
    ) {
      name = property.value
    }
    if (name === "call" || name === "apply" || name === "bind") {
      return restrictedHookName(expression.object, sourceCode, seen)
    }
  }

  return name === "useCallback" || name === "useEffect" || name === "useMemo"
    ? name
    : null
}

export default eslintCompatPlugin({
  meta: { name: "react-policy" },
  rules: {
    "prefer-named-imports": defineRule({
      meta: {
        type: "suggestion",
        schema: [],
        messages: {
          namedImports:
            "Use named imports from React instead of default or namespace imports.",
        },
      },
      createOnce(context) {
        return {
          ImportDeclaration(node) {
            if (node.source.value !== "react") return
            for (const specifier of node.specifiers) {
              if (
                specifier.type !== "ImportSpecifier" ||
                (specifier.imported.type === "Identifier"
                  ? specifier.imported.name
                  : specifier.imported.value) === "default"
              ) {
                context.report({ node: specifier, messageId: "namedImports" })
              }
            }
          },
        }
      },
    }),
    "no-restricted-hooks": defineRule({
      meta: {
        type: "suggestion",
        schema: [],
        messages: {
          useCallback:
            "Rely on React Compiler for memoization instead of useCallback.",
          useEffect:
            "Prefer derived values, event handlers, or framework APIs instead of useEffect.",
          useMemo: "Rely on React Compiler for memoization instead of useMemo.",
        },
      },
      createOnce(context) {
        return {
          CallExpression(node) {
            if (
              node.callee.type === "Super" ||
              node.callee.type === "V8IntrinsicExpression"
            )
              return
            const hook = restrictedHookName(node.callee, context.sourceCode)
            if (hook) context.report({ node, messageId: hook })
          },
        }
      },
    }),
  },
})
