import {
    ApiError
} from "@/lib/api-error";



export function requireRole(
    payload:any,
    roles:string[]
){

    if(!payload){

        throw new ApiError(
            "Unauthorized",
            401
        );

    }



    if(
        !roles.includes(
            payload.role
        )
    ){

        throw new ApiError(
            "Forbidden",
            403
        );

    }



    return true;

}