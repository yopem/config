import { defineRule } from "@oxlint/plugins"
import type { ESTree, SourceCode } from "@oxlint/plugins"

const disableDirective =
  /^(?:eslint|oxlint)-disable(?:-next-line|-line)?(?=\s|$)/u
const lineDirective = /^(?:eslint|oxlint)-disable-(?:next-line|line)\s+(.+)$/su
const ruleName = /^(?:@[\w-]+\/)?[\w-]+(?:\/[\w-]+)*$/u

function hasExplanation(text: string): boolean {
  return /[\p{L}\p{N}]/u.test(text)
}

function hasNearbyExplanation(
  sourceCode: SourceCode,
  comment: ESTree.Comment,
  neighbor: ESTree.Comment | undefined,
): boolean {
  if (neighbor === undefined || neighbor.type === "Shebang") return false
  const text = neighbor.value.trim()
  if (/^(?:eslint|oxlint|@ts-)/u.test(text) || !hasExplanation(text)) {
    return false
  }
  const before = neighbor.end <= comment.start
  const start = before ? neighbor.end : comment.end
  const end = before ? comment.start : neighbor.start
  return (
    /^\s*$/u.test(sourceCode.text.slice(start, end)) &&
    sourceCode.getLocFromIndex(end).line -
      sourceCode.getLocFromIndex(start).line <=
      1
  )
}

export const requireSpecificSuppressionRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Require named, line-scoped lint suppressions with a nearby reason.",
    },
    schema: [],
    messages: {
      specificSuppression:
        "Use disable-next-line or disable-line with exact rule names and a nearby reason. Do not disable rules for a file or region.",
    },
  },
  createOnce(context) {
    return {
      Program() {
        const sourceCode = context.sourceCode
        const comments = sourceCode.getAllComments()
        for (const [index, comment] of comments.entries()) {
          if (comment.type === "Shebang") continue
          const text = comment.value.trim()
          if (!disableDirective.test(text)) continue
          const separator = text.indexOf("--")
          const directive = separator < 0 ? text : text.slice(0, separator)
          const match = lineDirective.exec(directive.trim())
          const rules = match?.[1]?.split(",").map((name) => name.trim())
          const namedLineSuppression =
            rules !== undefined &&
            rules.length > 0 &&
            rules.every((group) =>
              group
                .split(/\s+/u)
                .every((name) => ruleName.test(name) && name !== "all"),
            )
          const explained =
            (separator >= 0 && hasExplanation(text.slice(separator + 2))) ||
            hasNearbyExplanation(sourceCode, comment, comments[index - 1]) ||
            hasNearbyExplanation(sourceCode, comment, comments[index + 1])
          if (namedLineSuppression && explained) continue
          // Oxlint can suppress this diagnostic too. This rule is not a tamper-proof gate.
          context.report({
            loc: {
              start: sourceCode.getLocFromIndex(comment.start),
              end: sourceCode.getLocFromIndex(comment.end),
            },
            messageId: "specificSuppression",
          })
        }
      },
    }
  },
})
