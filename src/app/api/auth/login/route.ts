import bcrypt from "bcrypt";

import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import { loginSchema } from "@/validators/auth.schema";

import { getUserByEmail } from "@/services/user.service";

import {
  generateAccessToken,
  generateRefreshToken,
} from "@/services/token.service";

import { createAuditLog } from "@/services/audit.service";

import { authRateLimit } from "@/middleware/rate-limit.middleware";

export const POST = asyncHandler(async (request: NextRequest) => {
  authRateLimit(request);

  const body = await request.json();

  const validation = loginSchema.safeParse(body);

  if (!validation.success) {
    throw new ApiError(
      "Email atau password tidak valid",
      400,
      "INVALID_LOGIN_DATA",
    );
  }

  const { email, password } = validation.data;

  const user = await getUserByEmail(email);

  if (!user) {
    throw new ApiError("Email atau password salah", 401, "INVALID_CREDENTIALS");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new ApiError("Email atau password salah", 401, "INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken({
    id: user.id,

    email: user.email,

    role: user.role,
  });

  const refreshToken = await generateRefreshToken(user.id);

  await createAuditLog({
    userId: user.id,

    action: "LOGIN",

    entity: "User",

    entityId: user.id,

    newData: {
      id: user.id,

      email: user.email,

      role: user.role,
    },

    ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  const response = successResponse(
    "Login berhasil",

    {
      accessToken,

      user: {
        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,
      },
    },
  );

  response.cookies.set(
    "refreshToken",

    refreshToken,

    {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "strict",

      maxAge: 60 * 60 * 24 * 7,

      path: "/",
    },
  );

  return response;
});
