const RAW = process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8000";
const BASE = RAW.replace(/\/$/, "");

export function toLaravel(path: string) {
  if (!path.startsWith("/")) path = "/" + path;
  return `${BASE}${path}`;
}

export async function forwardToLaravel(path: string, init?: RequestInit) {
  const url = toLaravel(path);
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    // SSR + her istekte canlı veri
    cache: "no-store",
  });

  if (res.status === 204) {
    return new Response(null, { status: 204 });
  }

  // Response stream'ini pass-through (status preserve)
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
