import { WorkspaceType } from "@/app/generated/prisma/enums";
import { z } from "zod";

export const workspaceInfoSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name must be less than 50 characters"),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  isPrivate: z.boolean(),
});
export type WorkspaceInfoSchema = z.infer<typeof workspaceInfoSchema>;

export const inviteEmailsSchema = z.object({
  emails: z.array(z.string().email("Invalid email")).optional(),
});

const workspaceTypeSchema = z.object({
  type: z.nativeEnum(WorkspaceType),
});
export type InviteEmailsSchema = z.infer<typeof inviteEmailsSchema>;

export const createWorkspaceSchema = workspaceInfoSchema
  .merge(inviteEmailsSchema)
  .merge(workspaceTypeSchema); 

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
