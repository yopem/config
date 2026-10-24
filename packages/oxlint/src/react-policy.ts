import { defineRule, eslintCompatPlugin } from "@oxlint/plugins"
import type { ESTree, SourceCode } from "@oxlint/plugins"

import { rule as noQueryResultSpreadRule } from "./rules/no-query-result-spread.ts"
import { resolveArrayBinding } from "./shared/array-method.ts"
import { resolveVariable } from "./shared/scope.ts"

function restrictedHookName(
  expression: ESTree.Expression,
  sourceCode: SourceCode,
): "useCallback" | "useEffect" | "useMemo" | null {
  const seen = new Set<ESTree.Node>()

  function propertyName(node: ESTree.Node, computed: boolean) {
    if (!computed && node.type === "Identifier") return node.name
    if (node.type === "Literal" && typeof node.value === "string")
      return node.value
    if (node.type === "TemplateLiteral" && node.expressions.length === 0)
      return node.quasis[0]?.value.cooked ?? null
    return null
  }

  function origin(node: ESTree.Node): string | null {
    if (seen.has(node)) return null
    seen.add(node)
    if (node.type === "ChainExpression") return origin(node.expression)
    if (node.type === "MemberExpression") {
      const object = origin(node.object)
      const name = propertyName(node.property, node.computed)
      if (object === "react") {
        return name === "useCallback" ||
          name === "useEffect" ||
          name === "useMemo"
          ? name
          : null
      }
      return name === "call" || name === "apply" || name === "bind"
        ? object
        : null
    }
    if (node.type !== "Identifier") return null
    const variable = resolveArrayBinding(sourceCode, node)
    if (
      !variable ||
      variable.defs.length !== 1 ||
      variable.references.some(
        (reference) => reference.isWrite() && !reference.init,
      )
    )
      return null
    const definition = variable.defs[0]
    if (!definition) return null
    const binding = definition.node
    if (
      binding.type === "ImportSpecifier" ||
      binding.type === "ImportDefaultSpecifier" ||
      binding.type === "ImportNamespaceSpecifier"
    ) {
      const declaration = binding.parent
      if (
        declaration.type !== "ImportDeclaration" ||
        declaration.source.value !== "react" ||
        declaration.importKind === "type"
      )
        return null
      if (binding.type !== "ImportSpecifier") return "react"
      if (binding.importKind === "type") return null
      const name = propertyName(binding.imported, false)
      if (name === "default") return "react"
      return name === "useCallback" ||
        name === "useEffect" ||
        name === "useMemo"
        ? name
        : null
    }
    if (
      binding.type !== "VariableDeclarator" ||
      binding.parent.type !== "VariableDeclaration" ||
      binding.parent.kind !== "const" ||
      binding.init === null
    )
      return null
    if (binding.id.type === "Identifier") return origin(binding.init)
    if (binding.id.type !== "ObjectPattern" || origin(binding.init) !== "react")
      return null
    for (const property of binding.id.properties) {
      if (
        property.type === "Property" &&
        property.value.type === "Identifier" &&
        property.value.name === node.name
      ) {
        const name = propertyName(property.key, property.computed)
        return name === "useCallback" ||
          name === "useEffect" ||
          name === "useMemo"
          ? name
          : null
      }
    }
    return null
  }

  const name = origin(expression)
  return name === "useCallback" || name === "useEffect" || name === "useMemo"
    ? name
    : null
}

type ReactFunction = ESTree.Function | ESTree.ArrowFunctionExpression

function isModuleDeclaration(node: ESTree.Node): boolean {
  return (
    node.parent?.type === "Program" ||
    (node.parent?.type === "ExportNamedDeclaration" &&
      node.parent.parent.type === "Program")
  )
}

