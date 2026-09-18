import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import {
  verifyRefreshToken,
  generateAccessToken,
} from "@/services/token.service";

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - refreshToken
 *
 *             properties:
 *
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIs...
 *
 *
 *     responses:
 *
 *       200:
 *         description: Access token berhasil diperbarui
 *
 *       400:
 *         description: Refresh token wajib diisi
 *
 *       401:
 *         description: Refresh token tidak valid
 */
export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();

  const { refreshToken } = body;

  if (!refreshToken) {
    throw new ApiError(
      "Refresh token wajib diisi",
      400,
      "MISSING_REFRESH_TOKEN",
    );
  }

  const user = await verifyRefreshToken(refreshToken);

  if (!user) {
    throw new ApiError(
      "Refresh token tidak valid",
      401,
      "INVALID_REFRESH_TOKEN",
    );
  }

  const accessToken = generateAccessToken({
    id: user.id,

    email: user.email,

    role: user.role,
  });

  return successResponse(
    "Access token berhasil diperbarui",

    {
      accessToken,
    },
  );
});
