---
"@yopem/eslint-config": minor
---

feat(eslint): add support for .prettierignore in config

Extend ESLint base config to also respect .prettierignore files, in
addition to .gitignore. This ensures files ignored by Prettier are also
excluded from linting.
