import crypto from "crypto";

import { prisma } from "@/lib/prisma";

import { generateToken } from "@/lib/jwt";

export function generateAccessToken(user: {
  id: number;
  email: string;
  role: string;
}) {
  return generateToken({
    id: user.id,

    email: user.email,

    role: user.role,
  });
}

export async function generateRefreshToken(userId: number) {
  const token = crypto.randomBytes(64).toString("hex");

  const expiredAt = new Date();

  expiredAt.setDate(expiredAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token,

      userId,

      expiredAt,
    },
  });

  return token;
}

export async function verifyRefreshToken(token: string) {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: {
      token,
    },

    include: {
      user: {
        select: {
          id: true,

          name: true,

          email: true,

          role: true,
        },
      },
    },
  });

  if (!refreshToken) {
    return null;
  }

  if (refreshToken.expiredAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: refreshToken.id,
      },
    });

    return null;
  }

  return refreshToken.user;
}

export async function rotateRefreshToken(token: string) {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: {
      token,
    },

    include: {
      user: {
        select: {
          id: true,

          name: true,

          email: true,

          role: true,
        },
      },
    },
  });

  if (!refreshToken) {
    return null;
  }

  if (refreshToken.expiredAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: refreshToken.id,
      },
    });

    return null;
  }

  const newRefreshToken = crypto.randomBytes(64).toString("hex");

  const expiredAt = new Date();

  expiredAt.setDate(expiredAt.getDate() + 7);

  await prisma.$transaction([
    prisma.refreshToken.delete({
      where: {
        id: refreshToken.id,
      },
    }),

    prisma.refreshToken.create({
      data: {
        token: newRefreshToken,

        userId: refreshToken.user.id,

        expiredAt,
      },
    }),
  ]);

  return {
    refreshToken: newRefreshToken,

    user: refreshToken.user,
  };
}
