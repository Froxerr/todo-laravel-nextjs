import { forwardToLaravel } from "../../_lib/proxy";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await _req.text();

  return forwardToLaravel(`/api/todos/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body,
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  return forwardToLaravel(`/api/todos/${id}`, { method: "DELETE" });
}
