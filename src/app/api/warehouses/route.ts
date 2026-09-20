import { NextRequest } from "next/server";

import { createWarehouse, getWarehouses } from "@/services/warehouse.service";

import { createWarehouseSchema } from "@/validators/warehouse.schema";

import { successResponse, errorResponse } from "@/lib/api-response";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { ApiError } from "@/lib/api-error";

import { createAuditLog } from "@/services/audit.service";

// =======================
// GET ALL WAREHOUSE
// =======================

export async function GET() {
  try {
    const warehouses = await getWarehouses();

    return successResponse("Data gudang berhasil diambil", warehouses);
  } catch (error) {
    return errorResponse("Gagal mengambil data gudang");
  }
}

// =======================
// CREATE WAREHOUSE
// =======================

export async function POST(request: NextRequest) {
  try {
    const payload = authenticate(request);

    if (!payload) {
      throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    requireRole(payload, ["ADMIN"]);

    const body = await request.json();

    const validated = createWarehouseSchema.parse(body);

    const warehouse = await createWarehouse(validated);

    await createAuditLog({
      userId: payload.id,

      action: "CREATE",

      entity: "Warehouse",

      entityId: warehouse.id,

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

    return successResponse("Gudang berhasil dibuat", warehouse, 201);
  } catch (error) {
    return errorResponse("Gagal membuat gudang");
  }
}
