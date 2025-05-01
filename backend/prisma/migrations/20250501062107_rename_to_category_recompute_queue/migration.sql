/*
  Warnings:

  - You are about to drop the `CategoryRecomputeQuery` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `CategoryRecomputeQuery`;

-- CreateTable
CREATE TABLE `CategoryRecomputeQueue` (
    `workspaceId` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`workspaceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
