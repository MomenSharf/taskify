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

  isPublic: z.boolean(),
});

export const inviteEmailsSchema = z.object({
  inviteEmails: z.array(z.string().email("Invalid email")).optional(),
});

export type InviteEmailsSchema = z.infer<typeof inviteEmailsSchema>;

export type WorkspaceInfoSchema = z.infer<typeof workspaceInfoSchema>;
