import bcrypt from "bcrypt";

import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import { getUserByEmail } from "@/services/user.service";

import {
  generateAccessToken,
  generateRefreshToken,
} from "@/services/token.service";

import { createAuditLog } from "@/services/audit.service";

import { authRateLimit } from "@/middleware/rate-limit.middleware";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login with HttpOnly refresh token cookie
 *
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
 *               - password
 *
 *             properties:
 *
 *               email:
 *                 type: string
 *                 example: budi@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: password123
 *
 *
 *     responses:
 *
 *       200:
 *         description: Login berhasil. Refresh token disimpan dalam HttpOnly cookie.
 *
 *       400:
 *         description: Email dan password wajib diisi
 *
 *       401:
 *         description: Email atau password salah
 */
export const POST = asyncHandler(async (request: NextRequest) => {
  authRateLimit(request);

  const body = await request.json();

  const { email, password } = body;

  if (!email || !password) {
    throw new ApiError(
      "Email dan password wajib diisi",
      400,
      "MISSING_LOGIN_FIELD",
    );
  }

  const user = await getUserByEmail(email);

  if (!user) {
    throw new ApiError("Email atau password salah", 401, "INVALID_CREDENTIALS");
  }

  const passwordMatch = await bcrypt.compare(
    password,

    user.password,
  );

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

      name: user.name,

      email: user.email,

      role: user.role,
    },
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
