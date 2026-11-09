# noverk-web-code-testbed

A small duration library that Noverk Web Code practises on. `npm test` runs the tests with Node's built-in test
runner, so there is nothing to install.

One test fails on purpose: "250ms" is rejected, because the parser tries the `m` unit before `ms`. Asking Web Code to fix it is the first end-to-end check.
