# Notes for Noverk Web Code

- Tests: `npm test` (Node's built-in runner, Node 20+). No dependencies, nothing to install.
- Code is plain ES modules in `src/`, tests in `test/*.test.js` using `node:test` and `node:assert/strict`.
- `parseDuration` must stay single-pass (sticky regex) and keep the `MAX_DURATION_LENGTH` limit: it is meant for
  untrusted input.
- Avoid floating-point scaling of decimals: scale whole and fraction digits separately (see `parseDuration`), and
  format with integer arithmetic (see `formatDuration`).
