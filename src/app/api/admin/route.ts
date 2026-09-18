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
    requireRole
} from "@/middleware/role.middleware";



/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Admin protected endpoint
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
 *         description: Selamat datang Admin
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       500:
 *         description: Internal server error
 */
export async function GET(
    request:NextRequest
){


    const user =
        authenticate(request);



    if(!user){

        return errorResponse(
            "Unauthorized",
            401
        );

    }



    requireRole(
        user,
        [
            "ADMIN"
        ]
    );



    return successResponse(
        "Selamat datang Admin",
        user
    );


}