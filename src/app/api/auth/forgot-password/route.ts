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
    getUserByEmail
} from "@/services/user.service";


import {
    generateResetToken
} from "@/services/password-reset.service";


import {
    sendResetPasswordEmail
} from "@/services/email.service";




/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset link
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
 *               - email
 *
 *             properties:
 *
 *               email:
 *                 type: string
 *                 example: budi@gmail.com
 *
 *
 *     responses:
 *
 *       200:
 *         description: Link reset password telah dikirim
 *
 *       400:
 *         description: Email wajib diisi
 *
 *       404:
 *         description: Email tidak ditemukan
 */
export async function POST(
    request:Request
){

    try {


        const body =
            await request.json();





        const {
            email
        } =
        body;






        if(!email){

            throw new ApiError(
                "Email wajib diisi",
                400
            );

        }








        const user =
            await getUserByEmail(
                email
            );








        if(!user){

            throw new ApiError(
                "Email tidak ditemukan",
                404
            );

        }








        const token =
            await generateResetToken(

                user.id

            );








        await sendResetPasswordEmail({

            name:user.name,

            email:user.email,

            token

        });








        return successResponse(

            "Link reset password telah dikirim",

            null

        );





    }catch(error){


        return handleApiError(error);


    }

}