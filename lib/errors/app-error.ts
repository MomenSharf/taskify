export type AppErrorCode =
  | "INTERNAL_ERROR"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BAD_REQUEST";

type AppErrorMeta = Record<string, unknown> | undefined;

export class AppError extends Error {
  statusCode: number;
  code: AppErrorCode;
  isOperational: boolean;
  meta?: AppErrorMeta;

  constructor(
    message: string,
    statusCode = 500,
    code: AppErrorCode = "INTERNAL_ERROR",
    meta?: AppErrorMeta,
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
      return new AppError(
        "Something went wrong. Please try again later.",
        500,
        "INTERNAL_ERROR",
        {
          name: error.name,
          message: error.message,
        },
      );
    }

    return new AppError(
      "Something went wrong. Please try again later.",
      500,
      "INTERNAL_ERROR",
    );
  }
}


