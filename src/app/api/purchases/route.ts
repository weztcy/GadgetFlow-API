import { NextRequest } from "next/server";

import { successResponse, errorResponse } from "@/lib/api-response";

import { createPurchase } from "@/services/purchase.service";

import { prisma } from "@/lib/prisma";

import { createPurchaseSchema } from "@/validators/purchase.schema";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { ApiError } from "@/lib/api-error";

import { createAuditLog } from "@/services/audit.service";

// =======================
// GET ALL PURCHASE
// =======================

export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        supplier: true,

        items: {
          include: {
            product: true,

            warehouse: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse("Berhasil mengambil data purchase", purchases);
  } catch (error) {
    return errorResponse("Gagal mengambil data purchase");
  }
}

// =======================
// CREATE PURCHASE
// =======================

export async function POST(request: NextRequest) {
  try {
    const payload = authenticate(request);

    if (!payload) {
      throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    requireRole(payload, ["ADMIN"]);

    const body = await request.json();

    const validation = createPurchaseSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Data purchase tidak valid",

        400,

        "VALIDATION_ERROR",

        validation.error.format(),
      );
    }

    const purchase = await createPurchase(validation.data);

    if (!purchase) {
      throw new ApiError(
        "Purchase gagal dibuat",
        500,
        "PURCHASE_CREATE_FAILED",
      );
    }

    await createAuditLog({
      userId: payload.id,

      action: "CREATE",

      entity: "Purchase",

      entityId: purchase.id,

      newData: {
        id: purchase.id,

        supplierId: purchase.supplierId,

        total: purchase.total,
      },

      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return successResponse(
      "Purchase berhasil dibuat",

      purchase,

      201,
    );
  } catch (error) {
    return errorResponse("Gagal membuat purchase");
  }
}
