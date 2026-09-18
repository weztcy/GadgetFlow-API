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
    getUserByEmail
} from "@/services/user.service";


import {
    generateAccessToken,
    generateRefreshToken
} from "@/services/token.service";







/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login with refresh token
 *
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
 *               - password
 *
 *             properties:
 *
 *               email:
 *                 type: string
 *                 example: budi@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: password123
 *
 *
 *     responses:
 *
 *       200:
 *         description: Login berhasil
 *
 *       401:
 *         description: Email atau password salah
 */
export async function POST(
    request:Request
){

    try {


        const body =
            await request.json();





        const {
            email,
            password
        } =
        body;







        if(
            !email ||
            !password
        ){

            throw new ApiError(
                "Email dan password wajib diisi",
                400
            );

        }








        const user =
            await getUserByEmail(
                email
            );








        if(!user){

            throw new ApiError(
                "Email atau password salah",
                401
            );

        }









        const passwordMatch =
            await bcrypt.compare(

                password,

                user.password

            );








        if(!passwordMatch){


            throw new ApiError(
                "Email atau password salah",
                401
            );

        }








        const accessToken =
            generateAccessToken({

                id:user.id,

                email:user.email,

                role:user.role

            });








        const refreshToken =
            await generateRefreshToken(

                user.id

            );









        return successResponse(

            "Login berhasil",

            {


                accessToken,


                refreshToken,



                user:{


                    id:user.id,


                    name:user.name,


                    email:user.email,


                    role:user.role


                }


            }

        );





    }catch(error){


        return handleApiError(error);


    }

}