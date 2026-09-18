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
    getProducts,
    createProduct
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






export async function GET(
    request:Request
){

    try {


        const {
            searchParams
        } =
        new URL(
            request.url
        );



        const page =
            Number(
                searchParams.get("page")
            ) || 1;



        const limit =
            Number(
                searchParams.get("limit")
            ) || 10;



        const search =
            searchParams.get("search")
            || undefined;



        const sort =
            searchParams.get("sort")
            || undefined;



        const minPrice =
            searchParams.get("minPrice")
            ? Number(searchParams.get("minPrice"))
            : undefined;



        const maxPrice =
            searchParams.get("maxPrice")
            ? Number(searchParams.get("maxPrice"))
            : undefined;





        if(page < 1){

            throw new ApiError(
                "Page harus lebih dari 0",
                400
            );

        }





        if(limit < 1 || limit > 100){

            throw new ApiError(
                "Limit harus antara 1 sampai 100",
                400
            );

        }






        const products =
            await getProducts(

                page,

                limit,

                search,

                sort,

                minPrice,

                maxPrice

            );





        return successResponse(

            "Berhasil mengambil data product",

            products

        );



    }catch(error){


        return handleApiError(error);


    }

}









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
 *       201:
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
export async function POST(
    request:NextRequest
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






        let image:string | undefined;





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
            await createProduct(

                validation.data

            );







        await createAuditLog({

            action:"CREATE",

            entity:"Product",

            entityId:product.id,

            newData:product

        });







        return successResponse(

            "Product berhasil dibuat",

            product

        );




    }catch(error){


        return handleApiError(error);


    }

}