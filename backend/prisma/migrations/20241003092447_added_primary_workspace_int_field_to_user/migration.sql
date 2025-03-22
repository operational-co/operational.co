/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `WorkspaceUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `primaryWorkspace` INTEGER NULL;

-- AlterTable
ALTER TABLE `WorkspaceUser` DROP COLUMN `updatedAt`;
