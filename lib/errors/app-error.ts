export type AppErrorCode =
  | "INTERNAL_ERROR"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BAD_REQUEST";

export class AppError extends Error {
  statusCode: number;
  code: AppErrorCode;
  isOperational: boolean;
  meta?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code: AppErrorCode = "INTERNAL_ERROR",
    meta?: unknown,
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.meta = meta;

    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      meta: this.meta,
    };
  }

  static from(error: unknown): AppError {
    if (error instanceof AppError) return error;

    if (error instanceof Error) {
      return new AppError(error.message, 500, "INTERNAL_ERROR", {
        name: error.name,
        stack: error.stack,
      });
    }

    return new AppError("Unknown error occurred", 500, "INTERNAL_ERROR", error);
  }
}
export const badRequest = (message = "Bad Request") =>
  new AppError(message, 400, "BAD_REQUEST");

export const validationError = (message = "Validation Error") =>
  new AppError(message, 400, "VALIDATION_ERROR");

export const unauthorized = (message = "Unauthorized") =>
  new AppError(message, 401, "UNAUTHORIZED");

export const forbidden = (message = "Forbidden") =>
  new AppError(message, 403, "FORBIDDEN");

export const notFound = (message = "Not Found") =>
  new AppError(message, 404, "NOT_FOUND");

export const conflict = (message = "Conflict") =>
  new AppError(message, 409, "CONFLICT");

export const internalError = (message = "Internal Server Error") =>
  new AppError(message, 500, "INTERNAL_ERROR");
