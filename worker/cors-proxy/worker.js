/**
 * LNUP CORS Proxy — Cloudflare Worker
 *
 * Ermoeglicht das Laden externer Webseiten aus dem Browser heraus,
 * ohne CORS-Einschraenkungen.
 *
 * Deploy: Cloudflare Dashboard -> Workers & Pages -> Create -> Paste -> Deploy
 * Oder: npx wrangler deploy (mit wrangler.toml)
 *
 * Nutzung: GET https://<worker>.workers.dev/?url=https://www.deggendorf-pulsiert.de/
 */

const ALLOWED_ORIGINS = [
  "https://lnup-demo.vercel.app",
  "https://lnup.vercel.app",
  "http://localhost:8081",
  "http://localhost:19006",
];

function getCorsOrigin(request) {
  const origin = request.headers.get("Origin") || "";
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  if (origin.endsWith(".vercel.app")) return origin;
  if (origin.startsWith("http://localhost:")) return origin;
  return ALLOWED_ORIGINS[0];
}

export default {
  async fetch(request) {
    const corsOrigin = getCorsOrigin(request);
    const corsHeaders = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "GET") {
      return new Response("Only GET allowed", { status: 405, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: "Missing ?url= parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {
      new URL(targetUrl);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "LNUP-Bot/1.0 (Event Discovery)",
          "Accept": "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
        },
        cf: { cacheTtl: 300 },
      });

      const body = await response.text();

      return new Response(body, {
        status: response.status,
        headers: {
          ...corsHeaders,
          "Content-Type": response.headers.get("Content-Type") || "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300",
          "X-Proxied-URL": targetUrl,
        },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Fetch failed", message: err.message }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  },
};
