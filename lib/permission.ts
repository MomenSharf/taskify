import db from "./db"

export async function hasPermission(
  userId: string,
  workspaceId: string,
  permissionKey: string
) {
  const result = await db.workspaceMember.findFirst({
    where: {
      userId,
      workspaceId,
      role: {
        permissions: {
          some: {
            permission: {
              key: permissionKey
            }
          }
        }
      }
    },
    select: {
      id: true
    }
  })

  return !!result
}

export async function requirePermission(
  userId: string,
  workspaceId: string,
  permissionKey: string
) {
  const allowed = await hasPermission(userId, workspaceId, permissionKey)

  if (!allowed) {
    throw new Error("Forbidden")
  }
}

export function withPermission(permissionKey: string, handler: Function) {
  return async (userId: string, workspaceId: string, ...args: any[]) => {
    const allowed = await hasPermission(userId, workspaceId, permissionKey)

    if (!allowed) throw new Error("Forbidden")

    return handler(userId, workspaceId, ...args)
  }
}