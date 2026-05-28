// lib/errors/handle-error.ts
import { AppError } from "./app-error";

export function handleError(error: unknown) {
  console.error("ERROR:", error);

  if (error instanceof AppError) {
    return Response.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.statusCode }
    );
  }

  return Response.json(
    {
      success: false,
      error: {
        message: "Internal Server Error",
        code: "INTERNAL_ERROR",
      },
    },
    { status: 500 }
  );
}