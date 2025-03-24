/*
  Warnings:

  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Log` DROP FOREIGN KEY `Log_workspaceId_fkey`;

-- DropTable
DROP TABLE `Log`;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workspaceId` INTEGER NULL,
    `userId` INTEGER NULL,
    `avatar` VARCHAR(191) NULL,
    `type` VARCHAR(12) NULL,
    `content` VARCHAR(1000) NULL,
    `actions` JSON NULL,
    `muted` BOOLEAN NOT NULL DEFAULT false,
    `test` BOOLEAN NOT NULL DEFAULT false,
    `searchable` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
