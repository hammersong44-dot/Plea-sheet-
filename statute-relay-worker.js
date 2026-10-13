const LEGIS_HOST = "legis.la.gov";

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "*";
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405, headers: cors(origin) });
    }

    const incoming = new URL(request.url);
    const raw = incoming.searchParams.get("u");
    if (!raw) {
      return new Response("Missing u parameter", { status: 400, headers: cors(origin) });
    }

    let target;
    try {
      target = new URL(raw);
    } catch {
      return new Response("Invalid URL", { status: 400, headers: cors(origin) });
    }

    if (target.protocol !== "https:" || target.hostname !== LEGIS_HOST || target.pathname !== "/legis/Law.aspx" || !/^\d+$/.test(target.searchParams.get("d") || "")) {
      return new Response("Only Louisiana Legislature statute pages are allowed", { status: 403, headers: cors(origin) });
    }

    const upstream = await fetch(target.toString(), {
      headers: { "User-Agent": "Seventh-JDC-Plea-Form/1.0", "Accept": "text/html" },
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (!upstream.ok) {
      return new Response("Legislature request failed", { status: 502, headers: cors(origin) });
    }

    const headers = new Headers(cors(origin));
    headers.set("Content-Type", "text/html; charset=utf-8");
    headers.set("Cache-Control", "public, max-age=3600");
    return new Response(await upstream.text(), { status: 200, headers });
  },
};
