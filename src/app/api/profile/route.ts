import {
    NextRequest
} from "next/server";


import {
    successResponse,
    errorResponse
} from "@/lib/api-response";


import {
    authenticate
} from "@/middleware/auth.middleware";


import {
    getUserById
} from "@/services/user.service";





/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get current user profile
 *
 *     tags:
 *       - Authentication
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Profile berhasil diakses
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Profile berhasil diakses
 *               data:
 *                 id: 1
 *                 name: Budi Admin
 *                 email: budi@gmail.com
 *                 createdAt: 2026-09-17T02:44:32.691Z
 *
 *       401:
 *         description: Unauthorized - Token tidak valid atau tidak ditemukan
 *
 *       404:
 *         description: User tidak ditemukan
 *
 *       500:
 *         description: Internal server error
 */
export async function GET(
    request:NextRequest
){

    try {


        const payload =
            authenticate(request);





        if(!payload){


            return errorResponse(
                "Unauthorized",
                401
            );

        }






        const user =
            await getUserById(
                Number(payload.id)
            );






        if(!user){


            return errorResponse(
                "User tidak ditemukan",
                404
            );

        }







        return successResponse(

            "Profile berhasil diakses",

            user

        );




    }catch(error){


        return errorResponse(
            "Gagal mengambil profile",
            500
        );


    }

}