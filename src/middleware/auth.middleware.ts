import { NextRequest } from "next/server";

import { verifyToken } from "@/lib/jwt";

type AuthPayload = {
  id: number;

  email: string;

  role: string;
};

export function authenticate(request: NextRequest): AuthPayload | null {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(" ");

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
  } catch (error) {
    return null;
  }
}
