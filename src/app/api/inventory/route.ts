import { NextRequest } from "next/server";

import {
  createInventory,
  getInventories,
  getLowStock,
} from "@/services/inventory.service";

import { createInventorySchema } from "@/validators/inventory.schema";

import { successResponse, errorResponse } from "@/lib/api-response";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { ApiError } from "@/lib/api-error";

import { createAuditLog } from "@/services/audit.service";

// =======================
// GET ALL INVENTORY
// =======================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const lowStock = searchParams.get("lowStock");

    if (lowStock) {
      const inventories = await getLowStock(Number(lowStock));

      return successResponse("Data stok minimum berhasil diambil", inventories);
    }

    const inventories = await getInventories();

    return successResponse("Data inventory berhasil diambil", inventories);
  } catch (error) {
    return errorResponse("Gagal mengambil data inventory");
  }
}

// =======================
// CREATE INVENTORY
// =======================

export async function POST(request: NextRequest) {
  try {
    const payload = authenticate(request);

    if (!payload) {
      throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    requireRole(payload, ["ADMIN"]);

    const body = await request.json();

    const validation = createInventorySchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Data inventory tidak valid",
        400,
        "VALIDATION_ERROR",
        validation.error.format(),
      );
    }

    const inventory = await createInventory(validation.data);

    await createAuditLog({
      userId: payload.id,

      action: "CREATE",

      entity: "Inventory",

      entityId: inventory.id,

      newData: {
        id: inventory.id,

        productId: inventory.productId,

        warehouseId: inventory.warehouseId,

        quantity: inventory.quantity,
      },

      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return successResponse("Stok berhasil ditambahkan", inventory, 201);
  } catch (error) {
    return errorResponse("Gagal menambahkan stok");
  }
}
