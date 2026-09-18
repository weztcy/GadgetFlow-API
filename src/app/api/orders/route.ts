import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

import { ApiError } from "@/lib/api-error";

import { handleApiError } from "@/lib/error-handler";

import {
    createOrder,
    getOrders
} from "@/services/order.service";

import {
    createAuditLog
} from "@/services/audit.service";

import {
    authenticate
} from "@/middleware/auth.middleware";



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
export async function GET(
    request: NextRequest
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




        const orders =
            await getOrders();




        return successResponse(
            "Berhasil mengambil data order",
            orders
        );



    }catch(error){

        return handleApiError(error);

    }

}






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
export async function POST(
    request: NextRequest
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





        const body =
            await request.json();





        if(
            !body.customerName ||
            !body.items ||
            !Array.isArray(body.items)
        ){

            throw new ApiError(
                "Data order tidak valid",
                400
            );

        }





        if(
            body.items.length === 0
        ){

            throw new ApiError(
                "Order minimal memiliki 1 product",
                400
            );

        }







        const order =
            await createOrder(
                body
            );








        await createAuditLog({

            userId:
            Number(payload.id),


            action:
            "CREATE",


            entity:
            "Order",


            entityId:
            order.id,


            newData:
            order

        });







        return successResponse(
            "Order berhasil dibuat",
            order
        );



    }catch(error){

        return handleApiError(error);

    }

}