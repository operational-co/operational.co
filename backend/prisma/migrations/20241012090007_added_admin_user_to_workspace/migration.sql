/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Workspace` ADD COLUMN `adminId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Workspace_adminId_key` ON `Workspace`(`adminId`);

-- AddForeignKey
ALTER TABLE `Workspace` ADD CONSTRAINT `Workspace_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
