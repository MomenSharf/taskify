import prisma from "@/lib/db/prisma";
import { getRandomAvatarColor } from "@/lib/utils";
import { nanoid } from "nanoid";

export const userService = {
  async getUserByEmail(email: string) {
   return prisma.user.findUnique({
    where: { email },
  });
  },
  async initializeUser(userId: string, email?: string | null) {
    if (!email) return;

    return prisma.user.update({
      where: { id: userId },
      data: {
        avatarColor: getRandomAvatarColor(),
        username: `${email.split("@")[0]}-${nanoid(5)}`,
      },
    });
  },
};
