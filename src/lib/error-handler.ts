import { Prisma } from "@prisma/client";

import { ZodError } from "zod";

import { errorResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

export function handleApiError(error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  if (error instanceof ApiError) {
    return errorResponse(
      error.message,

      error.statusCode,

      error.code,
    );
  }

  if (error instanceof ZodError) {
    const validationErrors = error.issues.map((issue) => ({
      field: issue.path.join("."),

      message: issue.message,
    }));

    return errorResponse(
      "Data tidak valid",

      400,

      "VALIDATION_ERROR",

      validationErrors,
    );
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return errorResponse(
      "Data database tidak valid",

      400,

      "DATABASE_VALIDATION_ERROR",
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return errorResponse(
          "Data sudah tersedia",

          409,

          "DUPLICATE_DATA",
        );

      case "P2003":
        return errorResponse(
          "Data masih digunakan oleh data lain",

          409,

          "FOREIGN_KEY_ERROR",
        );

      case "P2025":
        return errorResponse(
          "Data tidak ditemukan",

          404,

          "NOT_FOUND",
        );

      default:
        return errorResponse(
          "Database error",

          500,

          "DATABASE_ERROR",
        );
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return errorResponse(
      "Database tidak dapat terhubung",

      500,

      "DATABASE_CONNECTION_ERROR",
    );
  }

  if (error instanceof Error) {
    if (error.name === "JsonWebTokenError") {
      return errorResponse(
        "Token tidak valid",

        401,

        "INVALID_TOKEN",
      );
    }

    if (error.name === "TokenExpiredError") {
      return errorResponse(
        "Token sudah expired",

        401,

        "TOKEN_EXPIRED",
      );
    }
  }

  return errorResponse(
    "Internal Server Error",

    500,

    "INTERNAL_SERVER_ERROR",
  );
}
