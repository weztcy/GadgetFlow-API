import { ApiError } from "@/lib/api-error";

type AuthPayload = {
  id: number;

  email: string;

  role: string;
};

export function requireRole(payload: AuthPayload | null, roles: string[]) {
  if (!payload) {
    throw new ApiError(
      "Unauthorized",

      401,

      "UNAUTHORIZED",
    );
  }

  if (!roles.includes(payload.role)) {
    throw new ApiError(
      "Forbidden",

      403,

      "FORBIDDEN",
    );
  }

  return true;
}
