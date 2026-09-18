import bcrypt from "bcrypt";


import {
    successResponse
} from "@/lib/api-response";


import {
    ApiError
} from "@/lib/api-error";


import {
    asyncHandler
} from "@/lib/async-handler";


import {
    registerSchema
} from "@/validators/auth.schema";


import {
    createUser,
    getUserByEmail
} from "@/services/user.service";


import {
    sendWelcomeEmail
} from "@/services/email.service";





/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
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
 *               - name
 *               - email
 *               - password
 *
 *             properties:
 *
 *               name:
 *                 type: string
 *                 example: Budi Admin
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
 *         description: Register berhasil
 *
 *       400:
 *         description: Data tidak valid
 *
 *       409:
 *         description: Email sudah digunakan
 */
export const POST = asyncHandler(
async(
    request:Request
)=>{


    const body =
        await request.json();





    const validation =
        registerSchema.safeParse(
            body
        );





    if(!validation.success){


        throw new ApiError(

            "Data tidak valid",

            400,

            "INVALID_REGISTER_DATA"

        );

    }






    const {
        name,
        email,
        password
    } =
    validation.data;








    const existingUser =
        await getUserByEmail(
            email
        );







    if(existingUser){


        throw new ApiError(

            "Email sudah digunakan",

            409,

            "EMAIL_ALREADY_USED"

        );

    }








    const hashedPassword =
        await bcrypt.hash(

            password,

            10

        );










    const user =
        await createUser({


            name,


            email,


            password:
            hashedPassword


        });









    try {


        await sendWelcomeEmail({

            name:user.name,

            email:user.email

        });


    }catch(error){


        console.error(
            "Gagal mengirim email welcome:",
            error
        );


    }









    return successResponse(


        "Register berhasil",


        {


            id:user.id,


            name:user.name,


            email:user.email


        }


    );


});