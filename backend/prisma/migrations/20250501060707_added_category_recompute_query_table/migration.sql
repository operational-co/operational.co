-- AlterTable
ALTER TABLE `Workspace` MODIFY `status` ENUM('NORMAL', 'DEMO', 'TRIAL', 'HOLD', 'DEACTIVATED', 'DELETED') NOT NULL DEFAULT 'NORMAL';

-- CreateTable
CREATE TABLE `CategoryRecomputeQuery` (
    `workspaceId` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`workspaceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
