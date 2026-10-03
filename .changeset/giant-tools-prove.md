---
"@yopem/oxlint-config": minor
---

feat(oxlint): add react-policy plugin for restricted hooks

Introduce `react-policy` plugin to enforce restrictions on `useCallback`, `useMemo`
and `useEffect` usage. Replace `no-restricted-imports` with
`react-policy/no-restricted-hooks` rule. Update tests to validate new
rule behavior with actionable messages.
