const RAW = process.env.LARAVEL_API_URL ?? "https://laravelapiproject.wuaze.com";
const BASE = RAW.replace(/\/$/, "");

export function toLaravel(path: string) {
  if (!path.startsWith("/")) path = "/" + path;
  return `${BASE}${path}`;
}

export async function forwardToLaravel(req: Request, path: string, init?: RequestInit) {
  const url = toLaravel(path);

  const res = await fetch(url, {
    method: init?.method ?? "GET",
    headers: {
      ...(init?.headers || {}),
      cookie: req.headers.get("cookie") ?? "",
      "user-agent": req.headers.get("user-agent") ?? "",
      "accept-language": req.headers.get("accept-language") ?? "",
    },
    body: init?.body,
    redirect: "manual",
    cache: "no-store",
  });

  if (res.status === 204) {
    return new Response(null, { status: 204 });
  }

  const ct = res.headers.get("content-type") || "";

  if (ct.includes("text/html")) {
    let html = await res.text();
    const origin = new URL(req.url).origin;

    html = html
      .replaceAll("https://laravelapiproject.wuaze.com", origin)
      .replaceAll(BASE, origin);

    return new Response(html, {
      status: res.status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": ct,
      "cache-control": "no-store",
    },
  });
}