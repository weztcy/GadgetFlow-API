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
    handleApiError
} from "@/lib/error-handler";


import {
    getCategoryById,
    updateCategory,
    deleteCategory
} from "@/services/category.service";


import {
    authenticate
} from "@/middleware/auth.middleware";


import {
    requireRole
} from "@/middleware/role.middleware";





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
export async function GET(
    request:Request,
    context:{
        params: Promise<{id:string}>
    }
){

    try {


        const {
            id
        } =
        await context.params;



        const categoryId =
            Number(id);




        if(isNaN(categoryId)){


            throw new ApiError(
                "ID category tidak valid",
                400
            );

        }




        const category =
            await getCategoryById(
                categoryId
            );





        if(!category){


            throw new ApiError(
                "Category tidak ditemukan",
                404
            );

        }






        return successResponse(

            "Berhasil mengambil detail category",

            category

        );




    }catch(error){


        return handleApiError(error);


    }

}



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
export async function PUT(
    request:NextRequest,
    context:{
        params:Promise<{id:string}>
    }
){

    try {


        const payload =
            authenticate(request);



        requireRole(
            payload,
            [
                "ADMIN"
            ]
        );




        const {
            id
        } =
        await context.params;




        const categoryId =
            Number(id);




        if(isNaN(categoryId)){


            throw new ApiError(
                "ID category tidak valid",
                400
            );

        }




        const body =
            await request.json();





        const category =
            await updateCategory(

                categoryId,

                body

            );





        return successResponse(

            "Category berhasil diupdate",

            category

        );




    }catch(error){


        return handleApiError(error);


    }

}









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
 *       409:
 *         description: Category masih digunakan product
 *
 *       500:
 *         description: Internal server error
 */
export async function DELETE(
    request:NextRequest,
    context:{
        params:Promise<{id:string}>
    }
){

    try {


        const payload =
            authenticate(request);



        requireRole(
            payload,
            [
                "ADMIN"
            ]
        );





        const {
            id
        } =
        await context.params;




        const categoryId =
            Number(id);





        if(isNaN(categoryId)){


            throw new ApiError(
                "ID category tidak valid",
                400
            );

        }





        const category =
            await deleteCategory(
                categoryId
            );





        return successResponse(

            "Category berhasil dihapus",

            category

        );




    }catch(error){


        return handleApiError(error);


    }

}