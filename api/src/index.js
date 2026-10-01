// school-agent-api: professor accounts (and later lessons) on D1.
import { handleAuth } from "./auth.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
    if (url.pathname === "/" || url.pathname === "/health") return new Response("OK", { headers: CORS_HEADERS });
    return handleAuth(request, env, url, CORS_HEADERS);
  },
};
