import { NextRequest } from "next/server";

import { handleApiError } from "@/lib/error-handler";

type RouteHandler = (request: NextRequest, context?: any) => Promise<Response>;

export function asyncHandler(handler: RouteHandler) {
  return async (request: NextRequest, context?: any): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
