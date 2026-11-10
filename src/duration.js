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
  const part = /\s*(\d+(?:\.\d+)?)\s*(ms|d|h|m|s)\s*/y;
  let total = 0;
  let match;
  while (part.lastIndex < text.length && (match = part.exec(text))) total += Number(match[1]) * UNITS[match[2]];
  if (!match || part.lastIndex !== text.length) throw new Error("“" + text + "” is not a duration.");
  return total;
}

export function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms < 0) throw new Error("Give a number of milliseconds, zero or more.");
  if (ms < 1000) return ms + "ms";
  const parts = [];
  for (const unit of ["d", "h", "m", "s"]) {
    const count = Math.floor(ms / UNITS[unit]);
    if (count) { parts.push(count + unit); ms -= count * UNITS[unit]; }
  }
  if (ms) parts.push(ms + "ms");
  return parts.join(" ");
}
