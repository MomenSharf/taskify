import { AppErrors } from "../errors/app-errors";
import { getCurrentUser } from "./auth-options";

// lib/auth/require-current-user.ts
export const  requireCurrentUser = async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw AppErrors.unauthorized("Unauthorized");
  }

  return user;
}
