import { test } from "node:test";
import assert from "node:assert/strict";
import { MAX_DURATION_LENGTH, formatDuration, parseDuration } from "../src/duration.js";

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

test("accepts spacing between and inside parts", () => {
  assert.equal(parseDuration("1h30m"), 5_400_000);
  assert.equal(parseDuration(" 1 h  30 m "), 5_400_000);
  assert.equal(parseDuration("1s1s"), 2_000);
  assert.equal(parseDuration("0.5s"), 500);
});

test("rejects text around or between valid parts", () => {
  for (const text of ["1", "s", "1x1s", "1s x", "x 1s", "1 0s", "1.5.5s", "-1s", "1e3s", "1S"]) {
    assert.throws(() => parseDuration(text), undefined, text);
  }
});

test("rejects text longer than the limit, without echoing it", () => {
  assert.equal(parseDuration("1s".repeat(MAX_DURATION_LENGTH / 2)), MAX_DURATION_LENGTH / 2 * 1_000);
  const long = "1s".repeat(MAX_DURATION_LENGTH);
  assert.throws(() => parseDuration(long), (error) => !error.message.includes(long));
});

test("rejects very long input quickly", () => {
  // Without the limit, the old pattern took about 6 seconds on 50 000 digits followed by a non-unit.
  const started = performance.now();
  assert.throws(() => parseDuration("1".repeat(1_000_000) + "x"));
  assert.ok(performance.now() - started < 500, "parsing took too long");
});

test("formats durations", () => {
  assert.equal(formatDuration(250), "250ms");
  assert.equal(formatDuration(5_400_000), "1h 30m");
});

test("keeps leftover milliseconds when formatting", () => {
  assert.equal(formatDuration(1_500), "1s 500ms");
  assert.equal(formatDuration(61_001), "1m 1s 1ms");
  assert.equal(parseDuration(formatDuration(1_500)), 1_500);
});
