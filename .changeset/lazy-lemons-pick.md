---
"@yopem/oxlint-config": minor
---

feat(quality): add rules for type assertions at boundaries

Add two new lint rules to improve type safety:

- `quality/no-json-parse-type-assertion`: Prevent direct type assertions
  on `JSON.parse(...)` results. Require validation of parsed data.
- `quality/no-catch-variable-type-assertion`: Disallow type assertions
  on catch bindings. Use type guards or validators instead.

Update the configuration to enable these rules as errors. Include
detailed documentation and examples in the README. Implement shared
utilities for assertion source handling and scope resolution.
