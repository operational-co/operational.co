/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `Workspace` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_workspaceId_fkey`;

-- DropForeignKey
ALTER TABLE `Workspace` DROP FOREIGN KEY `Workspace_adminId_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `workspaceId`;

-- AlterTable
ALTER TABLE `Workspace` DROP COLUMN `adminId`;

-- CreateTable
CREATE TABLE `WorkspaceUser` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('MEMBER', 'ADMIN') NOT NULL DEFAULT 'MEMBER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `workspaceId` INTEGER NOT NULL,

    INDEX `WorkspaceUser_workspaceId_idx`(`workspaceId`),
    UNIQUE INDEX `WorkspaceUser_userId_workspaceId_key`(`userId`, `workspaceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkspaceUser` ADD CONSTRAINT `WorkspaceUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkspaceUser` ADD CONSTRAINT `WorkspaceUser_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
