import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient } from "@prisma/client";

if (
  !process.env.DATABASE_HOST ||
  !process.env.DATABASE_USER ||
  !process.env.DATABASE_NAME
) {
  throw new Error("Database environment belum lengkap");
}

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,

  port: Number(process.env.DATABASE_PORT ?? 3306),

  user: process.env.DATABASE_USER,

  password: process.env.DATABASE_PASSWORD ?? "",

  database: process.env.DATABASE_NAME,

  connectionLimit: 5,
});

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
