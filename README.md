# noverk-web-code-testbed

A small duration library that Noverk Web Code practises on. `npm test` runs the tests with Node's built-in test
runner, so there is nothing to install.

`parseDuration` rejects text longer than `MAX_DURATION_LENGTH` (100 characters) and reads the rest in a single
left-to-right pass, so it is safe to call on untrusted input.

All tests pass. (The parser used to reject "250ms" because it tried the `m` unit before `ms`; fixing that was the first end-to-end check.)

Decimal amounts are exact: `parseDuration("1.001s")` is `1001`, not the floating-point `1000.9999999999999`, and
`formatDuration(1000.1)` is `"1s 0.1ms"`.
