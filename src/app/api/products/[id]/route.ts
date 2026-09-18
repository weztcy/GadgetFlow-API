import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import { productSchema } from "@/validators/product.schema";

import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/services/product.service";

import { createAuditLog } from "@/services/audit.service";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { uploadProductImage } from "@/services/upload.service";

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product detail
 *     tags:
 *       - Products
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Product ditemukan
 *
 *       400:
 *         description: ID product tidak valid
 *
 *       404:
 *         description: Product tidak ditemukan
 */
export const GET = asyncHandler(
  async (
    request: Request,
    context: {
      params: Promise<{ id: string }>;
    },
  ) => {
    const { id } = await context.params;

    const productId = Number(id);

    if (isNaN(productId)) {
      throw new ApiError("ID product tidak valid", 400, "INVALID_PRODUCT_ID");
    }

    const product = await getProductById(productId);

    if (!product) {
      throw new ApiError("Product tidak ditemukan", 404, "PRODUCT_NOT_FOUND");
    }

    return successResponse("Product ditemukan", product);
  },
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags:
 *       - Products
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop Gaming
 *
 *               price:
 *                 type: integer
 *                 example: 20000000
 *
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *
 *               image:
 *                 type: string
 *                 format: binary
 *
*        responses:
 *
 *       200:
 *         description: Product berhasil diupdate
 *
 *       400:
 *         description: ID product tidak valid
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Product tidak ditemukan
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

    const productId = Number(id);

    if (isNaN(productId)) {
      throw new ApiError("ID product tidak valid", 400, "INVALID_PRODUCT_ID");
    }

    const oldProduct = await getProductById(productId);

    if (!oldProduct) {
      throw new ApiError("Product tidak ditemukan", 404, "PRODUCT_NOT_FOUND");
    }

    const formData = await request.formData();

    const name = formData.get("name") as string;

    const price = Number(formData.get("price"));

    const categoryIdValue = formData.get("categoryId");

    const categoryId = categoryIdValue ? Number(categoryIdValue) : undefined;

    let image = oldProduct.image;

    const file = formData.get("image");

    if (file && file instanceof File && file.size > 0) {
      image = await uploadProductImage(file);
    }

    const validation = productSchema.safeParse({
      name,

      price,

      categoryId,

      image,
    });

    if (!validation.success) {
      throw validation.error;
    }

    const product = await updateProduct(
      productId,

      validation.data,
    );

    await createAuditLog({
      action: "UPDATE",

      entity: "Product",

      entityId: productId,

      oldData: oldProduct,

      newData: product,
    });

    return successResponse(
      "Product berhasil diupdate",

      product,
    );
  },
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (Soft Delete)
 *     tags:
 *       - Products
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Product berhasil dihapus
 *
 *       400:
 *         description: ID product tidak valid
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Product tidak ditemukan
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

    const productId = Number(id);

    if (isNaN(productId)) {
      throw new ApiError("ID product tidak valid", 400, "INVALID_PRODUCT_ID");
    }

    const oldProduct = await getProductById(productId);

    if (!oldProduct) {
      throw new ApiError("Product tidak ditemukan", 404, "PRODUCT_NOT_FOUND");
    }

    const product = await deleteProduct(productId);

    await createAuditLog({
      userId: Number(payload.id),

      action: "DELETE",

      entity: "Product",

      entityId: productId,

      oldData: oldProduct,

      newData: product,
    });

    return successResponse(
      "Product berhasil dihapus",

      product,
    );
  },
);
