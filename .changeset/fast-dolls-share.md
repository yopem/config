---
"@yopem/eslint-config": patch
---

revert(eslint): remove eslint-config-next

Replace eslint-config-next with direct configuration using
@next/eslint-plugin-next. This removes unnecessary dependencies while
maintaining the same linting rules for Next.js projects.

The change also updates peer dependency version ranges to be more flexible using
the ^ prefix.
