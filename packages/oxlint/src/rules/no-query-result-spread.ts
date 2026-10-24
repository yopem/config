import { defineRule } from "@oxlint/plugins"
import type { ESTree, Variable } from "@oxlint/plugins"

import {
  resolveArrayBinding,
  unwrapArrayExpression,
} from "../shared/array-method.ts"

const resultHooks = new Set([
  "useQuery",
  "useSuspenseQuery",
  "useInfiniteQuery",
  "useSuspenseInfiniteQuery",
  "useMutation",
])

export const rule = defineRule({
  meta: {
    type: "problem",
    schema: [],
    messages: {
      spread:
        "Do not spread a TanStack Query result. Select the required fields explicitly.",
    },
  },
  createOnce(context) {
    function isHookImport(node: ESTree.Node, namespace: boolean) {
      node = unwrapArrayExpression(node)
      if (node.type !== "Identifier") return false
      const variable = resolveArrayBinding(context.sourceCode, node)
      if (
        !variable ||
        variable.references.some(
          (reference) => reference.isWrite() && !reference.init,
        )
      )
        return false
      return variable.defs.some((definition) => {
        const specifier = definition.node
        if (
          specifier.type !== "ImportSpecifier" &&
          specifier.type !== "ImportNamespaceSpecifier"
        )
          return false
        const declaration = specifier.parent
        if (
          declaration.type !== "ImportDeclaration" ||
          declaration.importKind === "type" ||
          declaration.source.value !== "@tanstack/react-query"
        )
          return false
        if (specifier.type === "ImportNamespaceSpecifier") return namespace
        if (namespace || specifier.importKind === "type") return false
        const name =
          specifier.imported.type === "Identifier"
            ? specifier.imported.name
            : specifier.imported.value
        return resultHooks.has(name)
      })
    }

    function isHookCall(node: ESTree.CallExpression) {
      const callee = unwrapArrayExpression(node.callee)
      if (callee.type === "Identifier") return isHookImport(callee, false)
      if (callee.type !== "MemberExpression") return false
      const property = callee.property
      const name =
        !callee.computed && property.type === "Identifier"
          ? property.name
          : property.type === "Literal" && typeof property.value === "string"
            ? property.value
            : null
      return (
        name !== null &&
        resultHooks.has(name) &&
        isHookImport(callee.object, true)
      )
    }

    function isResult(
      node: ESTree.Node,
      visited = new Set<Variable>(),
    ): boolean {
      node = unwrapArrayExpression(node)
      if (node.type === "CallExpression") return isHookCall(node)
      if (node.type !== "Identifier") return false
      const variable = resolveArrayBinding(context.sourceCode, node)
      if (!variable || visited.has(variable) || variable.defs.length !== 1)
        return false
      visited.add(variable)
      if (
        variable.references.some(
          (reference) => reference.isWrite() && !reference.init,
        )
      )
        return false
      const definition = variable.defs[0]
      if (!definition || definition.type !== "Variable") return false
      const declarator = definition.node
      return (
        declarator.type === "VariableDeclarator" &&
        declarator.id.type === "Identifier" &&
        declarator.parent.type === "VariableDeclaration" &&
        declarator.parent.kind === "const" &&
        declarator.init !== null &&
        isResult(declarator.init, visited)
      )
    }

    return {
      SpreadElement(node) {
        if (
          node.parent.type === "ObjectExpression" &&
          isResult(node.argument)
        ) {
          context.report({ node, messageId: "spread" })
        }
      },
      JSXSpreadAttribute(node) {
        if (isResult(node.argument))
          context.report({ node, messageId: "spread" })
      },
    }
  },
})
