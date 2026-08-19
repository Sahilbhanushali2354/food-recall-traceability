"use client";

import axios, { AxiosError } from "axios";
import type { ApiErrorKind } from "./api-response";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL: "/api",

  timeout: 30_000,
  headers: { Accept: "application/json" },
});

type ApiErrorBody = { error: true; kind: ApiErrorKind; message: string };

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    "message" in value
  );
}

apiClient.interceptors.response.use(

  (response) => response.data,

  (error: AxiosError) => {

    if (isApiErrorBody(error.response?.data)) {
      const body = error.response.data;
      return Promise.reject(new ApiError(body.kind, body.message, error.response.status));
    }

    if (!error.response || error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
      return Promise.reject(
        new ApiError(
          "unavailable",
          "Can't reach the traceability service. Check your connection and try again.",
        ),
      );
    }

    return Promise.reject(
      new ApiError(
        "server_error",
        "Something went wrong while looking that up.",
        error.response.status,
      ),
    );
  },
);

export async function apiGet<T>(
  url: string,
  params?: Record<string, string>,
  signal?: AbortSignal,
): Promise<T> {
  return apiClient.get(url, { params, signal }) as unknown as Promise<T>;
}
