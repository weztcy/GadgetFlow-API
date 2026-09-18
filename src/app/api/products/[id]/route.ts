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
    productSchema
} from "@/validators/product.schema";


import {
    getProductById,
    updateProduct,
    deleteProduct
} from "@/services/product.service";


import {
    createAuditLog
} from "@/services/audit.service";


import {
    authenticate
} from "@/middleware/auth.middleware";


import {
    requireRole
} from "@/middleware/role.middleware";


import {
    uploadProductImage
} from "@/services/upload.service";




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
export async function GET(
    request:Request,
    context:{
        params:Promise<{id:string}>
    }
){

    try {


        const {
            id
        } =
        await context.params;



        const productId =
            Number(id);




        if(isNaN(productId)){

            throw new ApiError(
                "ID product tidak valid",
                400
            );

        }




        const product =
            await getProductById(
                productId
            );




        if(!product){

            throw new ApiError(
                "Product tidak ditemukan",
                404
            );

        }




        return successResponse(
            "Product ditemukan",
            product
        );



    }catch(error){

        return handleApiError(error);

    }

}


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
 *     responses:
 *       200:
 *         description: Product berhasil diupdate
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
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




        const productId =
            Number(id);





        if(isNaN(productId)){

            throw new ApiError(
                "ID product tidak valid",
                400
            );

        }





        const oldProduct =
            await getProductById(
                productId
            );





        if(!oldProduct){

            throw new ApiError(
                "Product tidak ditemukan",
                404
            );

        }







        const formData =
            await request.formData();





        const name =
            formData.get("name") as string;



        const price =
            Number(
                formData.get("price")
            );



        const categoryIdValue =
            formData.get("categoryId");



        const categoryId =
            categoryIdValue
            ? Number(categoryIdValue)
            : undefined;






        let image =
            oldProduct.image;







        const file =
            formData.get("image");





        if(
            file &&
            file instanceof File &&
            file.size > 0
        ){

            image =
                await uploadProductImage(
                    file
                );

        }







        const validation =
            productSchema.safeParse({

                name,

                price,

                categoryId,

                image

            });






        if(!validation.success){

            throw new ApiError(
                "Data product tidak valid",
                400
            );

        }







        const product =
            await updateProduct(

                productId,

                validation.data

            );








        await createAuditLog({

            action:"UPDATE",

            entity:"Product",

            entityId:productId,

            oldData:oldProduct,

            newData:product

        });







        return successResponse(

            "Product berhasil diupdate",

            product

        );




    }catch(error){

        return handleApiError(error);

    }

}


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
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Product tidak ditemukan
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




        const productId =
            Number(id);





        if(isNaN(productId)){

            throw new ApiError(
                "ID product tidak valid",
                400
            );

        }





        const oldProduct =
            await getProductById(
                productId
            );





        if(!oldProduct){

            throw new ApiError(
                "Product tidak ditemukan",
                404
            );

        }






        const product =
            await deleteProduct(
                productId
            );







        await createAuditLog({

            action:"DELETE",

            entity:"Product",

            entityId:productId,

            oldData:oldProduct,

            newData:product

        });







        return successResponse(

            "Product berhasil dihapus",

            product

        );



    }catch(error){

        return handleApiError(error);

    }

}