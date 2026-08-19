import { getDriver } from "@/lib/db";
import { handle } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    await getDriver().verifyConnectivity();
    return { ok: true, checkedAt: new Date().toISOString() };
  });
}
