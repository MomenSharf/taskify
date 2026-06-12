import { AppError } from "./app-error";

export const AppErrors = {
  badRequest: (message = "Bad Request", meta?: Record<string, unknown>) =>
    new AppError(message, 400, "BAD_REQUEST", meta),

  validation: (message = "Validation Error", meta?: Record<string, unknown>) =>
    new AppError(message, 400, "VALIDATION_ERROR", meta),

  unauthorized: (message = "Unauthorized", meta?: Record<string, unknown>) =>
    new AppError(message, 401, "UNAUTHORIZED", meta),

  forbidden: (message = "Forbidden", meta?: Record<string, unknown>) =>
    new AppError(message, 403, "FORBIDDEN", meta),

  notFound: (message = "Not Found", meta?: Record<string, unknown>) =>
    new AppError(message, 404, "NOT_FOUND", meta),

  conflict: (message = "Conflict", meta?: Record<string, unknown>) =>
    new AppError(message, 409, "CONFLICT", meta),

  internal: (
    message = "Internal Server Error",
    meta?: Record<string, unknown>,
  ) => new AppError(message, 500, "INTERNAL_ERROR", meta),
};