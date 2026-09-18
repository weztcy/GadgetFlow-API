import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import { createAuditLog } from "@/services/audit.service";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout with HttpOnly refresh token cookie
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
 *         description: Logout berhasil
 *
 *       401:
 *         description: Refresh token tidak ditemukan atau tidak valid
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

  const token = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!token) {
    throw new ApiError(
      "Refresh token tidak ditemukan",
      401,
      "REFRESH_TOKEN_NOT_FOUND",
    );
  }

  await prisma.refreshToken.delete({
    where: {
      id: token.id,
    },
  });

  await createAuditLog({
    userId: token.userId,

    action: "LOGOUT",

    entity: "User",

    entityId: token.userId,

    newData: {
      action: "User logout",
    },

    ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  const response = successResponse(
    "Logout berhasil",

    null,
  );

  response.cookies.delete("refreshToken");

  return response;
});
