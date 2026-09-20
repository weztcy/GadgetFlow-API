import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import { getOrderById, deleteOrder } from "@/services/order.service";

import { authenticate } from "@/middleware/auth.middleware";

import { createAuditLog } from "@/services/audit.service";

import { requireRole } from "@/middleware/role.middleware";

// =======================
// GET DETAIL ORDER
// =======================

export const GET = asyncHandler(
  async (
    request: NextRequest,

    context: {
      params: Promise<{ id: string }>;
    },
  ) => {
    const payload = authenticate(request);

    if (!payload) {
      throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    requireRole(payload, ["ADMIN"]);

    const { id } = await context.params;

    const orderId = Number(id);

    if (isNaN(orderId)) {
      throw new ApiError("ID order tidak valid", 400, "INVALID_ORDER_ID");
    }

    const order = await deleteOrder(orderId);

    if (!order) {
      throw new ApiError("Order gagal dihapus", 500, "ORDER_DELETE_FAILED");
    }

    if (!order) {
      throw new ApiError("Order tidak ditemukan", 404, "ORDER_NOT_FOUND");
    }

    return successResponse("Order ditemukan", order);
  },
);

// =======================
// DELETE ORDER
// =======================

export const DELETE = asyncHandler(
  async (
    request: NextRequest,

    context: {
      params: Promise<{ id: string }>;
    },
  ) => {
    const payload = authenticate(request);

    if (!payload) {
      throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    requireRole(payload, ["ADMIN"]);

    const { id } = await context.params;

    const orderId = Number(id);

    if (isNaN(orderId)) {
      throw new ApiError("ID order tidak valid", 400, "INVALID_ORDER_ID");
    }

    const oldOrder = await getOrderById(orderId);

    if (!oldOrder) {
      throw new ApiError("Order tidak ditemukan", 404, "ORDER_NOT_FOUND");
    }

    const order = await deleteOrder(orderId);

    await createAuditLog({
      userId: payload.id,

      action: "DELETE",

      entity: "Order",

      entityId: orderId,

      oldData: {
        id: oldOrder.id,

        customerId: oldOrder.customerId,

        customerName: oldOrder.customer?.name ?? null,

        total: oldOrder.total,
      },

      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return successResponse("Order berhasil dihapus", order);
  },
);
