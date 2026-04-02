// Always use relative /api path:
// - In Replit dev: Vite proxy forwards /api/* → localhost:8080/api/*
// - In Vercel production: served by Vercel serverless functions at /api/*
const API_BASE = "/api";

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
