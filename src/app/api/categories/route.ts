import {
    NextRequest
} from "next/server";


import {
    successResponse
} from "@/lib/api-response";


import {
    ApiError
} from "@/lib/api-error";


import {
    asyncHandler
} from "@/lib/async-handler";


import {
    categorySchema
} from "@/validators/category.schema";


import {
    getCategories,
    createCategory
} from "@/services/category.service";


import {
    authenticate
} from "@/middleware/auth.middleware";


import {
    requireRole
} from "@/middleware/role.middleware";





/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *
 *     tags:
 *       - Categories
 *
 *     responses:
 *
 *       200:
 *         description: Berhasil mengambil data category
 *
 *       500:
 *         description: Internal server error
 */
export const GET = asyncHandler(
async()=>{


    const categories =
        await getCategories();



    return successResponse(

        "Berhasil mengambil data category",

        categories

    );


});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create new category
 *
 *     tags:
 *       - Categories
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
 *               - name
 *
 *             properties:
 *
 *               name:
 *                 type: string
 *                 example: Elektronik
 *
 *
 *     responses:
 *
 *       200:
 *         description: Category berhasil dibuat
 *
 *       400:
 *         description: Data category tidak valid
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       500:
 *         description: Internal server error
 */
export const POST = asyncHandler(
async(
    request:NextRequest
)=>{


    const payload =
        authenticate(request);



    requireRole(

        payload,

        [
            "ADMIN"
        ]

    );





    const body =
        await request.json();





    const validation =
        categorySchema.safeParse(
            body
        );





    if(!validation.success){


        throw new ApiError(

            "Data category tidak valid",

            400,

            "INVALID_CATEGORY_DATA"

        );

    }







    const category =
        await createCategory(

            validation.data

        );







    return successResponse(

        "Category berhasil dibuat",

        category

    );


});