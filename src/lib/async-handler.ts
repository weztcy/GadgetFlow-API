import {
    handleApiError
} from "@/lib/error-handler";



type RouteHandler = (
    request: Request,
    context?: any
) => Promise<Response>;



export function asyncHandler(
    handler: RouteHandler
){

    return async (
        request: Request,
        context?: any
    ): Promise<Response> => {

        try {

            return await handler(
                request,
                context
            );

        } catch(error){

            return handleApiError(error);

        }

    };

}