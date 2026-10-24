---
"@yopem/oxlint-config": minor
---

feat(oxlint): add stricter lint rules and tests for React and TypeScript

- Updated `react-policy/no-restricted-hooks` to reject `useCallback`, `useMemo`, and `useEffect` calls, including named imports.
- Added `react-policy/require-export-function` to enforce inline named `export function` declarations for React components and hooks.
- Introduced `react-policy/no-query-result-spread` to disallow spreading TanStack Query and mutation results.
- Enabled `react/unsupported-syntax` for React Compiler restrictions.
- Added `quality/no-dynamic-import` to reject dynamic imports.
- Added `quality/no-environment-access` to enforce environment adapter usage.
- Added `quality/no-reexport-only-modules` to disallow re-export-only modules.
- Updated `func-style` to prefer declarations over named function expressions.
- Enabled `typescript/ban-ts-comment` and `typescript/no-unsafe-type-assertion`.
- Added overrides to disable `quality/no-environment-access` in `**/env.ts`.
- Updated `README.md` with new rules and their usage.
- Added `typecheck` script to `package.json`.
- Created new rules in `src/rules` and integrated them into `src/quality.ts` and `src/react-policy.ts`.
- Added comprehensive tests for new rules in `test` directory.
- Added `tsconfig.json` for stricter TypeScript checks
