/*
  Warnings:

  - Made the column `status` on table `Workspace` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `status` ENUM('NORMAL', 'INVITED') NOT NULL DEFAULT 'NORMAL';

-- AlterTable
ALTER TABLE `Workspace` MODIFY `status` ENUM('NORMAL', 'HOLD', 'DEACTIVATED', 'DELETED') NOT NULL DEFAULT 'NORMAL';
