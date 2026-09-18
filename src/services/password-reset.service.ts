import crypto from "crypto";

import { prisma } from "@/lib/prisma";

function createResetTokenValue() {
  return crypto.randomBytes(64).toString("hex");
}

function createResetTokenExpiry() {
  const expiredAt = new Date();

  expiredAt.setMinutes(expiredAt.getMinutes() + 15);

  return expiredAt;
}

export async function generateResetToken(userId: number) {
  const token = createResetTokenValue();

  const expiredAt = createResetTokenExpiry();

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({
      where: {
        userId,
      },
    }),

    prisma.passwordResetToken.create({
      data: {
        token,

        userId,

        expiredAt,
      },
    }),
  ]);

  return token;
}

export async function verifyResetToken(token: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
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

  if (!resetToken) {
    return null;
  }

  if (resetToken.expiredAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });

    return null;
  }

  return resetToken;
}

export async function deleteResetToken(token: string) {
  return prisma.passwordResetToken.delete({
    where: {
      token,
    },
  });
}
