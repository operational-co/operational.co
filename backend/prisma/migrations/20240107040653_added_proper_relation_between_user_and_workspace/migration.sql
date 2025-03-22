/*
  Warnings:

  - You are about to drop the column `userId` on the `Workspace` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[adminId]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Workspace` DROP FOREIGN KEY `Workspace_userId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `workspaceId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Workspace` DROP COLUMN `userId`,
    ADD COLUMN `adminId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Workspace_adminId_key` ON `Workspace`(`adminId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Workspace` ADD CONSTRAINT `Workspace_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
