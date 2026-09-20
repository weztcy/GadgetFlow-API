import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import { createOrder, getOrders } from "@/services/order.service";

import { createAuditLog } from "@/services/audit.service";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { orderSchema } from "@/validators/order.schema";

// =======================
// GET ALL ORDER
// =======================

export const GET = asyncHandler(async (request: NextRequest) => {
  const payload = authenticate(request);

  if (!payload) {
    throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  requireRole(payload, ["ADMIN"]);

  const orders = await getOrders();

  return successResponse("Berhasil mengambil data order", orders);
});

// =======================
// CREATE ORDER
// =======================

export const POST = asyncHandler(async (request: NextRequest) => {
  const payload = authenticate(request);

  if (!payload) {
    throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  requireRole(payload, ["ADMIN"]);

  const body = await request.json();

  const validation = orderSchema.safeParse(body);

  if (!validation.success) {
    throw validation.error;
  }

  const order = await createOrder(validation.data);

  if (!order) {
    throw new ApiError("Order gagal dibuat", 500, "ORDER_CREATE_FAILED");
  }

  await createAuditLog({
    userId: payload.id,

    action: "CREATE",

    entity: "Order",

    entityId: order.id,

    newData: {
      id: order.id,

      customerId: order.customerId,

      customerName: order.customer?.name ?? null,

      total: order.total,
    },

    ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  return successResponse("Order berhasil dibuat", order);
});
