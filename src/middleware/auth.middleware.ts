import { NextRequest } from "next/server";

import { verifyToken } from "@/lib/jwt";

import type { AuthPayload } from "@/middleware/role.middleware";

export function authenticate(request: NextRequest): AuthPayload | null {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.trim().split(/\s+/);

  const scheme = parts[0];

  const token = parts[1];

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  try {
    const payload = verifyToken(token);

    if (typeof payload !== "object" || payload === null) {
      return null;
    }

    if (
      typeof payload.id !== "number" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    return {
      id: payload.id,

      email: payload.email,

      role: payload.role,
    };
  } catch {
    return null;
  }
}
