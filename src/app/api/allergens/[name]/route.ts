import { getHiddenAllergens } from "@/lib/queries";
import { handle, apiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!name) return apiError("bad_request", "An allergen name is required.");

  return handle(() => getHiddenAllergens(decodeURIComponent(name)));
}
