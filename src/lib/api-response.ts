import { NextResponse } from "next/server";

export interface SuccessResponse<T> {
  success: boolean;

  message: string;

  data: T;
}

export interface ErrorResponse {
  success: boolean;

  message: string;

  code: string;

  errors: unknown | null;
}

export function successResponse<T>(
  message: string,

  data: T,

  status: number = 200,
) {
  const response: SuccessResponse<T> = {
    success: true,

    message,

    data,
  };

  return NextResponse.json(
    response,

    {
      status,
    },
  );
}

export function errorResponse(
  message: string,

  status: number = 400,

  code: string = "ERROR",

  errors?: unknown,
) {
  const response: ErrorResponse = {
    success: false,

    message,

    code,

    errors: errors ?? null,
  };

  return NextResponse.json(
    response,

    {
      status,
    },
  );
}
