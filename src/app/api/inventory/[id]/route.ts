import { NextRequest } from "next/server";

import {
  getInventoryById,
  updateInventory,
} from "@/services/inventory.service";

import { updateInventorySchema } from "@/validators/inventory.schema";

import { successResponse, errorResponse } from "@/lib/api-response";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { ApiError } from "@/lib/api-error";

import { createAuditLog } from "@/services/audit.service";

// =======================
// GET DETAIL INVENTORY
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

    const inventoryId = Number(id);

    if (isNaN(inventoryId)) {
      return errorResponse("ID inventory tidak valid", 400, "INVALID_ID");
    }

    const inventory = await getInventoryById(inventoryId);

    return successResponse("Data inventory berhasil diambil", inventory);
  } catch (error) {
    return errorResponse("Gagal mengambil data inventory");
  }
}

// =======================
// UPDATE INVENTORY
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

    const inventoryId = Number(id);

    if (isNaN(inventoryId)) {
      return errorResponse("ID inventory tidak valid", 400, "INVALID_ID");
    }

    const oldInventory = await getInventoryById(inventoryId);

    if (!oldInventory) {
      throw new ApiError(
        "Inventory tidak ditemukan",
        404,
        "INVENTORY_NOT_FOUND",
      );
    }

    const body = await request.json();

    const validation = updateInventorySchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Data inventory tidak valid",
        400,
        "VALIDATION_ERROR",
        validation.error.format(),
      );
    }

    const inventory = await updateInventory(inventoryId, validation.data);

    await createAuditLog({
      userId: payload.id,

      action: "UPDATE",

      entity: "Inventory",

      entityId: inventoryId,

      oldData: {
        id: oldInventory.id,

        productId: oldInventory.productId,

        warehouseId: oldInventory.warehouseId,

        quantity: oldInventory.quantity,
      },

      newData: {
        id: inventory.id,

        productId: inventory.productId,

        warehouseId: inventory.warehouseId,

        quantity: inventory.quantity,
      },

      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return successResponse("Data inventory berhasil diperbarui", inventory);
  } catch (error) {
    return errorResponse("Gagal memperbarui data inventory");
  }
}
