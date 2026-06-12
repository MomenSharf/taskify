import slugify from "slugify";
import { requireCurrentUser } from "../auth/require-current-user";
import prisma from "../db/prisma";
import { CreateWorkspaceSchema } from "../validations/workspace";

export const workspaceService = {
  async crateWorkspace(data: CreateWorkspaceSchema) {
    const user = await requireCurrentUser();

    const { isPrivate, emails, ...res } = data;

    const baseSlug = slugify(res.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const workspace = await prisma.workspace.create({
      data: {
        ownerId: user.id,
        slug: baseSlug,
        visibility: isPrivate ? "PRIVATE" : "PUBLIC",
        ...res,
      },
    });

    return {
      workspace,
    };
  },
};
