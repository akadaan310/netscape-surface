/**
 * Netscape v0.1 — Infinite Surface
 * Security boundaries: URL sanitization and secret-pattern scanning.
 * INV-08: the web security model is never weakened for a demo.
 * INV-09: no secrets in the repo or client state, ever.
 */

const BLOCKED_SCHEMES = ['javascript:', 'data:', 'file:', 'vbscript:'];

/**
 * Accept only http/https URLs. Trims whitespace; returns null for anything
 * else (including javascript:, data:, file:, vbscript: schemes and empty input).
 * Never throws — callers treat null as "do not navigate".
 */
export function sanitizeUrl(raw: string): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const lower = trimmed.toLowerCase();
  for (const scheme of BLOCKED_SCHEMES) {
    if (lower.startsWith(scheme)) return null;
  }
  if (!/^https?:\/\//i.test(trimmed)) return null;
  return trimmed;
}

const SECRET_PATTERN =
  /(api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"']{8,}["']/gi;

/**
 * Scan text for key= / password: style secret assignments.
 * Returns the list of matches. Matches containing 'DEMO_KEY' (or any
 * allowlist entry) are excluded — demo placeholder keys are not secrets.
 */
export function assertNoSecretsInText(text: string, allowlist: string[] = []): string[] {
  if (typeof text !== 'string' || text === '') return [];
  const matches = text.match(SECRET_PATTERN) ?? [];
  const allow: string[] = ['DEMO_KEY', ...allowlist];
  return matches.filter((m) => !allow.some((entry) => m.includes(entry)));
}
