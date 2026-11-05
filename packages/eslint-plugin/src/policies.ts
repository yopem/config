import {
  NEXTJS_RULES,
  REACT_NATIVE_RULES,
  RECOMMENDED_RULES,
  TANSTACK_QUERY_RULES,
  TANSTACK_START_RULES,
} from "oxlint-plugin-react-doctor"

type Severity = "off" | "warn" | "error"

interface RuleOptions {
  allow?: string[]
  allowArrowFunctions?: boolean
  argsIgnorePattern?: string
  varsIgnorePattern?: string
  prefer?: "type-imports"
  fixStyle?: "separate-type-imports"
  checksVoidReturn?: { attributes: boolean }
  restrictUseEffect?: boolean
  paths?: { name: string; importNames: string[]; message: string }[]
}

type RuleSetting =
  | Severity
  | [Severity, RuleOptions]
  | [Severity, "declaration", RuleOptions]

export const baseRules = {
  "oxc/no-accumulating-spread": "error",
  "quality/prefer-arrow-for-anonymous-functions": "error",
  "quality/no-array-filter-existence": "error",
  "quality/no-array-filter-map": "error",
  "quality/no-array-sort-first": "error",
  "quality/no-dynamic-import": "error",
  "quality/no-environment-access": "error",
  "quality/no-reexport-only-modules": "error",
  "quality/no-reduce-accumulator-copy": "error",
  "quality/no-chained-type-assertions": "error",
  "quality/no-catch-variable-type-assertion": "error",
  "quality/no-json-parse-type-assertion": "error",
  "quality/no-conditional-empty-object-spread": "error",
  "quality/no-known-value-widening": "error",
  "quality/no-module-mocking": "error",
  "quality/require-specific-suppression": "error",
  "quality/no-object-parameters": "error",
  "quality/no-reflect-apply": "error",
  "quality/no-reflect-get": "error",
  "quality/no-runtime-typeof": "error",
  "quality/no-shape-in-symbol-names": "error",
  "quality/no-unknown-parameters": "error",
  "quality/no-unknown-returns": "error",
  "quality/no-unknown-type-aliases": "error",
  "quality/no-unsafe-dictionary-type": "error",
  "quality/no-widen-then-assert": "error",
  "quality/require-safety-comment-for-type-assertion": "error",
  "stylistic/require-readable-spacing": "error",
  "func-style": ["error", "declaration", { allowArrowFunctions: true }],
  "import/no-relative-parent-imports": "error",
  "no-array-constructor": "error",
  "no-async-promise-executor": "error",
  "no-case-declarations": "error",
  "no-compare-neg-zero": "error",
  "no-cond-assign": "error",
  "no-console": [
    "error",
    {
      allow: ["error", "warn", "info"],
    },
  ],
  "no-constant-binary-expression": "error",
  "no-constant-condition": "error",
  "no-control-regex": "error",
  "no-debugger": "error",
  "no-delete-var": "error",
  "no-dupe-else-if": "error",
  "no-duplicate-case": "error",
  "no-empty": "error",
  "no-empty-character-class": "error",
  "no-empty-function": "error",
  "no-empty-pattern": "error",
  "no-empty-static-block": "error",
  "no-ex-assign": "error",
  "no-extra-boolean-cast": "error",
  "no-fallthrough": "error",
  "no-global-assign": "error",
  "no-invalid-regexp": "error",
  "no-irregular-whitespace": "error",
  "no-loss-of-precision": "error",
  "no-misleading-character-class": "error",
  "no-nonoctal-decimal-escape": "error",
  "no-regex-spaces": "error",
  "no-self-assign": "error",
  "no-shadow-restricted-names": "error",
  "no-sparse-arrays": "error",
  "no-unexpected-multiline": "error",
  "no-unsafe-finally": "error",
  "no-unsafe-optional-chaining": "error",
  "no-unused-expressions": "error",
  "no-unused-labels": "error",
  "no-unused-private-class-members": "error",
  "no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    },
  ],
  "no-useless-backreference": "error",
  "no-useless-catch": "error",
  "no-useless-escape": "error",
  "no-var": "error",
  "prefer-const": "error",
  "prefer-rest-params": "error",
  "prefer-spread": "error",
  "require-await": "error",
  "require-yield": "error",
  "use-isnan": "error",
  "valid-typeof": "error",
  "typescript/adjacent-overload-signatures": "error",
  "typescript/array-type": "error",
  "typescript/await-thenable": "error",
  "typescript/ban-ts-comment": "error",
  "typescript/ban-tslint-comment": "error",
  "typescript/consistent-generic-constructors": "error",
  "typescript/consistent-indexed-object-style": "error",
  "typescript/consistent-type-definitions": "error",
  "typescript/consistent-type-imports": [
    "warn",
    {
      prefer: "type-imports",
      fixStyle: "separate-type-imports",
    },
  ],
  "typescript/no-array-delete": "error",
  "typescript/no-base-to-string": "error",
  "typescript/no-confusing-non-null-assertion": "error",
  "typescript/no-duplicate-enum-values": "error",
  "typescript/no-duplicate-type-constituents": "error",
  "typescript/no-empty-object-type": "error",
  "typescript/no-explicit-any": "error",
  "typescript/no-floating-promises": "error",
  "typescript/no-extra-non-null-assertion": "error",
  "typescript/no-for-in-array": "error",
  "typescript/no-implied-eval": "error",
  "typescript/no-inferrable-types": "error",
  "typescript/no-misused-new": "error",
  "typescript/no-misused-spread": "error",
  "typescript/no-misused-promises": [
    "error",
    {
      checksVoidReturn: {
        attributes: false,
      },
    },
  ],
  "typescript/no-namespace": "error",
  "typescript/no-non-null-asserted-optional-chain": "error",
  "typescript/no-redundant-type-constituents": "error",
  "typescript/no-require-imports": "error",
  "typescript/no-this-alias": "error",
  "typescript/no-unnecessary-type-assertion": "error",
  "typescript/no-unnecessary-type-constraint": "error",
  "typescript/no-unsafe-argument": "error",
  "typescript/no-unsafe-assignment": "error",
  "typescript/no-unsafe-call": "error",
  "typescript/no-unsafe-declaration-merging": "error",
  "typescript/no-unsafe-enum-comparison": "error",
  "typescript/no-unsafe-function-type": "error",
  "typescript/no-unsafe-member-access": "error",
  "typescript/no-unsafe-return": "error",
  "typescript/no-unsafe-type-assertion": "error",
  "typescript/no-unsafe-unary-minus": "error",
  "typescript/no-wrapper-object-types": "error",
  "typescript/non-nullable-type-assertion-style": "error",
  "typescript/only-throw-error": "error",
  "typescript/prefer-as-const": "error",
  "typescript/prefer-for-of": "error",
  "typescript/prefer-function-type": "error",
  "typescript/prefer-includes": "error",
  "typescript/prefer-namespace-keyword": "error",
  "typescript/prefer-nullish-coalescing": "error",
  "typescript/prefer-optional-chain": "error",
  "typescript/prefer-promise-reject-errors": "error",
  "typescript/require-await": "error",
  "typescript/restrict-plus-operands": "error",
  "typescript/switch-exhaustiveness-check": "error",
  "typescript/triple-slash-reference": "error",
} satisfies Record<string, RuleSetting>

