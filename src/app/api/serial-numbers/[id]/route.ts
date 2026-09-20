import { NextRequest } from "next/server";

import { successResponse, errorResponse } from "@/lib/api-response";

import {
  getSerialNumberById,
  updateSerialStatus,
  deleteSerialNumber,
} from "@/services/serial-number.service";

import { updateSerialNumberSchema } from "@/validators/serial-number.schema";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { ApiError } from "@/lib/api-error";

import { createAuditLog } from "@/services/audit.service";

// =======================
// GET DETAIL SERIAL
// =======================

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await context.params;

    const serial = await getSerialNumberById(Number(id));

    return successResponse("Data serial number berhasil diambil", serial);
  } catch (error) {
    return errorResponse("Gagal mengambil serial number");
  }
}

// =======================
// UPDATE STATUS SERIAL
// =======================

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const payload = authenticate(request);

    if (!payload) {
      throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    requireRole(payload, ["ADMIN"]);

    const { id } = await context.params;

    const serialId = Number(id);

    const oldSerial = await getSerialNumberById(serialId);

    if (!oldSerial) {
      throw new ApiError(
        "Serial number tidak ditemukan",
        404,
        "SERIAL_NOT_FOUND",
      );
    }

    const body = await request.json();

    const validation = updateSerialNumberSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Status serial number tidak valid",
        400,
        "VALIDATION_ERROR",
        validation.error.format(),
      );
    }

    const serial = await updateSerialStatus(serialId, validation.data);

    await createAuditLog({
      userId: payload.id,

      action: "UPDATE",

      entity: "SerialNumber",

      entityId: serialId,

      oldData: {
        id: oldSerial.id,

        serialNumber: oldSerial.serialNumber,

        status: oldSerial.status,
      },

      newData: {
        id: serial.id,

        serialNumber: serial.serialNumber,

        status: serial.status,
      },

      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return successResponse("Status serial number berhasil diperbarui", serial);
  } catch (error) {
    return errorResponse("Gagal memperbarui serial number");
  }
}

// =======================
// DELETE SERIAL
// =======================

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const payload = authenticate(request);

    if (!payload) {
      throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    requireRole(payload, ["ADMIN"]);

    const { id } = await context.params;

    const serialId = Number(id);

    const oldSerial = await getSerialNumberById(serialId);

    if (!oldSerial) {
      throw new ApiError(
        "Serial number tidak ditemukan",
        404,
        "SERIAL_NOT_FOUND",
      );
    }

    const serial = await deleteSerialNumber(serialId);

    await createAuditLog({
      userId: payload.id,

      action: "DELETE",

      entity: "SerialNumber",

      entityId: serialId,

      oldData: {
        id: oldSerial.id,

        serialNumber: oldSerial.serialNumber,

        productId: oldSerial.productId,

        warehouseId: oldSerial.warehouseId,

        status: oldSerial.status,
      },

      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return successResponse("Serial number berhasil dihapus", serial);
  } catch (error) {
    return errorResponse("Gagal menghapus serial number");
  }
}
