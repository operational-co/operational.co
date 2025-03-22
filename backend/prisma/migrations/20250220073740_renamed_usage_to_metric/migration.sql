/*
  Warnings:

  - You are about to drop the `Usage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Usage` DROP FOREIGN KEY `Usage_workspaceId_fkey`;

-- DropTable
DROP TABLE `Usage`;

-- CreateTable
CREATE TABLE `Metric` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `month` INTEGER NOT NULL DEFAULT 1,
    `year` INTEGER NOT NULL DEFAULT 2025,
    `events` INTEGER NOT NULL DEFAULT 0,
    `workspaceId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Metric` ADD CONSTRAINT `Metric_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
