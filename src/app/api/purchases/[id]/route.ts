import { NextRequest } from "next/server";

import { successResponse, errorResponse } from "@/lib/api-response";

import { getPurchaseById, cancelPurchase } from "@/services/purchase.service";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { ApiError } from "@/lib/api-error";

import { createAuditLog } from "@/services/audit.service";

// =======================
// GET DETAIL PURCHASE
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

    const purchase = await getPurchaseById(Number(id));

    return successResponse("Purchase ditemukan", purchase);
  } catch (error) {
    return errorResponse("Gagal mengambil purchase");
  }
}

// =======================
// DELETE / CANCEL PURCHASE
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

    const purchaseId = Number(id);

    if (isNaN(purchaseId)) {
      throw new ApiError("ID purchase tidak valid", 400, "INVALID_PURCHASE_ID");
    }

    const oldPurchase = await getPurchaseById(purchaseId);

    if (!oldPurchase) {
      throw new ApiError("Purchase tidak ditemukan", 404, "PURCHASE_NOT_FOUND");
    }

    const purchase = await cancelPurchase(purchaseId);

    await createAuditLog({
      userId: payload.id,

      action: "DELETE",

      entity: "Purchase",

      entityId: purchaseId,

      oldData: {
        id: oldPurchase.id,

        supplierId: oldPurchase.supplierId,

        total: oldPurchase.total,
      },

      newData: {
        id: purchase.id,

        status: "CANCELLED",
      },

      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return successResponse("Purchase berhasil dibatalkan", purchase);
  } catch (error) {
    return errorResponse("Gagal membatalkan purchase");
  }
}
