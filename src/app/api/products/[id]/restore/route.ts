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
    authenticate
} from "@/middleware/auth.middleware";


import {
    requireRole
} from "@/middleware/role.middleware";





export async function PATCH(
    request:NextRequest,
    context:{
        params:Promise<{id:string}>
    }
){


    const payload =
        authenticate(request);



    requireRole(
        payload,
        [
            "ADMIN"
        ]
    );



    const {id} =
        await context.params;



    const product =
        await prisma.product.update({

            where:{
                id:Number(id)
            },


            data:{

                deletedAt:null

            }

        });



    return successResponse(
        "Product berhasil direstore",
        product
    );

}