/*
  Warnings:

  - You are about to drop the column `projectId` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Log` DROP COLUMN `projectId`,
    DROP COLUMN `userId`,
    ADD COLUMN `workspaceId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
