// Serves lesson content from lectures-data.js on GitHub, so the app gets new
// lessons without a new APK. Only the JSON inside concat(...) is used; no code runs.
export const LECTURES_SRC =
  "https://raw.githubusercontent.com/tgGeorge170/School-Agent/claude/notifications-problem-analysis-3nc0cb/lectures-data.js";

export function extractLectures(text) {
  const start = text.indexOf(".concat(");
  const end = text.lastIndexOf(");");
  if (start < 0 || end < start) return null;
  let data;
  try {
    data = JSON.parse(text.slice(start + ".concat(".length, end));
  } catch {
    return null;
  }
  const ok = Array.isArray(data) && data.every((s) => s && typeof s.subject === "string" && Array.isArray(s.lessons));
  return ok ? data : null;
}

export async function serveLectures(corsHeaders) {
  const upstream = await fetch(LECTURES_SRC, { cf: { cacheTtl: 60, cacheEverything: true } });
  const data = upstream.ok ? extractLectures(await upstream.text()) : null;
  if (!data) return new Response(JSON.stringify({ error: "lectures unavailable" }), { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } });
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-cache", ...corsHeaders },
  });
}
