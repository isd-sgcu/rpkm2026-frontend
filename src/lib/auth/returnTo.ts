const STORAGE_KEY = "rpkm:return-to";

/** Destinations that make no sense to return to after login. */
const BLOCKED_PATHS = ["/landing", "/not-eligible", "/register"];

/**
 * Reduces an arbitrary (possibly attacker-controlled) stored value to a safe
 * same-origin path of the form "/path?query#hash", or null.
 *
 * The URL round-trip is the real defense: values like "//evil.com" or
 * "/\evil.com" parse to a foreign origin and get rejected, so a crafted
 * localStorage entry can never turn the post-login redirect into an open
 * redirect.
 */
export function sanitizeReturnTo(value: string | null): string | null {
  if (!value || !value.startsWith("/")) return null;

  let url: URL;
  try {
    url = new URL(value, window.location.origin);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;

  const path =
    url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;
  if (BLOCKED_PATHS.includes(path)) return null;

  return `${url.pathname}${url.search}${url.hash}`;
}

/** Remembers where an unauthenticated user was headed before /landing. */
export function saveReturnTo(path: string): void {
  const safe = sanitizeReturnTo(path);
  if (!safe) return;
  try {
    localStorage.setItem(STORAGE_KEY, safe);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies) — the user
    // simply lands on "/" after login instead.
  }
}

/**
 * Takes the stored destination out of localStorage (always clearing it, so a
 * stale value can't hijack a much later login) and returns it sanitized.
 */
export function popReturnTo(): string | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    return sanitizeReturnTo(value);
  } catch {
    return null;
  }
}
