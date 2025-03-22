/*
  Warnings:

  - You are about to drop the column `cards` on the `Log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Log` DROP COLUMN `cards`,
    ADD COLUMN `actions` JSON NULL,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `card` JSON NULL,
    MODIFY `description` VARCHAR(191) NULL;