export const ignorePatterns = [
  "**/node_modules",
  "**/.pnp",
  "**/.pnp.js",
  "**/.env",
  "**/.env.local",
  "**/.env.development.local",
  "**/.env.test.local",
  "**/.env.production.local",
  "**/coverage",
  "**/.turbo",
  "**/.vercel",
  "**/.next/",
  "**/out/",
  "**/build",
  "**/dist",
  "**/npm-debug.log*",
  "**/yarn-debug.log*",
  "**/yarn-error.log*",
  "**/.DS_Store",
  "**/*.pem",
  "**/tsconfig.tsbuildinfo",
  "**/*.tsbuildinfo",
  "**/next-env.d.ts",
  "**/.opencode/",
  "**/openspec/",
  "**/opencode.jsonc",
  "**/AGENTS.md",
  "**/skills",
  "**/.gemini",
  "**/migrations/",
  "**/*.config.*",
]

export const effectRules = {
  "effect/no-manual-effect-error-tag": "error",
  "effect/no-manual-tag-comparison": "error",
  "effect/no-manual-tagged-construction": "error",
  "effect/no-service-constructor-imports": "error",
  "effect/prefer-effect-match": "error",
} satisfies Record<string, RuleSetting>

export const reactDoctorRules = {
  ...RECOMMENDED_RULES,
  "react-doctor/react-in-jsx-scope": "off",
  "react-doctor/jsx-no-jsx-as-prop": "off",
  "react-doctor/jsx-max-depth": "off",
  "react-doctor/only-export-components": "off",
  "react-doctor/context-provider-value-from-unmemoized-local-literal": "off",
} as const

export const reactRules = {
  ...reactDoctorRules,
  ...TANSTACK_QUERY_RULES,
  "react-doctor/prefer-dynamic-import": "off",
  "react-policy/no-restricted-hooks": ["error", { restrictUseEffect: true }],
  "react-policy/require-export-function": "error",
  "react-policy/no-query-result-spread": "error",
  "react-policy/prefer-named-imports": "error",
  "react-policy/require-lucide-icon-suffix": "error",
  "no-restricted-imports": [
    "error",
    {
      paths: [
        {
          name: "react",
          importNames: ["useEffect", "useCallback", "useMemo"],
          message:
            "Use derived values, event handlers, framework APIs, and React Compiler.",
        },
      ],
    },
  ],
} satisfies Record<string, RuleSetting>

export const nextjsRules = { ...reactDoctorRules, ...NEXTJS_RULES }

export const reactNativeRules = { ...reactDoctorRules, ...REACT_NATIVE_RULES }

export const tanstackStartRules = {
  ...reactDoctorRules,
  ...TANSTACK_START_RULES,
}
