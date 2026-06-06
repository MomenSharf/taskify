-- CreateEnum
CREATE TYPE "WorkspaceType" AS ENUM ('PERSONAL', 'COMPANY', 'SCHOOL', 'PROJECT');

-- CreateEnum
CREATE TYPE "WorkspaceVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "description" TEXT,
ADD COLUMN     "type" "WorkspaceType" NOT NULL DEFAULT 'PERSONAL',
ADD COLUMN     "visibility" "WorkspaceVisibility" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "WorkspaceSetting" ADD COLUMN     "allowInvites" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "defaultRoleId" TEXT,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxMembers" INTEGER,
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'system';

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "alt" TEXT,
    "size" INTEGER,
    "mimeType" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_key_key" ON "Image"("key");

-- CreateIndex
CREATE INDEX "Image_entityType_entityId_idx" ON "Image"("entityType", "entityId");
