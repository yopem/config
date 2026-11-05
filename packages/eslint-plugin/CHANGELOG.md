# @yopem/eslint-plugin

## 0.0.2

### Patch Changes

- [`43b895c`](https://github.com/yopem/config/commit/43b895c888ff881d3a339b8087ab5b429b31cfbb) Thanks [@karyanayandi](https://github.com/karyanayandi)! - fix: improve code readability and consistency
  - Added `isNodeType` utility for type checking in `react-doctor.ts`.
  - Replaced string literal checks with `isStringLiteral` in multiple
    files.
  - Simplified null and undefined checks using optional chaining.
  - Reorganized imports for consistency and clarity.
  - Refactored complex conditional statements for better readability.
  - Improved loop and function structures for maintainability.
  - Updated file paths in imports to use aliases for shared modules.

## 0.0.1

### Patch Changes

- [`2895f83`](https://github.com/yopem/config/commit/2895f830a6f6a651747914201d590a6ab872614f)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(lint): share
  custom lint rules

  Add `@yopem/eslint-plugin` for ESLint, Oxlint, and Bun lint. Keep the
  current rules and tests when resolving conflicts.
