import { listProducts, createProduct, productExists } from "@/lib/queries";
import { handle, apiError } from "@/lib/api-response";
import { createProductSchema } from "@/schemas/product";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(() => listProducts());
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("bad_request", "The request body wasn't valid JSON.");
  }

  const parsed = createProductSchema.safeParse(body);

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const field = first.path.join(".");
    return apiError("bad_request", field ? `${field}: ${first.message}` : first.message);
  }

  const input = parsed.data;

  try {

    if (await productExists(input.name)) {
      return apiError(
        "conflict",
        `A product called "${input.name}" already exists. Pick a different name.`,
      );
    }

    const result = await createProduct(input);
    return Response.json(result, { status: 201 });
  } catch (error) {

    if (error instanceof Error && error.message.startsWith("Unknown ")) {
      return apiError("bad_request", error.message);
    }
    return handle(() => Promise.reject(error));
  }
}
