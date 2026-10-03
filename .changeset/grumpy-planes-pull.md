---
"@yopem/oxlint-config": patch
---

feat(oxlint): add StyleX exceptions to React Doctor rules

Enable StyleX-specific exceptions for `jsx-props-no-spreading` and
`jsx-no-new-array-as-prop` rules in React Doctor. Adjust framework
presets and tests to ensure compatibility with StyleX usage patterns.

feat(react-preset): add warnings for restricted hooks usage

Added `no-restricted-imports` rule to warn against `useCallback` and  
`useEffect` imports in React preset. Updated tests to ensure proper  
warnings and allow other imports without issues.
