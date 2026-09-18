import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { asyncHandler } from "@/lib/async-handler";

import { productSchema } from "@/validators/product.schema";

import { getProducts, createProduct } from "@/services/product.service";

import { createAuditLog } from "@/services/audit.service";

import { authenticate } from "@/middleware/auth.middleware";

import { requireRole } from "@/middleware/role.middleware";

import { uploadProductImage } from "@/services/upload.service";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *
 *     parameters:
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Laptop
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: price_asc
 *
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *           example: 1000000
 *
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *           example: 20000000
 *
 *
 *     responses:
 *
 *       200:
 *         description: Berhasil mengambil data product
 *
 *       400:
 *         description: Parameter tidak valid
 *
 *       500:
 *         description: Internal server error
 */
export const GET = asyncHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page")) || 1;

  const limit = Number(searchParams.get("limit")) || 10;

  const search = searchParams.get("search") || undefined;

  const sort = searchParams.get("sort") || undefined;

  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;

  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;

  if (page < 1) {
    throw new ApiError("Page harus lebih dari 0", 400, "INVALID_PAGE");
  }

  if (limit < 1 || limit > 100) {
    throw new ApiError("Limit harus antara 1 sampai 100", 400, "INVALID_LIMIT");
  }

  const products = await getProducts(
    page,

    limit,

    search,

    sort,

    minPrice,

    maxPrice,
  );

  return successResponse(
    "Berhasil mengambil data product",

    products,
  );
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create new product with image
 *
 *     tags:
 *       - Products
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         multipart/form-data:
 *
 *           schema:
 *             type: object
 *
 *             required:
 *               - name
 *               - price
 *
 *             properties:
 *
 *               name:
 *                 type: string
 *                 example: Laptop
 *
 *               price:
 *                 type: integer
 *                 example: 15000000
 *
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *
 *               image:
 *                 type: string
 *                 format: binary
 *
 *
 *     responses:
 *
 *       200:
 *         description: Product berhasil dibuat
 *
 *       400:
 *         description: Data product tidak valid
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 */
export const POST = asyncHandler(async (request: NextRequest) => {
  const payload = authenticate(request);

  if (!payload) {
    throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  requireRole(payload, ["ADMIN"]);

  const formData = await request.formData();

  const nameValue = formData.get("name");

  const name = typeof nameValue === "string" ? nameValue : undefined;

  const priceValue = formData.get("price");

  const price = typeof priceValue === "string" ? Number(priceValue) : undefined;

  const categoryIdValue = formData.get("categoryId");

  const categoryId =
    typeof categoryIdValue === "string" ? Number(categoryIdValue) : undefined;

  let image: string | undefined;

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

  const product = await createProduct(validation.data);

  await createAuditLog({
    userId: payload.id,

    action: "CREATE",

    entity: "Product",

    entityId: product.id,

    newData: {
      id: product.id,

      name: product.name,

      price: product.price,

      categoryId: product.categoryId,

      image: product.image,
    },

    ipAddress: request.headers.get("x-forwarded-for") ?? undefined,

    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  return successResponse(
    "Product berhasil dibuat",

    product,
  );
});
