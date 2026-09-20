import { NextRequest } from "next/server";

import {
  getWarehouseById,
  updateWarehouse,
} from "@/services/warehouse.service";

import { updateWarehouseSchema } from "@/validators/warehouse.schema";

import { successResponse, errorResponse } from "@/lib/api-response";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { ApiError } from "@/lib/api-error";

import { createAuditLog } from "@/services/audit.service";

// =======================
// GET DETAIL WAREHOUSE
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

    const warehouse = await getWarehouseById(Number(id));

    return successResponse("Data gudang berhasil diambil", warehouse);
  } catch (error) {
    return errorResponse("Gagal mengambil data gudang");
  }
}

// =======================
// UPDATE WAREHOUSE
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

    const warehouseId = Number(id);

    if (isNaN(warehouseId)) {
      throw new ApiError(
        "ID warehouse tidak valid",
        400,
        "INVALID_WAREHOUSE_ID",
      );
    }

    const oldWarehouse = await getWarehouseById(warehouseId);

    if (!oldWarehouse) {
      throw new ApiError(
        "Warehouse tidak ditemukan",
        404,
        "WAREHOUSE_NOT_FOUND",
      );
    }

    const body = await request.json();

    const validated = updateWarehouseSchema.parse(body);

    const warehouse = await updateWarehouse(warehouseId, validated);

    await createAuditLog({
      userId: payload.id,

      action: "UPDATE",

      entity: "Warehouse",

      entityId: warehouseId,

      oldData: {
        id: oldWarehouse.id,

        code: oldWarehouse.code,

        name: oldWarehouse.name,

        location: oldWarehouse.location,

        status: oldWarehouse.status,
      },

      newData: {
        id: warehouse.id,

        code: warehouse.code,

        name: warehouse.name,

        location: warehouse.location,

        status: warehouse.status,
      },

      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return successResponse("Data gudang berhasil diperbarui", warehouse);
  } catch (error) {
    return errorResponse("Gagal memperbarui data gudang");
  }
}
