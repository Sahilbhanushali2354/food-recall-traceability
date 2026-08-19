import { getRecallImpact, listRecalls } from "@/lib/queries";
import { handle, apiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return apiError("bad_request", "A recall id is required.");

  return handle(
    async () => {
      const rows = await getRecallImpact(id);

      if (rows.length === 0) {
        const all = await listRecalls();
        const recall = all.find((r) => r.id === id);
        if (!recall) return null;
        return { recall, impact: [] };
      }

      return {
        recall: {
          id,
          severity: rows[0].severity,
          reason: rows[0].reason,
          issuedAt: rows[0].issuedAt,
        },
        impact: rows,
      };
    },
  );
}
