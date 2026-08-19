import { listIngredients, createIngredient, ingredientExists } from "@/lib/queries";
import { handle, apiError } from "@/lib/api-response";
import { createIngredientSchema } from "@/schemas/ingredient";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(() => listIngredients());
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("bad_request", "The request body wasn't valid JSON.");
  }

  const parsed = createIngredientSchema.safeParse(body);

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const field = first.path.join(".");
    return apiError("bad_request", field ? `${field}: ${first.message}` : first.message);
  }

  const input = parsed.data;

  try {
    if (await ingredientExists(input.name)) {
      return apiError(
        "conflict",
        `An ingredient called "${input.name}" already exists. Pick it from the list instead.`,
      );
    }

    const result = await createIngredient(input);
    return Response.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unknown ")) {
      return apiError("bad_request", error.message);
    }
    return handle(() => Promise.reject(error));
  }
}
