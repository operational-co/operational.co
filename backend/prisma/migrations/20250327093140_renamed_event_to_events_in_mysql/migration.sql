/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Event`;

-- CreateTable
CREATE TABLE `Events` (
    `id` VARCHAR(191) NOT NULL,
    `workspaceId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `actions` JSON NULL,
    `avatar` VARCHAR(191) NULL,
    `content` VARCHAR(1000) NULL,
    `type` ENUM('text', 'rows', 'json') NOT NULL DEFAULT 'text',
    `test` BOOLEAN NOT NULL DEFAULT false,
    `notify` BOOLEAN NOT NULL DEFAULT false,
    `searchable` VARCHAR(1000) NULL,
    `contextId` VARCHAR(191) NULL,
    `contextType` TINYINT NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL,
    `errors` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,

    INDEX `Events_workspaceId_contextType_test_createdAt_idx`(`workspaceId`, `contextType`, `test`, `createdAt`),
    INDEX `Events_workspaceId_contextType_test_category_createdAt_idx`(`workspaceId`, `contextType`, `test`, `category`, `createdAt`),
    INDEX `Events_workspaceId_contextType_contextId_idx`(`workspaceId`, `contextType`, `contextId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
