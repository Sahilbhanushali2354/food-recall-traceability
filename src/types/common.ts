export type Severity = "critical" | "high" | "moderate";

export type ApiErrorKind =
  | "unavailable"
  | "not_found"
  | "bad_request"
  | "conflict"
  | "server_error";

export type ApiErrorBody = {
  error: true;
  kind: ApiErrorKind;
  message: string;
};

export type IngredientCategory =
  | "nut"
  | "oil"
  | "dairy"
  | "grain"
  | "cocoa"
  | "additive"
  | "sweetener"
  | "seed"
  | "spice"
  | "egg"
  | "fruit";
