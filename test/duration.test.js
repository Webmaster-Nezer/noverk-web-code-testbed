import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDuration, parseDuration } from "../src/duration.js";

test("parses single units", () => {
  assert.equal(parseDuration("90s"), 90_000);
  assert.equal(parseDuration("2h"), 7_200_000);
  assert.equal(parseDuration("1d"), 86_400_000);
});

test("parses combined units", () => {
  assert.equal(parseDuration("1h 30m"), 5_400_000);
});

test("parses milliseconds", () => {
  assert.equal(parseDuration("250ms"), 250);
  assert.equal(parseDuration("1s 500ms"), 1_500);
});

test("rejects text that is not a duration", () => {
  assert.throws(() => parseDuration("soon"));
  assert.throws(() => parseDuration(""));
});

test("formats durations", () => {
  assert.equal(formatDuration(250), "250ms");
  assert.equal(formatDuration(5_400_000), "1h 30m");
});
