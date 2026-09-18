import bcrypt from "bcrypt";

import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import { resetPasswordSchema } from "@/validators/auth.schema";

import {
  verifyResetToken,
  deleteResetToken,
} from "@/services/password-reset.service";

import { createAuditLog } from "@/services/audit.service";

import { prisma } from "@/lib/prisma";

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
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
 *               - token
 *               - password
 *
 *             properties:
 *
 *               token:
 *                 type: string
 *
 *               password:
 *                 type: string
 *
 *
 *     responses:
 *
 *       200:
 *         description: Password berhasil direset
 *
 *       400:
 *         description: Data tidak valid
 *
 *       401:
 *         description: Token reset password tidak valid atau expired
 */
export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();

  const validation = resetPasswordSchema.safeParse(body);

  if (!validation.success) {
    throw validation.error;
  }

  const { token, password } = validation.data;

  const resetToken = await verifyResetToken(token);

  if (!resetToken) {
    throw new ApiError(
      "Token reset password tidak valid atau expired",
      401,
      "INVALID_RESET_TOKEN",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: resetToken.userId,
    },

    data: {
      password: hashedPassword,
    },
  });

  await prisma.refreshToken.deleteMany({
    where: {
      userId: resetToken.userId,
    },
  });

  await createAuditLog({
    userId: resetToken.userId,

    action: "RESET_PASSWORD",

    entity: "User",

    entityId: resetToken.userId,

    newData: {
      action: "Password reset successfully",
    },

    ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  await deleteResetToken(token);

  return successResponse(
    "Password berhasil direset",

    null,
  );
});
