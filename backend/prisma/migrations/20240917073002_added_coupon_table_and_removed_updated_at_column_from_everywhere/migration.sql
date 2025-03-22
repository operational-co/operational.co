/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Apikey` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Workspace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Apikey` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `Workspace` DROP COLUMN `updatedAt`;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workspaceId` INTEGER NULL,
    `code` VARCHAR(191) NOT NULL DEFAULT '10000EVENTSOFF',
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'INACTIVE',
    `offer` JSON NULL,
    `frequency` VARCHAR(191) NOT NULL DEFAULT 'one_time',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Coupon` ADD CONSTRAINT `Coupon_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
