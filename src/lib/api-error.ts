export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string = "API_ERROR") {
    super(message);

    this.name = "ApiError";

    this.statusCode = statusCode;

    this.code = code;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
