import { defineRule, eslintCompatPlugin } from "@oxlint/plugins"
import type { ESTree, SourceCode } from "@oxlint/plugins"
import upstream from "oxlint-plugin-react-doctor"
import type { EsTreeNode } from "oxlint-plugin-react-doctor"

import { resolveVariable } from "./shared/scope.ts"

function isStyleXProps(
  sourceCode: SourceCode,
  expression: ESTree.Expression,
): boolean {
  if (expression.type !== "CallExpression") return false
  const callee = expression.callee
  const identifier =
    callee.type === "Identifier"
      ? callee
      : callee.type === "MemberExpression" &&
          callee.object.type === "Identifier" &&
          (callee.computed
            ? callee.property.type === "Literal" &&
              callee.property.value === "props"
            : callee.property.type === "Identifier" &&
              callee.property.name === "props")
        ? callee.object
        : null
  if (identifier === null) return false
  const variable = resolveVariable(sourceCode, identifier)
  return (
    variable?.defs.some((definition) => {
      if (
        definition.type !== "ImportBinding" ||
        definition.parent?.type !== "ImportDeclaration" ||
        definition.parent.source.value !== "@stylexjs/stylex"
      )
        return false
      const specifier = definition.node
      return callee.type === "Identifier"
        ? specifier.type === "ImportSpecifier" &&
            (specifier.imported.type === "Identifier"
              ? specifier.imported.name
              : specifier.imported.value) === "props"
        : specifier.type === "ImportNamespaceSpecifier" ||
            specifier.type === "ImportDefaultSpecifier"
    }) ?? false
  )
}

const spreadRules = eslintCompatPlugin({
  meta: { name: "react-doctor" },
  rules: {
    "jsx-props-no-spreading": defineRule({
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow hidden JSX props except imported StyleX props calls.",
        },
        messages: {
          spread:
            "You can't tell what props reach this element when you spread them.",
        },
      },
      createOnce(context) {
        return {
          JSXSpreadAttribute(node) {
            if (isStyleXProps(context.sourceCode, node.argument)) return
            const doctor = context.settings["react-doctor"]
            const options =
              typeof doctor === "object" &&
              doctor !== null &&
              "jsxPropsNoSpreading" in doctor
                ? doctor.jsxPropsNoSpreading
                : null
            if (typeof options === "object" && options !== null) {
              if (
                "explicitSpread" in options &&
                options.explicitSpread === "ignore" &&
                node.argument.type === "ObjectExpression" &&
                !node.argument.properties.some(
                  (property) => property.type === "SpreadElement",
                )
              )
                return
              if (node.parent.type !== "JSXOpeningElement") return
              const name = context.sourceCode.getText(node.parent.name)
              const custom = /^[A-Z]/.test(name) || name.includes(".")
              const ignored = custom
                ? "custom" in options && options.custom === "ignore"
                : "html" in options && options.html === "ignore"
              const exception =
                "exceptions" in options &&
                Array.isArray(options.exceptions) &&
                options.exceptions.includes(name)
              if (ignored ? !exception : exception) return
            }
            context.report({ node, messageId: "spread" })
          },
        }
      },
    }),
  },
})

const arrayRule = upstream.rules["jsx-no-new-array-as-prop"]

export default {
  ...upstream,
  rules: {
    ...upstream.rules,
    ...spreadRules.rules,
    "jsx-no-new-array-as-prop": {
      ...arrayRule,
      create(context: Parameters<typeof arrayRule.create>[0]) {
        const visitors = arrayRule.create(context)
        let usesStyleX = false
        return {
          ...visitors,
          Program(node: EsTreeNode) {
            usesStyleX =
              node.type === "Program" &&
              node.body.some(
                (statement) =>
                  statement.type === "ImportDeclaration" &&
                  statement.source.value === "@stylexjs/stylex",
              )
            visitors.Program?.(node)
          },
          JSXAttribute(node: EsTreeNode) {
            if (
              usesStyleX &&
              node.type === "JSXAttribute" &&
              node.name.type === "JSXIdentifier" &&
              node.name.name === "xstyle"
            )
              return
            visitors.JSXAttribute?.(node)
          },
        }
      },
    },
  },
}
