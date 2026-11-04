import type { ESTree } from "@oxlint/plugins"

type VisitorKeys = Readonly<Record<string, readonly string[]>>

function isNode(value: unknown): value is ESTree.Node {
  return (
    // oxlint-disable-next-line quality/no-runtime-typeof -- AST fields can contain non-node values.
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    // oxlint-disable-next-line quality/no-runtime-typeof -- AST values need a string type field.
    typeof value.type === "string"
  )
}

export function mappedTypeParameter(node: ESTree.TSMappedType) {
  const parameter: unknown = Object.getOwnPropertyDescriptor(
    node,
    "typeParameter",
  )?.value

  return isNode(parameter) && parameter.type === "TSTypeParameter"
    ? parameter
    : null
}

function collectInferTypeParameterNames(
  node: ESTree.Node,
  visitorKeys: VisitorKeys,
  names: Set<string>,
): void {
  if (node.type === "TSInferType") names.add(node.typeParameter.name.name)

  for (const key of visitorKeys[node.type] ?? []) {
    const value: unknown = Object.getOwnPropertyDescriptor(node, key)?.value

    if (isNode(value)) {
      collectInferTypeParameterNames(value, visitorKeys, names)
      continue
    }

    if (!Array.isArray(value)) continue

    for (const child of value) {
      if (isNode(child))
        collectInferTypeParameterNames(child, visitorKeys, names)
    }
  }
}

/** Collect type binders that are in scope at a node and can shadow module aliases. */
export function lexicalTypeParameterNames(
  node: ESTree.Node,
  visitorKeys: VisitorKeys,
): ReadonlySet<string> {
  const names = new Set<string>()
  let descendant: ESTree.Node = node
  let current: ESTree.Node | null = node

  while (current !== null && current.type !== "Program") {
    if ("typeParameters" in current) {
      for (const parameter of current.typeParameters?.params ?? []) {
        names.add(parameter.name.name)
      }
    }

    if (
      current.type === "TSMappedType" &&
      (descendant === current.nameType || descendant === current.typeAnnotation)
    ) {
      const parameter = mappedTypeParameter(current)

      if (parameter !== null) {
        names.add(parameter.name.name)
      } else {
        names.add(current.key.name)
      }
    }

    if (
      current.type === "TSConditionalType" &&
      descendant === current.trueType
    ) {
      collectInferTypeParameterNames(current.extendsType, visitorKeys, names)
    }

    descendant = current
    current = current.parent
  }

  return names
}
