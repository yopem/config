import { defineRule } from "@oxlint/plugins"
import type { ESTree } from "@oxlint/plugins"

import { resolveVariable } from "../shared/scope.ts"

function propertyName(node: ESTree.MemberExpression | ESTree.BindingProperty) {
  const property = node.type === "Property" ? node.key : node.property
  if (!node.computed && property.type === "Identifier") return property.name
  if (property.type === "Literal" && typeof property.value === "string")
    return property.value
  return null
}

export const noEnvironmentAccessRule = defineRule({
  meta: {
    type: "problem",
    schema: [],
    messages: {
      boundary:
        "Read environment values in the environment adapter. Import validated configuration elsewhere.",
    },
  },
  createOnce(context) {
    function isRuntime(expression: ESTree.Expression): boolean {
      if (expression.type === "Identifier") {
        const variable = resolveVariable(context.sourceCode, expression)
        if (!variable || variable.defs.length === 0) {
          return expression.name === "process" || expression.name === "Bun"
        }
        return variable.defs.some((definition) => {
          const node = definition.node
          if (
            node.type !== "ImportDefaultSpecifier" &&
            node.type !== "ImportNamespaceSpecifier"
          )
            return false
          const declaration = node.parent
          return (
            declaration.type === "ImportDeclaration" &&
            (declaration.source.value === "process" ||
              declaration.source.value === "node:process" ||
              declaration.source.value === "bun")
          )
        })
      }
      if (
        expression.type !== "MemberExpression" ||
        expression.object.type !== "Identifier" ||
        expression.object.name !== "globalThis"
      )
        return false
      const variable = resolveVariable(context.sourceCode, expression.object)
      return (
        (!variable || variable.defs.length === 0) &&
        (propertyName(expression) === "process" ||
          propertyName(expression) === "Bun")
      )
    }
    function checkRuntime(node: ESTree.MemberExpression) {
      if (propertyName(node) !== "env") return
      if (
        node.object.type === "MetaProperty" &&
        node.object.meta.name === "import"
      ) {
        context.report({ node, messageId: "boundary" })
      } else if (isRuntime(node.object)) {
        context.report({ node, messageId: "boundary" })
      }
    }
    return {
      MemberExpression: checkRuntime,
      VariableDeclarator(node) {
        if (
          node.id.type !== "ObjectPattern" ||
          !node.init ||
          !isRuntime(node.init)
        )
          return
        for (const property of node.id.properties) {
          if (
            property.type === "Property" &&
            propertyName(property) === "env"
          ) {
            context.report({ node: property, messageId: "boundary" })
          }
        }
      },
      ImportDeclaration(node) {
        if (
          node.importKind === "type" ||
          !["process", "node:process", "bun"].includes(
            String(node.source.value),
          )
        )
          return
        for (const specifier of node.specifiers) {
          if (
            specifier.type !== "ImportSpecifier" ||
            specifier.importKind === "type"
          )
            continue
          const name =
            specifier.imported.type === "Identifier"
              ? specifier.imported.name
              : specifier.imported.value
          if (name === "env")
            context.report({ node: specifier, messageId: "boundary" })
        }
      },
    }
  },
})
