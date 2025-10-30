import { forwardToLaravel } from "../_lib/proxy";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { search } = new URL(req.url);
  return forwardToLaravel("/api/todos" + search);
}

export async function POST(req: Request) {
  const body = await req.text();
  return forwardToLaravel("/api/todos", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}
