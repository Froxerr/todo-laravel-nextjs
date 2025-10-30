import { toLaravel } from "../_lib/proxy";

export const dynamic = "force-dynamic";

export async function GET() {
  const res = await fetch(toLaravel("/aes.js"), { cache: "no-store" });
  return new Response(await res.arrayBuffer(), {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/javascript",
      "cache-control": "no-store",
    },
  });
}