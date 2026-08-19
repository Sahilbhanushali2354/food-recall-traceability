import { search } from "@/lib/queries";
import { handle } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const term = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (term.length < 2) return Response.json([]);

  return handle(() => search(term));
}
