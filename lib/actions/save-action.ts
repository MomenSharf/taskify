import { AppError } from "../errors/app-error";

export async function safeAction<T>(fn: () => Promise<T>) {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err) {
    const error = AppError.from(err);
    return { data: null, error: { ...error } };
  }
}
