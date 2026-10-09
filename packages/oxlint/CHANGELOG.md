# @yopem/oxlint-config

## 0.4.0

### Minor Changes

- [`0c17a79`](https://github.com/yopem/config/commit/0c17a79067d56aba45405fcfb1111f3a73f457bb) Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(oxlint): add arrow function rule and update configs

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

## 0.3.3

### Patch Changes

- [`3c40c48`](https://github.com/yopem/config/commit/3c40c485a094cedf2c54a7ef33c7b6f9f99e346e) Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(oxlint): add restrictUseEffect option to no-restricted-hooks

  - Update `no-restricted-hooks` rule to support `restrictUseEffect` option.
  - Modify schema to include `restrictUseEffect` as a boolean property.
  - Default `restrictUseEffect` to `false` in rule options.
  - Add logic to conditionally restrict `useEffect` based on the option.
  - Update tests to validate `restrictUseEffect` behavior.
  - Document the new option in `README.md` with usage examples.
  - Bump package versions for `oxfmt` and `oxlint` in `bun.lock`.

## 0.3.2

### Patch Changes

- [#228](https://github.com/yopem/config/pull/228) [`5b45c53`](https://github.com/yopem/config/commit/5b45c537e7b5ce508930f7cb0f4ab0c53a011ad4) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `eslint-plugin-oxfmt` to `^0.1.0 || ^0.15.0 || ^0.17.0 || ^0.18.0 || ^0.22.0 || ^0.26.0`.

## 0.3.1

### Patch Changes

- [`955f41e`](https://github.com/yopem/config/commit/955f41ec3cf35e36e0af7225f8526becb287d04c) Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat: disable react-doctor/context-provider-value-from-unmemoized-local-literal

## 0.3.0

### Minor Changes

- [`e8dcea5`](https://github.com/yopem/config/commit/e8dcea58ab578138d760461f6e311fb90d20ee9f) Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(oxlint): add react-policy plugin for restricted hooks

  Introduce `react-policy` plugin to enforce restrictions on `useCallback`, `useMemo`
  and `useEffect` usage. Replace `no-restricted-imports` with
  `react-policy/no-restricted-hooks` rule. Update tests to validate new
  rule behavior with actionable messages.

  feat(react-policy): enforce named React imports

  Add `prefer-named-imports` rule to require named imports from React.
  Updated tests to validate the new rule behavior.

## 0.2.1

### Patch Changes

- [`e307c7f`](https://github.com/yopem/config/commit/e307c7f29e66ec3161a8ac861a35aba1d0fd4d38) Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(oxlint): add StyleX exceptions to React Doctor rules

  Enable StyleX-specific exceptions for `jsx-props-no-spreading` and
  `jsx-no-new-array-as-prop` rules in React Doctor. Adjust framework
  presets and tests to ensure compatibility with StyleX usage patterns.

  feat(react-preset): add warnings for restricted hooks usage

  Added `no-restricted-imports` rule to warn against `useCallback` and
  `useEffect` imports in React preset. Updated tests to ensure proper
  warnings and allow other imports without issues.

## 0.2.0

### Minor Changes

- [`2c83390`](https://github.com/yopem/config/commit/2c833905015fca20dec28a4b3d178343076d84e9) Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(oxlint): add React Native and TanStack Start presets

  Introduce React Native and TanStack Start presets to Oxlint. Update
  React, Next.js, and framework-specific presets to use shared React
  Doctor rules. Remove standalone React Doctor preset.

## 0.1.6

### Patch Changes

- [`5d9ddd7`](https://github.com/yopem/config/commit/5d9ddd7d4a7bad3907a50377702fb7d6a17c863e)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(oxlint): add
  React Doctor preset and plugin support

  Introduced the React Doctor preset to @yopem/oxlint-config, enabling
  react-doctor/\* lint rules. Updated dependencies and added tests to ensure
  opt-in functionality alongside existing presets.

## 0.1.5

### Patch Changes

- [`4564b83`](https://github.com/yopem/config/commit/4564b83357061a138f581dc54cdce447a61f2c4d)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - chore: remove
  Tailwind CSS support from oxlint-config

## 0.1.4

### Patch Changes

- [`0ae7965`](https://github.com/yopem/config/commit/0ae7965cd15244f924b7e57b2bce48eb1de8f7db)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(oxlint): add
  React, Next.js, and Tailwind presets

  Introduce optional presets for React, Next.js, and Tailwind CSS. Update README
  with usage instructions. Adjust build script and package exports. Simplify
  Effect and Tailwind preset definitions.

## 0.1.3

### Patch Changes

- [`a91c08b`](https://github.com/yopem/config/commit/a91c08ba5d73942987f0dce4ac6fa53fbb1e0546)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - fix: repo paths

## 0.1.2

### Patch Changes

- [`3e0cca2`](https://github.com/yopem/config/commit/3e0cca2cd251e66edc54c901cf8156d9e33441d5)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - refactor(oxlint):
  migrate to TypeScript-based config

  Replaced JSON-based Oxlint configuration with TypeScript-based config for
  better extensibility. Updated package structure, added presets for Effect and
  Tailwind CSS, and adjusted build scripts. Consolidated licenses and updated
  README accordingly.

## 0.1.1

### Patch Changes

- [`b2a8225`](https://github.com/yopem/config/commit/b2a822563245a663060857f5f41f5dcbbdbadef9)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(oxlint): make
  Tailwind CSS rules optional

## 0.1.0

### Minor Changes

- [`2572deb`](https://github.com/yopem/config/commit/2572debdc23e21b156a4cbcce608b92e2c3df344)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(oxlint): add
  quality, stylistic, and effect rules

## 0.0.9

### Patch Changes

- [#213](https://github.com/yopem/config/pull/213)
  [`4607a8f`](https://github.com/yopem/config/commit/4607a8f0a968c0bbbbc895c8ec6f9beacbeede32)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `eslint-plugin-oxfmt` to `^0.1.0 || ^0.15.0 || ^0.17.0 || ^0.18.0 || ^0.22.0`.

## 0.0.8

### Patch Changes

- [#209](https://github.com/yopem/config/pull/209)
  [`69a70d3`](https://github.com/yopem/config/commit/69a70d34e60d255b8993506eb08699d0e30a5978)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `eslint-plugin-oxfmt` to `^0.1.0 || ^0.15.0 || ^0.17.0 || ^0.18.0`.

## 0.0.7

### Patch Changes

- [#206](https://github.com/yopem/config/pull/206)
  [`ff29a3f`](https://github.com/yopem/config/commit/ff29a3f40d74265252b716a1f9e4262cd5fd56ce)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `eslint-plugin-oxfmt` to `^0.1.0 || ^0.15.0 || ^0.17.0`.

## 0.0.6

### Patch Changes

- [#202](https://github.com/yopem/config/pull/202)
  [`4227741`](https://github.com/yopem/config/commit/4227741c629e309073ba5018ed86a580f2163d57)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `eslint-plugin-oxfmt` to `^0.1.0 || ^0.15.0`.

- [#195](https://github.com/yopem/config/pull/195)
  [`ab589fe`](https://github.com/yopem/config/commit/ab589fe482322349a46e12f3081b24e83d58b519)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `oxlint-tsgolint` to `^7.0.0`.

## 0.0.5

### Patch Changes

- [`5bcc805`](https://github.com/yopem/config/commit/5bcc805e7c24c369357a7c3e7eff3c632353cd06)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - fix: enforce
  correctness category and clean up rules

  Set "correctness" category to "error" in .oxlintrc.json. Removed unused and
  redundant rules for better clarity and maintainability.

## 0.0.4

### Patch Changes

- [#187](https://github.com/yopem/config/pull/187)
  [`a3cd058`](https://github.com/yopem/config/commit/a3cd058dec0f042d9cfb2f7cb10b12a4114a6f5d)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `eslint-plugin-oxfmt` to `^0.15.0`.

- [#190](https://github.com/yopem/config/pull/190)
  [`6d63a3a`](https://github.com/yopem/config/commit/6d63a3a791e2dc32ba49ea1f6ad254ce8194b8b8)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `oxlint-tsgolint` to `^0.25.0`.

## 0.0.3

### Patch Changes

- [`e9779e0`](https://github.com/yopem/config/commit/e9779e03045593e7138b4ee0207a90b7abc7f8a1)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - fix: peer
  dependencies

- [#171](https://github.com/yopem/config/pull/171)
  [`a4bdddb`](https://github.com/yopem/config/commit/a4bdddb9dfb89a73b63a9ed082b462e31511e845)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `oxlint-tsgolint` to `^0.16.0`.

- [#168](https://github.com/yopem/config/pull/168)
  [`de2e7ce`](https://github.com/yopem/config/commit/de2e7ce4f35b52790c688824c567572f4c08bcf4)
  Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency
  `eslint-plugin-oxfmt` to `^0.1.0`.

## 0.0.2

### Patch Changes

- [`af9deb7`](https://github.com/yopem/config/commit/af9deb7397d5fa0d1a9d30ef925e36ca58cff0a8)
  Thanks [@karyanayandi](https://github.com/karyanayandi)! - feat(oxlint): add
  oxlint-tsgolint dependency
