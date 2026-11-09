// Parses durations such as "90s", "1h 30m", "250ms" or "2d" into milliseconds.
const UNITS = {
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000,
  ms: 1,
};

export function parseDuration(text) {
  if (typeof text !== "string" || !text.trim()) throw new Error("Give a duration such as 90s or 1h 30m.");
  let total = 0;
  let matched = "";
  for (const part of text.matchAll(/(\d+(?:\.\d+)?)\s*(ms|d|h|m|s)/g)) {
    total += Number(part[1]) * UNITS[part[2]];
    matched += part[0];
  }
  if (matched.replace(/\s/g, "") !== text.replace(/\s/g, "")) throw new Error("“" + text + "” is not a duration.");
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
  return parts.join(" ");
}
