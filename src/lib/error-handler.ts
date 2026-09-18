import {
    Prisma
} from "@prisma/client";


import {
    errorResponse
} from "@/lib/api-response";


import {
    ApiError
} from "@/lib/api-error";




export function handleApiError(
    error: unknown
){

    console.error(error);



    // Custom API Error

    if(error instanceof ApiError){

        return errorResponse(
            error.message,
            error.statusCode
        );

    }





    // Prisma Error

    if(
        error instanceof Prisma.PrismaClientKnownRequestError
    ){


        // Foreign key constraint

        if(error.code === "P2003"){

            return errorResponse(
                "Data masih digunakan oleh data lain",
                409
            );

        }




        // Record not found

        if(error.code === "P2025"){

            return errorResponse(
                "Data tidak ditemukan",
                404
            );

        }


    }





    return errorResponse(
        "Internal Server Error",
        500
    );

}