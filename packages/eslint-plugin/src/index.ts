import type { Rule } from "@oxlint/plugins"

import effect from "./effect/index.js"
import {
  baseRules,
  effectRules,
  nextjsRules,
  reactNativeRules,
  reactRules,
  tanstackStartRules,
} from "./policies.js"
import quality from "./quality.js"
import reactDoctor from "./react-doctor.js"
import reactPolicy from "./react-policy.js"
import stylistic from "./stylistic.js"

const customBaseRules = Object.fromEntries(
  Object.entries(baseRules).filter(
    ([name]) => name.startsWith("quality/") || name.startsWith("stylistic/"),
  ),
)

type SharedRule = Rule | (typeof reactDoctor.rules)[string]

const rules: Record<string, SharedRule> = Object.fromEntries(
  Object.entries({
    quality,
    stylistic,
    effect,
    "react-policy": reactPolicy,
    "react-doctor": reactDoctor,
  }).flatMap(([namespace, plugin]) =>
    Object.entries(plugin.rules).map(([name, rule]) => [
      `${namespace}/${name}`,
      rule,
    ]),
  ),
)

export default {
  meta: { name: "@yopem/eslint-plugin" },
  rules,
  configs: {
    recommended: [{ plugins: { quality, stylistic }, rules: customBaseRules }],
    effect: [{ plugins: { effect }, rules: effectRules }],
    react: [
      {
        plugins: { "react-doctor": reactDoctor, "react-policy": reactPolicy },
        rules: reactRules,
      },
    ],
    nextjs: [{ plugins: { "react-doctor": reactDoctor }, rules: nextjsRules }],
    "react-native": [
      { plugins: { "react-doctor": reactDoctor }, rules: reactNativeRules },
    ],
    "tanstack-start": [
      { plugins: { "react-doctor": reactDoctor }, rules: tanstackStartRules },
    ],
  },
}
