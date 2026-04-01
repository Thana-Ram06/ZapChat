// VITE_API_BASE is set at build time via environment variable.
// Falls back to the Replit API server URL so it works in both dev and production.
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://d26531a1-0aeb-420e-8d12-c4b526d95f2b-00-2tfaemcvyxr99.picard.replit.dev/api-server/api";

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
