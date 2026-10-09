---
"@yopem/oxlint-config": minor
---

feat(oxlint): add arrow function rule and update configs

- Bump @yopem/oxlint-config version to 0.3.3 in bun.lock.
- Add `options.typeAware` and `options.typeCheck` to base config.
- Introduce `quality/prefer-arrow-for-anonymous-functions` rule:
  - Enforce arrow functions for anonymous function expressions.
  - Allow named functions, methods, accessors, and generators.
  - No auto-fix due to `this` and `arguments` behavior.
k- Update README.md:
  - Document new rule and its usage.
  - Add `options: baseConfig.options` in all examples.
  - Clarify disabled rules in framework presets.
- Modify `src/index.ts` and `src/quality.ts` to include the new rule.
- Add `prefer-arrow-for-anonymous-functions.ts` rule implementation.
