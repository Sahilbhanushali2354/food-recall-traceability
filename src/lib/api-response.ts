import { NextResponse } from "next/server";

import type { ApiErrorKind, ApiErrorBody } from "@/types";

export type { ApiErrorKind, ApiErrorBody };

const MESSAGES: Record<ApiErrorKind, string> = {
  unavailable:
    "Can't reach the traceability database right now. The data is safe — this is a connection problem.",
  not_found: "We couldn't find that record.",
  bad_request: "That request was missing something we needed.",
  conflict: "That already exists.",
  server_error: "Something went wrong while looking that up.",
};

const STATUS: Record<ApiErrorKind, number> = {
  unavailable: 503,
  not_found: 404,
  bad_request: 400,
  conflict: 409,
  server_error: 500,
};

export function apiError(kind: ApiErrorKind, message?: string) {
  const body: ApiErrorBody = { error: true, kind, message: message ?? MESSAGES[kind] };
  return NextResponse.json(body, { status: STATUS[kind] });
}

function isConnectivityProblem(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = String((error as { code?: unknown }).code ?? "");
  if (
    code.includes("ServiceUnavailable") ||
    code.includes("SessionExpired") ||
    code.includes("Neo.ClientError.Security.Unauthorized")
  ) {
    return true;
  }
  return ["ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "ECONNRESET", "EAI_AGAIN", "CERT_"].some(
    (needle) => code.includes(needle) || error.message.includes(needle),
  );
}

export async function handle<T>(
  work: () => Promise<T>,
  options: { notFoundIf?: (value: T) => boolean } = {},
) {
  try {
    const result = await work();

    const missing =
      result === null ||
      result === undefined ||
      (options.notFoundIf ? options.notFoundIf(result) : false);

    if (missing) return apiError("not_found");

    return NextResponse.json(result);
  } catch (error) {

    console.error("[api]", error);

    if (isConnectivityProblem(error)) return apiError("unavailable");
    return apiError("server_error");
  }
}
