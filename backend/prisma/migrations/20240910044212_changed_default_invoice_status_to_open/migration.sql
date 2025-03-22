/*
  Warnings:

  - You are about to alter the column `status` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Invoice` MODIFY `status` ENUM('OPEN', 'PAID') NOT NULL DEFAULT 'OPEN';
