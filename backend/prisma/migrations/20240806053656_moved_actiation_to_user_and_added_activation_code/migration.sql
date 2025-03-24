/*
  Warnings:

  - You are about to drop the column `timezone` on the `Workspace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `activationCode` VARCHAR(191) NULL,
    ADD COLUMN `timezone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Workspace` DROP COLUMN `timezone`;
