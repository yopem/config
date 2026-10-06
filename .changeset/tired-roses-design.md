---
"@yopem/oxlint-config": patch

feat(oxlint): add restrictUseEffect option to no-restricted-hooks

- Update `no-restricted-hooks` rule to support `restrictUseEffect` option.
- Modify schema to include `restrictUseEffect` as a boolean property.
- Default `restrictUseEffect` to `false` in rule options.
- Add logic to conditionally restrict `useEffect` based on the option.
- Update tests to validate `restrictUseEffect` behavior.
- Document the new option in `README.md` with usage examples.
- Bump package versions for `oxfmt` and `oxlint` in `bun.lock`.
