import { NextRequest } from "next/server";

import {
  createSerialNumber,
  getSerialNumbers,
} from "@/services/serial-number.service";

import { createSerialNumberSchema } from "@/validators/serial-number.schema";

import { successResponse, errorResponse } from "@/lib/api-response";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { ApiError } from "@/lib/api-error";

import { createAuditLog } from "@/services/audit.service";

// =======================
// GET ALL SERIAL NUMBER
// =======================

export async function GET() {
  try {
    const serialNumbers = await getSerialNumbers();

    return successResponse(
      "Data serial number berhasil diambil",
      serialNumbers,
    );
  } catch (error) {
    return errorResponse("Gagal mengambil data serial number");
  }
}

// =======================
// CREATE SERIAL NUMBER
// =======================

export async function POST(request: NextRequest) {
  try {
    const payload = authenticate(request);

    if (!payload) {
      throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    requireRole(payload, ["ADMIN"]);

    const body = await request.json();

    const validation = createSerialNumberSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Data serial number tidak valid",
        400,
        "VALIDATION_ERROR",
        validation.error.format(),
      );
    }

    const serialNumber = await createSerialNumber(validation.data);

    await createAuditLog({
      userId: payload.id,

      action: "CREATE",

      entity: "SerialNumber",

      entityId: serialNumber.id,

      newData: {
        id: serialNumber.id,

        productId: serialNumber.productId,

        warehouseId: serialNumber.warehouseId,

        serialNumber: serialNumber.serialNumber,

        status: serialNumber.status,
      },

      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return successResponse("Serial number berhasil dibuat", serialNumber, 201);
  } catch (error) {
    return errorResponse("Gagal membuat serial number");
  }
}
