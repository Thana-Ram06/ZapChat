// In development: use Vite's built-in proxy (/api → localhost:8080)
// In production builds: use VITE_API_BASE env var (set in Vercel dashboard)
const API_BASE = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_BASE ||
     "https://d26531a1-0aeb-420e-8d12-c4b526d95f2b-00-2tfaemcvyxr99.picard.replit.dev/api-server/api");

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
