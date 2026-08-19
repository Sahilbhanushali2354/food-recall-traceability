import { listAllergens } from "@/lib/queries";
import { handle } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(() => listAllergens());
}
