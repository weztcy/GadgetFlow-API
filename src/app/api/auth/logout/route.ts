import {
    NextRequest
} from "next/server";


import {
    prisma
} from "@/lib/prisma";


import {
    successResponse
} from "@/lib/api-response";


import {
    ApiError
} from "@/lib/api-error";


import {
    handleApiError
} from "@/lib/error-handler";







/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags:
 *       - Authentication
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
 *               - refreshToken
 *
 *             properties:
 *
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIs...
 *
 *
 *     responses:
 *
 *       200:
 *         description: Logout berhasil
 *
 *       400:
 *         description: Refresh token wajib diisi
 *
 *       404:
 *         description: Refresh token tidak ditemukan
 */
export async function POST(
    request:NextRequest
){

    try {


        const body =
            await request.json();





        const {
            refreshToken
        } =
        body;







        if(!refreshToken){

            throw new ApiError(
                "Refresh token wajib diisi",
                400
            );

        }








        const token =
            await prisma.refreshToken.findUnique({

                where:{

                    token:refreshToken

                }

            });








        if(!token){

            throw new ApiError(
                "Refresh token tidak ditemukan",
                404
            );

        }








        await prisma.refreshToken.delete({

            where:{

                id:token.id

            }

        });








        return successResponse(

            "Logout berhasil",

            null

        );





    }catch(error){


        return handleApiError(error);


    }

}