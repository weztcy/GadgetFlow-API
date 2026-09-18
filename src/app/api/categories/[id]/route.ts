import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/services/category.service";

import { createAuditLog } from "@/services/audit.service";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { categorySchema } from "@/validators/category.schema";

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category detail
 *     tags:
 *       - Categories
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *
 *     responses:
 *
 *       200:
 *         description: Category ditemukan
 *
 *       400:
 *         description: ID category tidak valid
 *
 *       404:
 *         description: Category tidak ditemukan
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
    const { id } = await context.params;

    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      throw new ApiError("ID category tidak valid", 400, "INVALID_CATEGORY_ID");
    }

    const category = await getCategoryById(categoryId);

    if (!category) {
      throw new ApiError("Category tidak ditemukan", 404, "CATEGORY_NOT_FOUND");
    }

    return successResponse("Berhasil mengambil detail category", category);
  },
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags:
 *       - Categories
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
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
 *               - name
 *
 *             properties:
 *
 *               name:
 *                 type: string
 *                 example: Elektronik Updated
 *
 *
 *     responses:
 *
 *       200:
 *         description: Category berhasil diupdate
 *
 *       400:
 *         description: ID category atau data category tidak valid
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Category tidak ditemukan
 *
 *       500:
 *         description: Internal server error
 */
export const PUT = asyncHandler(
  async (
    request: NextRequest,

    context: {
      params: Promise<{ id: string }>;
    },
  ) => {
    const payload = authenticate(request);

    requireRole(payload, ["ADMIN"]);

    const { id } = await context.params;

    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      throw new ApiError("ID category tidak valid", 400, "INVALID_CATEGORY_ID");
    }

    const oldCategory = await getCategoryById(categoryId);

    if (!oldCategory) {
      throw new ApiError("Category tidak ditemukan", 404, "CATEGORY_NOT_FOUND");
    }

    const body = await request.json();

    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
      throw validation.error;
    }

    const category = await updateCategory(categoryId, validation.data);

    await createAuditLog({
      userId: payload?.id,

      action: "UPDATE",

      entity: "Category",

      entityId: categoryId,

      oldData: {
        id: oldCategory.id,

        name: oldCategory.name,
      },

      newData: {
        id: category.id,

        name: category.name,
      },

      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return successResponse("Category berhasil diupdate", category);
  },
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags:
 *       - Categories
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *
 *
 *     responses:
 *
 *       200:
 *         description: Category berhasil dihapus
 *
 *       400:
 *         description: ID category tidak valid
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Category tidak ditemukan
 *
 *       409:
 *         description: Category masih digunakan product
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

    requireRole(payload, ["ADMIN"]);

    const { id } = await context.params;

    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      throw new ApiError("ID category tidak valid", 400, "INVALID_CATEGORY_ID");
    }

    const oldCategory = await getCategoryById(categoryId);

    if (!oldCategory) {
      throw new ApiError("Category tidak ditemukan", 404, "CATEGORY_NOT_FOUND");
    }

    const category = await deleteCategory(categoryId);

    await createAuditLog({
      userId: payload?.id,

      action: "DELETE",

      entity: "Category",

      entityId: categoryId,

      oldData: {
        id: oldCategory.id,

        name: oldCategory.name,
      },

      newData: {
        id: category.id,

        name: category.name,
      },

      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return successResponse("Category berhasil dihapus", category);
  },
);
