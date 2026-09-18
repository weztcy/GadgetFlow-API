import bcrypt from "bcrypt";


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
    verifyResetToken,
    deleteResetToken
} from "@/services/password-reset.service";


import {
    prisma
} from "@/lib/prisma";





/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
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
 *               - token
 *               - password
 *
 *             properties:
 *
 *               token:
 *                 type: string
 *                 example: 9ff47332e345e26772ebdd13771fb4449588f926a8631a8f54e2ddf82f1862ed
 *
 *               password:
 *                 type: string
 *                 example: passwordbaru123
 *
 *
 *     responses:
 *
 *       200:
 *         description: Password berhasil direset
 *
 *       400:
 *         description: Token dan password wajib diisi
 *
 *       401:
 *         description: Token reset password tidak valid atau expired
 */
export async function POST(
    request:Request
){

    try {


        const body =
            await request.json();



        const {
            token,
            password
        } = body;





        if(
            !token ||
            !password
        ){

            throw new ApiError(
                "Token dan password wajib diisi",
                400
            );

        }






        const resetToken =
            await verifyResetToken(
                token
            );






        if(!resetToken){

            throw new ApiError(
                "Token reset password tidak valid atau expired",
                401
            );

        }







        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );






        await prisma.user.update({

            where:{
                id:resetToken.userId
            },

            data:{
                password:hashedPassword
            }

        });







        await deleteResetToken(
            token
        );







        return successResponse(
            "Password berhasil direset",
            null
        );





    }catch(error){

        return handleApiError(error);

    }

}