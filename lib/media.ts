// src/lib/media.ts
export const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000").trim().replace(/\/+$/, "");

/** Ensure we generate a valid absolute URL for media from a variety of inputs. */
function normalizePath(p?: string | null): string {
  if (!p) return "";
  let s = String(p).trim();
  if (!s) return "";

  // Already absolute
  if (/^https?:\/\//i.test(s)) return s;

  // Replace any Windows backslashes with URL slashes
  s = s.replace(/\\/g, "/");

  // If it starts with "uploads" (no leading slash), add the slash
  if (/^(uploads)(\/|$)/i.test(s)) s = `/${s}`;

  // If it starts with a single slash, we can join to API_BASE
  if (s.startsWith("/")) return `${API_BASE}${s}`;

  // Fallback: join with a slash between
  return `${API_BASE}/${s}`;
}

/** Prefix relative media paths with the API base URL, handling odd inputs. */
export function mediaUrl(path?: string | null): string {
  return normalizePath(path);
}
