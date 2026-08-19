import { getTraceToStore } from "@/lib/queries";
import { handle, apiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplier = searchParams.get("supplier");
  const store = searchParams.get("store");

  if (!supplier || !store) {
    return apiError("bad_request", "Both a supplier and a store are required.");
  }

  return handle(() => getTraceToStore(supplier, store));
}
