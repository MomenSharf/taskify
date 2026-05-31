export const PERMISSIONS = [
  "workspace.read",
  "workspace.update",
  "workspace.delete",
  "workspace.manage_settings",

  "member.view",
  "member.invite",
  "member.remove",
  "member.update_role",

  "team.create",
  "team.update",
  "team.delete",
  "team.manage_members",

  "space.create",
  "space.update",
  "space.delete",
  "space.view",

  "task.create",
  "task.update",
  "task.delete",
  "task.view",
  "task.assign",
  "task.comment",
  "task.move",

  "tag.create",
  "tag.update",
  "tag.delete",
  "tag.view",

  "invite.create",
  "invite.cancel",
  "invite.resend",
  "invite.view",

  "audit.view",
  "audit.export"
] as const

export type Permission = typeof PERMISSIONS[number]