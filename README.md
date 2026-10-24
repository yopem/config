# Config

Yopem configurations for TypeScript projects.

Includes configurations for:

- [TypeScript](https://www.typescriptlang.org/)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## Automatic changesets

Run `bun install` to install Git hooks. After each local `git commit`, the
Lefthook `post-commit` hook creates a changeset for public packages changed in
that commit. The full commit message supplies the release note. The hook saves
this file in a separate `ci(changesets): add commit release notes` commit. It
does not change your original commit or include unrelated staged files.

- `feat: ...` creates a minor release.
- `fix: ...` creates a patch release.
- `!`, `BREAKING CHANGE:`, and `BREAKING-CHANGE:` create a minor release, never
  a major release.
- Other commit types do not create a changeset.

Scopes are optional. Package paths, not scopes, select packages. Private
packages and root-only changes do not create releases. If your commit adds or
updates a manual changeset, the hook does not add an automatic changeset. Manual
changesets keep their selected release types.

Hooks must be enabled. Commits made on GitHub or with `LEFTHOOK=0` do not create
changesets. Review generated changesets before you push. If the hook fails, your
original commit still exists. Check the error and save the changeset before you
push.

Run `bun test ./scripts/changeset.test.mjs` to test this workflow in temporary
Git repositories.