export default eslintCompatPlugin({
  meta: { name: "react-policy" },
  rules: {
    "no-query-result-spread": noQueryResultSpreadRule,
    "require-export-function": defineRule({
      meta: {
        type: "suggestion",
        schema: [],
        docs: {
          description:
            "Require inline named function exports for module-level React components and hooks.",
        },
        messages: {
          declaration:
            "Declare this React component or hook with export function and a name. Do not use a default export.",
        },
      },
      createOnce(context) {
        const candidates = new Map<ReactFunction, string | null>()
        const jsxFunctions = new Set<ESTree.Node>()
        const defaults: ESTree.IdentifierReference[] = []
        let hasReactEvidence = false

        function recordJSX(node: ESTree.JSXElement | ESTree.JSXFragment) {
          hasReactEvidence = true
          let child: ESTree.Node = node
          let parent: ESTree.Node = node.parent
          while (parent.type !== "Program") {
            if (
              parent.type === "FunctionDeclaration" ||
              parent.type === "FunctionExpression" ||
              parent.type === "ArrowFunctionExpression"
            ) {
              if (child === parent.body) jsxFunctions.add(parent)
              return
            }
            child = parent
            parent = parent.parent
          }
        }

        function isCandidate(node: ReactFunction, name: string | null) {
          return (
            (name !== null && /^use[A-Z0-9]/.test(name) && hasReactEvidence) ||
            ((name === null || /^[A-Z]/.test(name)) && jsxFunctions.has(node))
          )
        }

        return {
          Program() {
            candidates.clear()
            jsxFunctions.clear()
            defaults.length = 0
            hasReactEvidence = false
          },
          ImportDeclaration(node) {
            if (
              node.importKind !== "type" &&
              (node.source.value === "react" ||
                String(node.source.value).startsWith("react/")) &&
              (node.specifiers.length === 0 ||
                node.specifiers.some(
                  (specifier) =>
                    specifier.type !== "ImportSpecifier" ||
                    specifier.importKind !== "type",
                ))
            )
              hasReactEvidence = true
          },
          JSXElement: recordJSX,
          JSXFragment: recordJSX,
          FunctionDeclaration(node) {
            if (isModuleDeclaration(node))
              candidates.set(node, node.id?.name ?? null)
          },
          VariableDeclarator(node) {
            if (
              node.id.type === "Identifier" &&
              node.parent.type === "VariableDeclaration" &&
              isModuleDeclaration(node.parent) &&
              (node.init?.type === "ArrowFunctionExpression" ||
                node.init?.type === "FunctionExpression")
            )
              candidates.set(node.init, node.id.name)
          },
          ExportDefaultDeclaration(node) {
            const declaration = node.declaration
            if (
              declaration.type === "FunctionDeclaration" ||
              declaration.type === "FunctionExpression" ||
              declaration.type === "ArrowFunctionExpression"
            ) {
              candidates.set(
                declaration,
                declaration.type === "ArrowFunctionExpression"
                  ? null
                  : (declaration.id?.name ?? null),
              )
            } else if (declaration.type === "Identifier") {
              defaults.push(declaration)
            }
          },
          "Program:exit"() {
            for (const [node, name] of candidates) {
              if (
                isCandidate(node, name) &&
                !(
                  node.type === "FunctionDeclaration" &&
                  node.id !== null &&
                  node.parent.type === "ExportNamedDeclaration"
                )
              )
                context.report({ node, messageId: "declaration" })
            }
            for (const identifier of defaults) {
              const variable = resolveVariable(context.sourceCode, identifier)
              if (
                variable?.defs.some((definition) => {
                  const node = definition.node
                  const fn =
                    node.type === "VariableDeclarator" ? node.init : node
                  return (
                    fn !== null &&
                    (fn.type === "FunctionDeclaration" ||
                      fn.type === "FunctionExpression" ||
                      fn.type === "ArrowFunctionExpression") &&
                    candidates.has(fn) &&
                    isCandidate(fn, candidates.get(fn) ?? null)
                  )
                })
              )
                context.report({ node: identifier, messageId: "declaration" })
            }
          },
        }
      },
    }),
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
        schema: [
          {
            type: "object",
            properties: {
              restrictUseEffect: { type: "boolean" },
            },
            additionalProperties: false,
          },
        ],
        defaultOptions: [{ restrictUseEffect: false }],
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
            const option = context.options?.[0]
            const restrictUseEffect =
              typeof option === "object" &&
              option !== null &&
              !Array.isArray(option) &&
              option.restrictUseEffect === true
            if (hook && (hook !== "useEffect" || restrictUseEffect)) {
              context.report({ node, messageId: hook })
            }
          },
        }
      },
    }),
  },
})
