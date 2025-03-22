/*
  Warnings:

  - You are about to drop the column `description` on the `Log` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `description` ON `Log`;

-- AlterTable
ALTER TABLE `Log` DROP COLUMN `description`,
    ADD COLUMN `content` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;
