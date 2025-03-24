/*
  Warnings:

  - You are about to drop the column `c` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `d` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `p` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `t` on the `Log` table. All the data in the column will be lost.
  - Added the required column `description` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Log` DROP COLUMN `c`,
    DROP COLUMN `d`,
    DROP COLUMN `p`,
    DROP COLUMN `t`,
    ADD COLUMN `cards` JSON NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `projectId` INTEGER NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL DEFAULT '0';
