/*
  Warnings:

  - You are about to drop the column `adminId` on the `Workspace` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Workspace` DROP FOREIGN KEY `Workspace_adminId_fkey`;

-- AlterTable
ALTER TABLE `Workspace` DROP COLUMN `adminId`;
