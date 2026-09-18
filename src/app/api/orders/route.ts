import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import { createOrder, getOrders } from "@/services/order.service";

import { createAuditLog } from "@/services/audit.service";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { orderSchema } from "@/validators/order.schema";

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Orders
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Berhasil mengambil data order
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */
export const GET = asyncHandler(async (request: NextRequest) => {
  const payload = authenticate(request);

  if (!payload) {
    throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  requireRole(payload, ["ADMIN"]);

  const orders = await getOrders();

  return successResponse(
    "Berhasil mengambil data order",

    orders,
  );
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create new order
 *     tags:
 *       - Orders
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - customerName
 *               - items
 *
 *             properties:
 *
 *               customerName:
 *                 type: string
 *                 example: Budi
 *
 *               items:
 *                 type: array
 *
 *                 example:
 *                   - productId: 1
 *                     quantity: 2
 *
 *                 items:
 *                   type: object
 *
 *                   properties:
 *
 *                     productId:
 *                       type: integer
 *                       example: 1
 *
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *
 *
 *     responses:
 *
 *       200:
 *         description: Order berhasil dibuat
 *
 *       400:
 *         description: Data order tidak valid
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */
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

  await createAuditLog({
    userId: payload.id,

    action: "CREATE",

    entity: "Order",

    entityId: order.id,

    newData: {
      id: order.id,

      customerName: order.customerName,

      total: order.total,
    },

    ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  return successResponse(
    "Order berhasil dibuat",

    order,
  );
});
