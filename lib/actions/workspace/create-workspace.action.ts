'use server'

import { workspaceService } from "@/lib/services/workspace.service";
import { tryCatchAsync } from "@/lib/utils/try-catch";
import { CreateWorkspaceSchema } from "@/lib/validations/workspace";

export const createWorkspace = async (data: CreateWorkspaceSchema) =>
  tryCatchAsync(async () => {
    const { workspace } = await workspaceService.crateWorkspace(data);

    return {
      message: "Workspace created successfully",
      workspace,
    };
  });
