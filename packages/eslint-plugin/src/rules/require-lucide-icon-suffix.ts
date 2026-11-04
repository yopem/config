import { defineRule } from "@oxlint/plugins"

export const rule = defineRule({
  meta: {
    type: "suggestion",
    schema: [],
    docs: {
      description:
        "Require the Icon suffix in local names of named Lucide component imports.",
    },
    messages: {
      suffix:
        "Use a local name ending in Icon for this lucide-react component import.",
    },
  },
  createOnce(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== "lucide-react" || node.importKind === "type")
          return
        for (const specifier of node.specifiers) {
          if (
            specifier.type !== "ImportSpecifier" ||
            specifier.importKind === "type"
          )
            continue
          const importedName =
            specifier.imported.type === "Identifier"
              ? specifier.imported.name
              : specifier.imported.value
          if (
            /^[A-Z]/.test(importedName) &&
            importedName !== "IconNode" &&
            importedName !== "LucideProps" &&
            importedName !== "LucideIcon" &&
            !specifier.local.name.endsWith("Icon")
          )
            context.report({ node: specifier.local, messageId: "suffix" })
        }
      },
    }
  },
})
