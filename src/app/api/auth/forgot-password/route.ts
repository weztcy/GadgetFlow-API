import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import { getUserByEmail } from "@/services/user.service";

import { generateResetToken } from "@/services/password-reset.service";

import { sendResetPasswordEmail } from "@/services/email.service";

import { createAuditLog } from "@/services/audit.service";

import { authRateLimit } from "@/middleware/rate-limit.middleware";

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset link
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
 *               - email
 *
 *             properties:
 *
 *               email:
 *                 type: string
 *                 example: budi@gmail.com
 *
 *
 *     responses:
 *
 *       200:
 *         description: Link reset password telah dikirim
 *
 *       400:
 *         description: Email wajib diisi
 *
 *       404:
 *         description: Email tidak ditemukan
 */
export const POST = asyncHandler(async (request: NextRequest) => {
  authRateLimit(request);

  const body = await request.json();

  const { email } = body;

  if (!email) {
    throw new ApiError("Email wajib diisi", 400, "MISSING_EMAIL");
  }

  const user = await getUserByEmail(email);

  if (!user) {
    throw new ApiError("Email tidak ditemukan", 404, "EMAIL_NOT_FOUND");
  }

  const token = await generateResetToken(user.id);

  await sendResetPasswordEmail({
    name: user.name,

    email: user.email,

    token,
  });

  await createAuditLog({
    userId: user.id,

    action: "REQUEST_RESET_PASSWORD",

    entity: "User",

    entityId: user.id,

    newData: {
      action: "Password reset link requested",
    },

    ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  return successResponse(
    "Link reset password telah dikirim",

    null,
  );
});
