import { NextResponse } from "next/server";

export interface SuccessResponse<T> {
  readonly success: boolean;

  readonly message: string;

  readonly data: T;
}

export interface ErrorResponse {
  readonly success: boolean;

  readonly message: string;

  readonly code: string;

  readonly errors: unknown | null;
}

export function successResponse<T>(
  message: string,

  data: T,

  status: number = 200,
): NextResponse<SuccessResponse<T>> {
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
): NextResponse<ErrorResponse> {
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
