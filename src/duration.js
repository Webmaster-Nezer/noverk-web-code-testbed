// Parses durations such as "90s", "1h 30m", "250ms" or "2d" into milliseconds.
const UNITS = {
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000,
  ms: 1,
};

// Longer input is rejected up front, so callers can pass untrusted text and errors stay short.
export const MAX_DURATION_LENGTH = 100;

export function parseDuration(text) {
  if (typeof text !== "string" || !text.trim()) throw new Error("Give a duration such as 90s or 1h 30m.");
  if (text.length > MAX_DURATION_LENGTH) throw new Error("A duration can be at most " + MAX_DURATION_LENGTH + " characters long.");
  // Sticky (y) pattern: each part must start exactly where the previous one ended, so the text is read once from
  // left to right. A global scan would retry from every position and take quadratic time on input like "1111…x".
  const part = /\s*(\d+)(?:\.(\d+))?\s*(ms|d|h|m|s)\s*/y;
  let total = 0;
  let match;
  while (part.lastIndex < text.length && (match = part.exec(text))) {
    const [, whole, fraction, unit] = match;
    // Scale the whole and fraction digits separately: 1.001 * 1000 is 1000.9999999999999 in floating point, but
    // 1 * 1000 + 1 * 1000 / 1000 is exactly 1001.
    total += Number(whole) * UNITS[unit] + (fraction ? Number(fraction) * UNITS[unit] / 10 ** fraction.length : 0);
  }
  if (!match || part.lastIndex !== text.length) throw new Error("“" + text + "” is not a duration.");
  return total;
}

export function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms < 0) throw new Error("Give a number of milliseconds, zero or more.");
  if (ms < 1000) return ms + "ms";
  // Split whole milliseconds into units with integer arithmetic, and keep the fraction digits as the number prints
  // them: 1000.1 - 1000 is 0.10000000000002274 in floating point, but "1000.1" ends in ".1".
  let rest = Math.floor(ms);
  // Numbers with a fraction are below 2^53, so they never print in exponent form such as "1.5e+21".
  const fraction = Number.isInteger(ms) ? undefined : String(ms).split(".")[1];
  const parts = [];
  for (const unit of ["d", "h", "m", "s"]) {
    const count = Math.floor(rest / UNITS[unit]);
    if (count) { parts.push(count + unit); rest -= count * UNITS[unit]; }
  }
  if (rest || fraction) parts.push(rest + (fraction ? "." + fraction : "") + "ms");
  return parts.join(" ");
}
