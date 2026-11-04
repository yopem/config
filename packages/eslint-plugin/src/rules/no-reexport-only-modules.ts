import { defineRule } from "@oxlint/plugins"

export const noReexportOnlyModulesRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow modules that only forward exports.",
    },
    messages: {
      reexportOnly:
        "Import from the source module instead of this re-export-only module.",
    },
  },
  createOnce(context) {
    return {
      Program(node) {
        let hasReexport = false
        const importedNames = new Set<string>()
        for (const statement of node.body) {
          if (statement.type !== "ImportDeclaration") continue
          for (const specifier of statement.specifiers) {
            importedNames.add(specifier.local.name)
          }
        }
        for (const statement of node.body) {
          if (statement.type === "EmptyStatement") continue
          if (statement.type === "ImportDeclaration") {
            if (
              statement.specifiers.length === 0 &&
              statement.importKind !== "type"
            )
              return
            continue
          }
          if (
            statement.type === "ExportAllDeclaration" ||
            (statement.type === "ExportNamedDeclaration" &&
              statement.source !== null)
          ) {
            hasReexport = true
            continue
          }
          if (
            statement.type === "ExportNamedDeclaration" &&
            statement.declaration === null &&
            statement.specifiers.every(
              (specifier) =>
                specifier.local.type === "Identifier" &&
                importedNames.has(specifier.local.name),
            )
          ) {
            if (statement.specifiers.length > 0) hasReexport = true
            continue
          }
          return
        }
        if (hasReexport) {
          context.report({ node, messageId: "reexportOnly" })
        }
      },
    }
  },
})
