import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import { getOrderById, deleteOrder } from "@/services/order.service";

import { authenticate } from "@/middleware/auth.middleware";

import { createAuditLog } from "@/services/audit.service";

import { requireRole } from "@/middleware/role.middleware";

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order detail
 *
 *     tags:
 *       - Orders
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *           example: 1
 *
 *
 *     responses:
 *
 *       200:
 *         description: Order ditemukan
 *
 *       400:
 *         description: ID order tidak valid
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Order tidak ditemukan
 *
 *       500:
 *         description: Internal server error
 */
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

    const order = await getOrderById(orderId);

    if (!order) {
      throw new ApiError("Order tidak ditemukan", 404, "ORDER_NOT_FOUND");
    }

    return successResponse("Order ditemukan", order);
  },
);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete order
 *
 *     tags:
 *       - Orders
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *           example: 1
 *
 *
 *     responses:
 *
 *       200:
 *         description: Order berhasil dihapus
 *
 *       400:
 *         description: ID order tidak valid
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Order tidak ditemukan
 *
 *       500:
 *         description: Internal server error
 */
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

        customerName: oldOrder.customerName,

        total: oldOrder.total,
      },

      newData: {
        id: order.id,

        customerName: order.customerName,

        total: order.total,
      },

      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return successResponse(
      "Order berhasil dihapus",

      order,
    );
  },
);
