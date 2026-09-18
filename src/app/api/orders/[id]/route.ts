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
    getOrderById,
    deleteOrder
} from "@/services/order.service";


import {
    authenticate
} from "@/middleware/auth.middleware";


import {
    createAuditLog
} from "@/services/audit.service";





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
export async function GET(
    request:NextRequest,

    context:{
        params:Promise<{id:string}>
    }
){

    try {


        const payload =
            authenticate(request);



        if(!payload){

            throw new ApiError(
                "Unauthorized",
                401
            );

        }





        const {
            id
        } =
        await context.params;




        const orderId =
            Number(id);





        if(isNaN(orderId)){


            throw new ApiError(
                "ID order tidak valid",
                400
            );

        }





        const order =
            await getOrderById(
                orderId
            );





        if(!order){


            throw new ApiError(
                "Order tidak ditemukan",
                404
            );

        }





        return successResponse(

            "Order ditemukan",

            order

        );




    }catch(error){


        return handleApiError(error);


    }

}









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
export async function DELETE(
    request:NextRequest,

    context:{
        params:Promise<{id:string}>
    }
){

    try {


        const payload =
            authenticate(request);



        if(!payload){

            throw new ApiError(
                "Unauthorized",
                401
            );

        }






        const {
            id
        } =
        await context.params;





        const orderId =
            Number(id);





        if(isNaN(orderId)){


            throw new ApiError(
                "ID order tidak valid",
                400
            );

        }






        const oldOrder =
            await getOrderById(
                orderId
            );





        if(!oldOrder){


            throw new ApiError(
                "Order tidak ditemukan",
                404
            );

        }







        const order =
            await deleteOrder(
                orderId
            );








        await createAuditLog({


            action:"DELETE",


            entity:"Order",


            entityId:orderId,


            oldData:oldOrder,


            newData:order


        });







        return successResponse(

            "Order berhasil dihapus",

            order

        );





    }catch(error){


        return handleApiError(error);


    }

}