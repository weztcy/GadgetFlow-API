import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import {
  rotateRefreshToken,
  generateAccessToken,
} from "@/services/token.service";

import { createAuditLog } from "@/services/audit.service";

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token with HttpOnly refresh token cookie rotation
 *     tags:
 *       - Authentication
 *
 *     parameters:
 *
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         example: refresh_token_example
 *
 *
 *     responses:
 *
 *       200:
 *         description: Token berhasil diperbarui
 *
 *       401:
 *         description: Refresh token tidak valid
 */
export const POST = asyncHandler(async (request: NextRequest) => {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    throw new ApiError(
      "Refresh token wajib diisi",

      401,

      "MISSING_REFRESH_TOKEN",
    );
  }

  const result = await rotateRefreshToken(refreshToken);

  if (!result) {
    throw new ApiError(
      "Refresh token tidak valid",

      401,

      "INVALID_REFRESH_TOKEN",
    );
  }

  const accessToken = generateAccessToken({
    id: result.user.id,

    email: result.user.email,

    role: result.user.role,
  });

  await createAuditLog({
    userId: result.user.id,

    action: "REFRESH_TOKEN_ROTATION",

    entity: "User",

    entityId: result.user.id,

    newData: {
      action: "Refresh token rotated",
    },

    ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  const response = successResponse(
    "Token berhasil diperbarui",

    {
      accessToken,
    },
  );

  response.cookies.set(
    "refreshToken",

    result.refreshToken,

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
